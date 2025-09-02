"use server";

import { feedbackSchema, technologyMappings, APP_CONFIG } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { getCurrentUser } from "./auth.action";

// === VALIDATION SCHEMAS ===
const createFeedbackSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  interviewId: z.string().min(1, "Interview ID is required"),
  transcript: z.array(z.object({
    role: z.enum(["user", "system", "assistant"]),
    content: z.string().min(1, "Message content is required"),
    timestamp: z.date().optional(),
  })).min(1, "Transcript cannot be empty"),
});

const getLatestInterviewsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  limit: z.number().min(1).max(50).default(10),
  type: z.string().optional(),
  level: z.string().optional(),
});

// === UTILITY FUNCTIONS ===
const logAction = (action: string, details: any) => {
  const timestamp = new Date().toISOString();
  console.log(`🎯 [ACTION ${timestamp}] ${action}:`, details);
};

const validateUserAccess = async (resourceUserId: string): Promise<{ authorized: boolean; user?: User }> => {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return { authorized: false };
  }
  
  if (currentUser.id !== resourceUserId) {
    return { authorized: false, user: currentUser };
  }
  
  return { authorized: true, user: currentUser };
};

// === INTERVIEW MANAGEMENT ===

/**
 * Get interviews by user ID with pagination and filtering
 */
