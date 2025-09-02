import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, type Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getPerformance, type FirebasePerformance } from "firebase/performance";

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Services interface  
interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  analytics?: Analytics;
  performance?: FirebasePerformance;
}

// Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyANzCv7OOOd85GPe_m37x-QXShoAX_upK8",
  authDomain: "interview-preply.firebaseapp.com",
  projectId: "interview-preply",
  storageBucket: "interview-preply.appspot.com", 
  messagingSenderId: "888765092483",
  appId: "1:888765092483:web:d53838c222ea1d6489c1b6",
  measurementId: "G-W9VK64GEPD"
};

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isClient = typeof window !== 'undefined';

// Initialize Firebase with enhanced error handling
const initializeFirebaseClient = (): FirebaseServices => {
  try {
    console.log("🔧 Initializing Firebase Client SDK...");

    // Check if app is already initialized
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    console.log(`📱 Firebase app initialized: ${app.name}`);
    console.log(`🏗️ Environment: ${process.env.NODE_ENV || 'unknown'}`);
    console.log(`🌐 Project: ${firebaseConfig.projectId}`);

    // Initialize core services
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Set up Auth settings
    auth.useDeviceLanguage();
    
    // Initialize optional services (client-side only)
    let analytics: Analytics | undefined;
    let performance: FirebasePerformance | undefined;

    if (isClient) {
      try {
        // Analytics (only in production and client-side)
        if (isProduction && firebaseConfig.measurementId) {
          analytics = getAnalytics(app);
          console.log("📊 Firebase Analytics initialized");
        }

        // Performance monitoring (production only)
        if (isProduction) {
          performance = getPerformance(app);
          console.log("⚡ Firebase Performance initialized");
        }
      } catch (analyticsError) {
        console.warn("⚠️ Optional Firebase services initialization failed:", analyticsError);
      }
    }

    // Connect to emulators in development
    if (isDevelopment && isClient) {
      setupEmulators(auth, db);
    }

    console.log("✅ Firebase Client SDK initialized successfully");

    return {
      app,
      auth,
      db,
      analytics,
      performance,
    };

  } catch (error) {
    console.error("❌ Firebase Client initialization failed:", error);
    throw new Error(
      `Firebase Client initialization failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Setup emulators for development
const setupEmulators = (auth: Auth, db: Firestore) => {
  try {
    const authEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL || "http://localhost:9099";
    const firestoreEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST || "localhost";
    const firestoreEmulatorPort = parseInt(process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT || "8080");

    // Check if emulators are already connected
    if (!auth.config.emulator) {
      connectAuthEmulator(auth, authEmulatorUrl);
      console.log(`🔧 Connected to Auth Emulator: ${authEmulatorUrl}`);
    }

    if (!db._delegate._databaseId._emulator) {
      connectFirestoreEmulator(db, firestoreEmulatorHost, firestoreEmulatorPort);
      console.log(`🔧 Connected to Firestore Emulator: ${firestoreEmulatorHost}:${firestoreEmulatorPort}`);
    }

    console.log("🧪 Firebase Emulators connected successfully");
  } catch (emulatorError) {
    console.warn("⚠️ Failed to connect to Firebase Emulators:", emulatorError);
    console.log("📝 Make sure Firebase Emulators are running: firebase emulators:start");
  }
};

// Initialize and export Firebase services
const firebaseServices = initializeFirebaseClient();

export const app = firebaseServices.app;
export const auth = firebaseServices.auth;
export const db = firebaseServices.db;
export const analytics = firebaseServices.analytics;
export const performance = firebaseServices.performance;

// Client utilities
export const clientUtils = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return auth.currentUser !== null;
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    return auth.currentUser;
  },

  /**
   * Wait for auth state to be determined
   */
  waitForAuthState: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(!!user);
      });
    });
  },

  /**
   * Sign out current user
   */
  signOut: async () => {
    try {
      await auth.signOut();
      console.log("👋 User signed out successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Sign out failed:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Sign out failed" 
      };
    }
  },

  /**
   * Get Firebase configuration (for debugging)
   */
  getConfig: () => ({
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    environment: process.env.NODE_ENV,
    emulators: isDevelopment,
  }),

  /**
   * Health check for client services
   */
  healthCheck: async () => {
    try {
      // Test Firestore connection
      await db.enableNetwork();
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        services: {
          firestore: "connected",
          auth: auth.currentUser ? "authenticated" : "unauthenticated",
          analytics: analytics ? "enabled" : "disabled",
          performance: performance ? "enabled" : "disabled",
        },
        environment: process.env.NODE_ENV,
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

// Development logging
if (isDevelopment && isClient) {
  console.log("🔥 Firebase Client SDK initialized in development mode");
  console.log("🔍 Available services:", Object.keys(firebaseServices));
  
  // Log auth state changes in development
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("👤 User authenticated:", user.uid);
    } else {
      console.log("👻 User not authenticated");
    }
  });
}

// Export types for TypeScript support
export type FirebaseClientServices = FirebaseServices;
export type ClientUtils = typeof clientUtils;

// Default export
export default {
  app,
  auth,
  db,
  analytics,
  performance,
  clientUtils,
  config: firebaseConfig,
};
