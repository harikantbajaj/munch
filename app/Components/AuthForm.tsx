"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3, "Name must be at least 3 characters") : z.string().optional(),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(7, "Password must be at least 7 characters"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        let userCredentials;
        try {
          userCredentials = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
        } catch (error: any) {
          console.error("Firebase Auth sign-up error:", error);
          toast.error(error.message || "Failed to create account");
          return;
        }
        const idToken = await userCredentials.user.getIdToken();
        const result = await signUp({
          idToken,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message ?? "Failed to create account");
          return;
        }

        // Auto sign in after successful sign up
        try {
          const idToken = await userCredentials.user.getIdToken();
          const signInResult = await signIn({
            email,
            idToken,
          });

          if (signInResult.success) {
            toast.success("Account created and signed in successfully!");
            router.push("/");
          } else {
            toast.error(signInResult.message ?? "Sign in failed after account creation");
            router.push("/sign-in");
          }
        } catch (signInError) {
          console.error("Auto sign-in error:", signInError);
          toast.success("Account created successfully! Please sign in");
          router.push("/sign-in");
        }
      } else {
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in failed");
          return;
        }

        await signIn({
          email,
          idToken,
        });
        toast.success("Welcome back!");
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);

      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        toast.error("Invalid email or password.");
        return;
      }

      if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please sign up first.");
        return;
      }

      if (error.code === "auth/email-already-in-use") {
        toast.error("An account with this email already exists.");
        return;
      }

      if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Please choose a stronger password.");
        return;
      }

      if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
        return;
      }

      toast.error("Error authenticating user");
    } finally {
      setIsLoading(false);
    }
  }

  const isSignin = type === "sign-in";

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold gradient-text">DevPlatform</h2>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isSignin ? "Welcome Back!" : "Create Your Account"}
        </h3>
        <p className="text-gray-600">
          {isSignin 
            ? "Sign in to continue your interview preparation journey" 
            : "Join thousands of developers preparing for their dream jobs"
          }
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!isSignin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <User size={16} />
                  <span>Full Name</span>
                </label>
                <FormField
                  control={form.control}
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Mail size={16} />
                <span>Email Address</span>
              </label>
              <FormField
                control={form.control}
                name="email"
                placeholder="Enter your email"
                type="email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Lock size={16} />
                <span>Password</span>
              </label>
              <div className="relative">
                <FormField
                  control={form.control}
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!isSignin && (
                <p className="text-xs text-gray-500">
                  Password must be at least 7 characters long
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 size={20} className="animate-spin" />
                  <span>{isSignin ? "Signing in..." : "Creating account..."}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{isSignin ? "Sign In" : "Create Account"}</span>
                  <ArrowRight size={20} />
                </div>
              )}
            </Button>
          </form>
        </Form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center space-x-2 text-blue-700">
            <Shield size={16} />
            <span className="text-sm font-medium">Secure & Private</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Your data is encrypted and protected. We never share your information.
          </p>
        </div>

        {/* Switch Form Type */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isSignin ? "Don't have an account?" : "Already have an account?"}
            <Link
              href={isSignin ? "/sign-up" : "/sign-in"}
              className="ml-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isSignin ? "Sign up for free" : "Sign in instead"}
            </Link>
          </p>
        </div>
      </div>

      {/* Features Preview */}
      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
          <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <p className="text-xs text-gray-600">AI Interview Practice</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
          <div className="w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Sparkles size={16} className="text-green-600" />
          </div>
          <p className="text-xs text-gray-600">Smart Feedback</p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