export async function getInterviewsByUserId(
  userId: string,
  options: {
    limit?: number;
    startAfter?: string;
    type?: string;
    level?: string;
  } = {}
): Promise<{
  interviews: Interview[];
  hasMore: boolean;
  total: number;
}> {
  try {
    // Validate user access
    const { authorized } = await validateUserAccess(userId);
    if (!authorized) {
      throw new Error("Unauthorized access to interviews");
    }

    const { limit = 10, startAfter, type, level } = options;
    
    logAction("GET_USER_INTERVIEWS", { userId, options });

    let query = db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc");

    // Add filters
    if (type) {
      query = query.where("type", "==", type);
    }
    
    if (level) {
      query = query.where("level", "==", level);
    }

    // Add pagination
    if (startAfter) {
      const startAfterDoc = await db.collection("interviews").doc(startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }

    const interviews = await query.limit(limit + 1).get(); // Fetch one extra to check if there are more

    // Get total count for user
    const totalQuery = db.collection("interviews").where("userId", "==", userId);
    const totalSnapshot = await totalQuery.count().get();
    const total = totalSnapshot.data().count;

    const interviewData = interviews.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    const hasMore = interviews.docs.length > limit;

    return {
      interviews: interviewData,
      hasMore,
      total,
    };

  } catch (error) {
    console.error("Get user interviews error:", error);
    throw new Error("Failed to fetch interviews");
  }
}

/**
 * Get latest public interviews with enhanced filtering
 */
export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<{
  interviews: Interview[];
  hasMore: boolean;
  total: number;
}> {
  try {
    const validatedParams = getLatestInterviewsSchema.parse(params);
    const { userId, limit, type, level } = validatedParams;

    logAction("GET_LATEST_INTERVIEWS", { userId, limit, type, level });

    let query = db
      .collection("interviews")
      .where("finalized", "==", true)
      .orderBy("createdAt", "desc");

    // Add filters
    if (type) {
      query = query.where("type", "==", type);
    }
    
    if (level) {
      query = query.where("level", "==", level);
    }

    // Fetch more than needed to filter out user's own interviews
    const interviews = await query.limit(limit * 3).get();

    const filteredInterviews = interviews.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Interview))
      .filter((interview) => interview.userId !== userId)
      .slice(0, limit);

    // Get total count of public interviews
    let total = 0;
    try {
      const totalQuery = db.collection("interviews").where("finalized", "==", true);
      const totalSnapshot = await totalQuery.count().get();
      total = totalSnapshot.data().count;
    } catch (countError) {
      console.warn("Count query failed, possibly due to missing Firestore index:", countError);
      // Fallback: set total to filteredInterviews length to avoid breaking UI
      total = filteredInterviews.length;
    }

    return {
      interviews: filteredInterviews,
      hasMore: filteredInterviews.length === limit,
      total,
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors[0].message}`);
    }
    console.error("Get latest interviews error:", error);
    throw new Error("Failed to fetch latest interviews");
  }
}

/**
 * Get interview by ID with access control
 */
export async function getInterviewById(interviewId: string): Promise<Interview | null> {
  try {
    logAction("GET_INTERVIEW_BY_ID", { interviewId });

    const interviewDoc = await db.collection("interviews").doc(interviewId).get();
    
    if (!interviewDoc.exists) {
      return null;
    }

    const interview = { id: interviewDoc.id, ...interviewDoc.data() } as Interview;
    
    // Check if user has access (owns interview or interview is finalized/public)
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      throw new Error("Authentication required");
    }

    const hasAccess = interview.userId === currentUser.id || interview.finalized;
    
    if (!hasAccess) {
      throw new Error("Access denied to this interview");
    }

    return interview;

  } catch (error) {
    console.error("Get interview by ID error:", error);
    return null;
  }
}

/**
 * Create interview with enhanced validation
 */
export async function createInterview(params: {
  role: string;
  type: string;
  level: string;
  techstack: string[];
  questions: string[];
  estimatedDuration?: number;
}): Promise<{ success: boolean; interviewId?: string; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return { success: false, error: "Authentication required" };
    }

    const { role, type, level, techstack, questions, estimatedDuration } = params;

    // Validate input
    if (!role || !type || !level || !techstack.length || !questions.length) {
      return { success: false, error: "All fields are required" };
    }

    if (questions.length > APP_CONFIG.MAX_QUESTIONS_COUNT) {
      return { success: false, error: `Maximum ${APP_CONFIG.MAX_QUESTIONS_COUNT} questions allowed` };
    }

    // Normalize technology stack
    const normalizedTechStack = techstack.map(tech => 
      technologyMappings[tech.toLowerCase() as keyof typeof technologyMappings] || tech
    );

    const interviewData = {
      userId: currentUser.id,
      role: role.trim(),
      type: type.trim(),
      level: level.trim(),
      techstack: normalizedTechStack,
      questions: questions.map(q => q.trim()),
      finalized: true,
      coverImg: `/covers/${normalizedTechStack[0]?.toLowerCase() || 'default'}.png`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDuration: estimatedDuration || APP_CONFIG.DEFAULT_QUESTIONS_COUNT * 5, // 5 mins per question
      difficulty: level,
      status: "active",
    };

    const docRef = await db.collection("interviews").add(interviewData);

    // Update user interview count
    await db.collection("users").doc(currentUser.id).update({
      interviewsCreated: (currentUser as any).interviewsCreated + 1 || 1,
      updatedAt: new Date().toISOString(),
    });

    logAction("INTERVIEW_CREATED", { interviewId: docRef.id, userId: currentUser.id, role, type });

    return { success: true, interviewId: docRef.id };

  } catch (error) {
    console.error("Create interview error:", error);
    return { success: false, error: "Failed to create interview" };
  }
}

// === FEEDBACK MANAGEMENT ===

/**
 * Create comprehensive AI feedback with enhanced analysis
 */
export async function createFeedback(params: CreateFeedbackParams): Promise<{
  success: boolean;
  feedbackId?: string;
  error?: string;
}> {
  try {
    // Validate input
    const validatedParams = createFeedbackSchema.parse(params);
    const { userId, interviewId, transcript } = validatedParams;

    // Validate user access
    const { authorized, user } = await validateUserAccess(userId);
    if (!authorized || !user) {
      return { success: false, error: "Unauthorized access" };
    }

    logAction("CREATE_FEEDBACK_START", { userId, interviewId, transcriptLength: transcript.length });

    // Get interview details for context
    const interview = await getInterviewById(interviewId);
    if (!interview) {
      return { success: false, error: "Interview not found" };
    }

    // Format transcript for AI analysis
    const formattedTranscript = transcript
      .map(({ role, content }, index) => `${index + 1}. ${role.toUpperCase()}: ${content}`)
      .join("\n\n");

    // Enhanced AI prompt for better feedback
    const prompt = `You are an expert technical interviewer analyzing a mock interview session. 
    
INTERVIEW CONTEXT:
- Role: ${interview.role}
- Level: ${interview.level}
- Type: ${interview.type}
- Technologies: ${interview.techstack.join(", ")}
- Duration: Approximately ${transcript.length} exchanges

TRANSCRIPT:
${formattedTranscript}

ANALYSIS INSTRUCTIONS:
Please provide a comprehensive evaluation with specific, actionable feedback. Be thorough but constructive.

SCORING CRITERIA (0-100):
- Communication Skills: Clarity, articulation, professional presentation
- Technical Knowledge: Understanding of role-relevant concepts and technologies
- Problem Solving: Analytical thinking, approach to challenges, solution quality
- Cultural Fit: Professional demeanor, collaboration indicators, company alignment
- Confidence and Clarity: Self-assurance, clear responses, engagement level

REQUIREMENTS:
- Provide specific examples from the transcript
- Offer actionable improvement suggestions
- Be encouraging while identifying areas for growth
- Consider the experience level (${interview.level}) in your evaluation
- Focus on interview performance, not just technical accuracy`;

    // Generate AI feedback
    const aiStartTime = Date.now();
    
    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt,
      system: "You are a professional interview coach providing detailed, constructive feedback to help candidates improve their interview skills.",
    });

    const aiDuration = Date.now() - aiStartTime;

    // Prepare feedback data
    const feedbackData = {
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
      interviewContext: {
        role: interview.role,
        level: interview.level,
        type: interview.type,
        techstack: interview.techstack,
        transcriptLength: transcript.length,
      },
      metadata: {
        aiModel: "gemini-2.0-flash-001",
        processingTime: aiDuration,
        promptVersion: "2.0",
      },
    };

    // Save feedback to Firestore
    const feedbackRef = await db.collection("feedback").add(feedbackData);

    // Update user statistics
    const userUpdates: any = {
      interviewsCompleted: (user as any).interviewsCompleted + 1 || 1,
      updatedAt: new Date().toISOString(),
    };

    // Update average score if this isn't the first interview
    if ((user as any).interviewsCompleted > 0) {
      const currentTotal = (user as any).totalScore || 0;
      const newTotal = currentTotal + totalScore;
      const newAverage = Math.round(newTotal / ((user as any).interviewsCompleted + 1));
      userUpdates.averageScore = newAverage;
      userUpdates.totalScore = newTotal;
    } else {
      userUpdates.averageScore = totalScore;
      userUpdates.totalScore = totalScore;
    }

    await db.collection("users").doc(userId).update(userUpdates);

    logAction("FEEDBACK_CREATED", {
      feedbackId: feedbackRef.id,
      userId,
      interviewId,
      totalScore,
      aiDuration,
    });

    return { success: true, feedbackId: feedbackRef.id };

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Feedback validation error:", error.errors);
      return { success: false, error: `Validation error: ${error.errors[0].message}` };
    }

    console.error("Create feedback error:", error);
    logAction("FEEDBACK_ERROR", { error: error instanceof Error ? error.message : "Unknown error" });
    
    return { success: false, error: "Failed to generate feedback. Please try again." };
  }
}

/**
 * Get feedback by interview ID with enhanced data
 */
export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<{
  feedback: Feedback | null;
  canAccess: boolean;
  error?: string;
}> {
  try {
    const { interviewId, userId } = params;

    // Validate user access
    const { authorized } = await validateUserAccess(userId);
    if (!authorized) {
      return { feedback: null, canAccess: false, error: "Unauthorized access" };
    }

    logAction("GET_FEEDBACK", { interviewId, userId });

    const feedbackQuery = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (feedbackQuery.empty) {
      return { feedback: null, canAccess: true };
    }

    const feedbackDoc = feedbackQuery.docs[0];
    const feedback = {
      id: feedbackDoc.id,
      ...feedbackDoc.data(),
    } as Feedback;

    return { feedback, canAccess: true };

  } catch (error) {
    console.error("Get feedback error:", error);
    return { 
      feedback: null, 
      canAccess: false, 
      error: "Failed to fetch feedback" 
    };
  }
}

/**
 * Get user feedback history with statistics
 */
export async function getUserFeedbackHistory(userId: string, limit = 10): Promise<{
  feedbacks: Feedback[];
  statistics: {
    averageScore: number;
    totalInterviews: number;
    improvementTrend: "improving" | "declining" | "stable";
    topStrengths: string[];
    commonImprovements: string[];
  };
}> {
  try {
    // Validate user access
    const { authorized } = await validateUserAccess(userId);
    if (!authorized) {
      throw new Error("Unauthorized access");
    }

    const feedbackQuery = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const feedbacks = feedbackQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];

    // Calculate statistics
    const scores = feedbacks.map(f => f.totalScore);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    
    // Determine trend (compare first half with second half)
    let improvementTrend: "improving" | "declining" | "stable" = "stable";
    if (scores.length >= 4) {
      const mid = Math.floor(scores.length / 2);
      const recentAvg = scores.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
      const olderAvg = scores.slice(mid).reduce((a, b) => a + b, 0) / (scores.length - mid);
      
      if (recentAvg > olderAvg + 5) improvementTrend = "improving";
      else if (recentAvg < olderAvg - 5) improvementTrend = "declining";
    }

    // Extract common strengths and improvements
    const allStrengths = feedbacks.flatMap(f => f.strengths || []);
    const allImprovements = feedbacks.flatMap(f => f.areasForImprovement || []);
    
    const topStrengths = [...new Set(allStrengths)].slice(0, 5);
    const commonImprovements = [...new Set(allImprovements)].slice(0, 5);

    return {
      feedbacks,
      statistics: {
        averageScore,
        totalInterviews: feedbacks.length,
        improvementTrend,
        topStrengths,
        commonImprovements,
      },
    };

  } catch (error) {
    console.error("Get feedback history error:", error);
    throw new Error("Failed to fetch feedback history");
  }
}

/**
 * Delete feedback (soft delete)
 */
/**
 * Delete feedback (soft delete)
 */
export async function deleteFeedback(feedbackId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Authentication required" };
    }

    // Get feedback to verify ownership
    const feedbackDoc = await db.collection("feedback").doc(feedbackId).get();
    
    if (!feedbackDoc.exists) {
      return { success: false, error: "Feedback not found" };
    }

    // Get document data and check if it has the required properties
    const feedbackData = feedbackDoc.data();
    
    if (!feedbackData) {
      return { success: false, error: "Invalid feedback document" };
    }

    // Runtime check for userId property
    if (!('userId' in feedbackData) || typeof feedbackData.userId !== 'string') {
      console.error('Feedback document missing or invalid userId:', feedbackData);
      return { success: false, error: "Invalid feedback data structure" };
    }

    // Now we can safely access userId
    if (feedbackData.userId !== currentUser.id) {
      return { success: false, error: "Unauthorized access" };
    }

    // Soft delete
    await db.collection("feedback").doc(feedbackId).update({
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    });

    logAction("FEEDBACK_DELETED", { feedbackId, userId: currentUser.id });

    return { success: true };

  } catch (error) {
    console.error("Delete feedback error:", error);
    return { success: false, error: "Failed to delete feedback" };
  }
}
