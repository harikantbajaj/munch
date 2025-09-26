"use server";

import { auth, db, adminUtils } from "@/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

// === CONSTANTS ===
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7; // 7 days in seconds
const ONE_WEEK_MS = ONE_WEEK_SECONDS * 1000; // 7 days in milliseconds

// === VALIDATION SCHEMAS ===
const signUpSchema = z.object({
  idToken: z.string().min(1, "ID token is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"), // Not stored, just validated
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  idToken: z.string().min(1, "ID token is required"),
});

export interface SignUpParams {
  idToken: string;
  name: string;
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  idToken: string;
}

// === TYPES ===
export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  redirectTo?: string;
}

export interface SessionInfo {
  user: User;
  sessionExpiry: string;
  isValid: boolean;
}

// === UTILITY FUNCTIONS ===
const logAuthEvent = (event: string, details: any) => {
  const timestamp = new Date().toISOString();
  console.log(`🔐 [AUTH ${timestamp}] ${event}:`, details);
};

const sanitizeError = (error: any): string => {
  // Don't expose sensitive Firebase error details to client
  if (error?.code) {
    switch (error.code) {
      case "auth/user-not-found":
        return "User not found. Please check your credentials.";
      case "auth/email-already-exists":
        return "An account with this email already exists.";
      case "auth/invalid-id-token":
        return "Invalid authentication token. Please sign in again.";
      case "auth/id-token-expired":
        return "Your session has expired. Please sign in again.";
      case "auth/session-cookie-expired":
        return "Your session has expired. Please sign in again.";
      default:
        return "Authentication failed. Please try again.";
    }
  }
  return "An unexpected error occurred. Please try again.";
};

// === AUTHENTICATION ACTIONS ===

/**
 * Create a new user account
 */
export async function signUp(params: SignUpParams): Promise<AuthResult> {
  try {
    // Validate input
    const validatedData = signUpSchema.parse(params);
    const { idToken, name, email } = validatedData;

    logAuthEvent("SIGNUP_ATTEMPT", { email });

    // Verify the ID token and get user info
    const tokenVerification = await adminUtils.verifyIdToken(idToken);
    if (!tokenVerification.success) {
      logAuthEvent("SIGNUP_FAILED", { email, reason: "INVALID_TOKEN" });
      return {
        success: false,
        message: "Invalid authentication token. Please try again.",
      };
    }

    const uid = tokenVerification.uid;

    // Check if user already exists in Firestore
    const existingUser = await db.collection("users").doc(uid).get();
    
    if (existingUser.exists) {
      logAuthEvent("SIGNUP_FAILED", { email, uid, reason: "USER_EXISTS" });
      return {
        success: false,
        message: "An account with this email already exists. Please sign in instead.",
        redirectTo: "/sign-in",
      };
    }

    // Create user document in Firestore
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profileComplete: false,
      interviewsCompleted: 0,
      totalScore: 0,
      preferences: {
        theme: "system",
        notifications: true,
        emailUpdates: true,
      },
    };

    await db.collection("users").doc(uid).set(userData);

    logAuthEvent("SIGNUP_SUCCESS", { email, uid });

    return {
      success: true,
      message: "Account created successfully!",
      redirectTo: "/",
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      logAuthEvent("SIGNUP_VALIDATION_ERROR", { error: firstError.message });
      return {
        success: false,
        message: firstError.message,
      };
    }

    logAuthEvent("SIGNUP_ERROR", { error: error instanceof Error ? error.message : "Unknown error" });
    console.error("Sign up error:", error);

    return {
      success: false,
      message: sanitizeError(error),
    };
  }
}

/**
 * Create and set a secure session cookie
 */
export async function setSessionCookie(idToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();

    // Create session cookie with Firebase Admin
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: ONE_WEEK_MS,
    });

    // Set secure HTTP-only cookie
    cookieStore.set("session", sessionCookie, {
      maxAge: ONE_WEEK_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true };

  } catch (error) {
    console.error("Session cookie error:", error);
    return { 
      success: false, 
      error: sanitizeError(error),
    };
  }
}

/**
 * Sign in user with email and ID token
 */
