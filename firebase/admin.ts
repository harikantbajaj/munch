import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Interfaces for better type safety
interface FirebaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

interface FirebaseServices {
  auth: Auth;
  db: Firestore;
  app: App;
}

// Validation function for environment variables
const validateEnvironmentVariables = (): FirebaseConfig => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing required Firebase environment variables. Please check:\n" +
      "- FIREBASE_PROJECT_ID\n" +
      "- FIREBASE_CLIENT_EMAIL\n" +
      "- FIREBASE_PRIVATE_KEY"
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"), // Handle escaped newlines
  };
};

// Initialize Firebase Admin with enhanced error handling
const initializeFirebaseAdmin = (): FirebaseServices => {
  try {
    // Check if Firebase Admin is already initialized
    const existingApps = getApps();
    
    if (existingApps.length > 0) {
      console.log("📱 Firebase Admin already initialized, reusing existing instance");
      const app = existingApps[0];
      return {
        auth: getAuth(app),
        db: getFirestore(app),
        app,
      };
    }

    // Validate environment variables
    const config = validateEnvironmentVariables();

    console.log("🔧 Initializing Firebase Admin SDK...");
    
    // Initialize Firebase Admin
    const app = initializeApp({
      credential: cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey,
      }),
      // Optional: Add database URL if using Realtime Database
      // databaseURL: `https://${config.projectId}-default-rtdb.firebaseio.com`,
    });

    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log("✅ Firebase Admin SDK initialized successfully");
    console.log(`📊 Project ID: ${config.projectId}`);
    
    return { auth, db, app };

  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error);
    throw new Error(
      `Firebase Admin initialization failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Export the initialized services
export const { auth, db, app } = initializeFirebaseAdmin();

// Utility functions for common operations
export const adminUtils = {
  /**
   * Verify a Firebase ID token
   */
  verifyIdToken: async (idToken: string) => {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return { success: true, uid: decodedToken.uid, decodedToken };
    } catch (error) {
      console.error("Token verification failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  },

  /**
   * Get user by UID
   */
  getUserByUid: async (uid: string) => {
    try {
      const userRecord = await auth.getUser(uid);
      return { success: true, user: userRecord };
    } catch (error) {
      console.error("Failed to get user:", error);
      return { success: false, error: error instanceof Error ? error.message : "User not found" };
    }
  },

  /**
   * Create a custom token
   */
  createCustomToken: async (uid: string, additionalClaims?: object) => {
    try {
      const customToken = await auth.createCustomToken(uid, additionalClaims);
      return { success: true, token: customToken };
    } catch (error) {
      console.error("Failed to create custom token:", error);
      return { success: false, error: error instanceof Error ? error.message : "Token creation failed" };
    }
  },

  /**
   * Batch operations helper
   */
  createBatch: () => db.batch(),

  /**
   * Health check for Firebase services
   */
  healthCheck: async () => {
    try {
      // Test Firestore connection
      await db.collection("_health").limit(1).get();
      
      // Test Auth service
      await auth.listUsers(1);
      
      return { 
        success: true, 
        timestamp: new Date().toISOString(),
        services: {
          firestore: "healthy",
          auth: "healthy"
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Health check failed",
        timestamp: new Date().toISOString(),
      };
    }
  }
};

// Export types for better TypeScript support
export type FirebaseAdminServices = FirebaseServices;
export type AdminUtils = typeof adminUtils;

// Development utilities (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log("🔥 Firebase Admin SDK initialized in development mode");
  
  // Optional: Run health check in development
  adminUtils.healthCheck().then(result => {
    if (result.success) {
      console.log("💚 Firebase Admin health check passed");
    } else {
      console.error("💔 Firebase Admin health check failed:", result.error);
    }
  });
}

export default { auth, db, app, adminUtils };