export async function signIn(params: SignInParams): Promise<AuthResult> {
  try {
    // Validate input
    const validatedData = signInSchema.parse(params);
    const { email, idToken } = validatedData;

    logAuthEvent("SIGNIN_ATTEMPT", { email });

    // Verify the ID token and get user info
    const tokenVerification = await adminUtils.verifyIdToken(idToken);
    if (!tokenVerification.success) {
      logAuthEvent("SIGNIN_FAILED", { email, reason: "INVALID_TOKEN" });
      return {
        success: false,
        message: "Invalid authentication token. Please try again.",
      };
    }

    // Get user from Firebase Auth
    const userRecord = await adminUtils.getUserByUid(tokenVerification.uid);
    if (!userRecord.success || !userRecord.user) {
      logAuthEvent("SIGNIN_FAILED", { email, reason: "USER_NOT_FOUND" });
      return {
        success: false,
        message: "User account not found. Please create an account first.",
        redirectTo: "/sign-up",
      };
    }

    const authUser = userRecord.user;

    // Ensure user exists in Firestore
    let firestoreUser = await db.collection("users").doc(tokenVerification.uid).get();
    
    if (!firestoreUser.exists) {
      // Create user document if it doesn't exist (edge case)
      const userData = {
        name: authUser.displayName || email.split("@")[0],
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileComplete: false,
        interviewsCompleted: 0,
        totalScore: 0,
        preferences: {
          theme: "system",
          notifications: true,
          emailUpdates: true,
        },
      };

      await db.collection("users").doc(tokenVerification.uid).set(userData);
      firestoreUser = await db.collection("users").doc(tokenVerification.uid).get();
    }

    if (!firestoreUser.exists) {
      logAuthEvent("SIGNIN_FAILED", { email, reason: "FIRESTORE_USER_NOT_FOUND" });
      return {
        success: false,
        message: "Failed to retrieve user data. Please try again.",
      };
    }

    // Update last login
    await db.collection("users").doc(tokenVerification.uid).update({
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Set session cookie
    const sessionResult = await setSessionCookie(idToken);
    if (!sessionResult.success) {
      logAuthEvent("SIGNIN_FAILED", { email, reason: "SESSION_ERROR" });
      return {
        success: false,
        message: sessionResult.error ?? "Failed to create session. Please try again.",
      };
    }

    const userData = firestoreUser.data() as User;
    logAuthEvent("SIGNIN_SUCCESS", { email, uid: tokenVerification.uid });

    return {
      success: true,
      message: `Welcome back, ${userData.name}!`,
      user: {
        ...userData,
        id: tokenVerification.uid,
      },
      redirectTo: "/",
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      logAuthEvent("SIGNIN_VALIDATION_ERROR", { error: firstError.message });
      return {
        success: false,
        message: firstError.message,
      };
    }

    logAuthEvent("SIGNIN_ERROR", { error: error instanceof Error ? error.message : "Unknown error" });
    console.error("Sign in error:", error);

    return {
      success: false,
      message: sanitizeError(error),
    };
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return null;
    }

    // Verify session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Get user data from Firestore
    const userDoc = await db.collection("users").doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      logAuthEvent("GET_USER_FAILED", { uid: decodedClaims.uid, reason: "USER_DOC_NOT_FOUND" });
      return null;
    }

    const userData = userDoc.data() as User;
    
    return {
      ...userData,
      id: decodedClaims.uid,
    };

  } catch (error) {
    // Session expired or invalid - this is normal, don't log as error
    if (error instanceof Error && error.message.includes("expired")) {
      return null;
    }

    // Clear invalid session cookie to prevent repeated errors
    const cookieStore = await cookies();
    cookieStore.delete("session");

    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Get detailed session information
 */
export async function getSessionInfo(): Promise<SessionInfo | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return null;
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userDoc = await db.collection("users").doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data() as User;
    
    return {
      user: {
        ...userData,
        id: decodedClaims.uid,
      },
      sessionExpiry: new Date(decodedClaims.exp * 1000).toISOString(),
      isValid: true,
    };

  } catch (error) {
    return null;
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<AuthResult> {
  try {
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    
    // Clear session cookie
    cookieStore.delete("session");

    if (user) {
      logAuthEvent("SIGNOUT_SUCCESS", { uid: user.id });
    }

    return {
      success: true,
      message: "You have been signed out successfully.",
      redirectTo: "/sign-in",
    };

  } catch (error) {
    console.error("Sign out error:", error);
    
    // Even if there's an error, clear the cookie
    const cookieStore = await cookies();
    cookieStore.delete("session");
    
    return {
      success: true, // Always return success for sign out
      message: "Signed out successfully.",
      redirectTo: "/sign-in",
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: Partial<User>): Promise<AuthResult> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: "You must be signed in to update your profile.",
        redirectTo: "/sign-in",
      };
    }

    // Sanitize updates - only allow certain fields
    const allowedFields = ["name", "preferences", "profileComplete"];
    const sanitizedUpdates: any = {
      updatedAt: new Date().toISOString(),
    };

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key as keyof User] !== undefined) {
        sanitizedUpdates[key] = updates[key as keyof User];
      }
    });

    await db.collection("users").doc(user.id).update(sanitizedUpdates);

    logAuthEvent("PROFILE_UPDATED", { uid: user.id, fields: Object.keys(sanitizedUpdates) });

    return {
      success: true,
      message: "Profile updated successfully.",
    };

  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    };
  }
}

/**
 * Require authentication - redirect if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  return user;
}

/**
 * Delete user account (soft delete)
 */
export async function deleteAccount(): Promise<AuthResult> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: "You must be signed in to delete your account.",
        redirectTo: "/sign-in",
      };
    }

    // Soft delete - mark as deleted but keep data for audit
    await db.collection("users").doc(user.id).update({
      deletedAt: new Date().toISOString(),
      isDeleted: true,
      email: `deleted_${user.id}@deleted.com`, // Anonymize email
      name: "Deleted User",
    });

    // Sign out user
    await signOut();

    logAuthEvent("ACCOUNT_DELETED", { uid: user.id });

    return {
      success: true,
      message: "Your account has been deleted successfully.",
      redirectTo: "/sign-in",
    };

  } catch (error) {
    console.error("Account deletion error:", error);
    return {
      success: false,
      message: "Failed to delete account. Please try again.",
    };
  }
}
