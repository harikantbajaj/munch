import { db } from '@/firebase/admin';
import { getRandomInterviewCover } from '@/lib/utils';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest } from 'next/server';

// GET endpoint for health check
export async function GET() {
  try {
    return Response.json({
      success: true,
      message: "Interview API is running successfully",
      timestamp: new Date().toISOString(),
      version: "2.0"
    }, { status: 200 });
  } catch (error) {
    return Response.json({
      success: false,
      error: "Health check failed"
    }, { status: 500 });
  }
}

// POST endpoint for generating interviews
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json();
    const { type, role, level, techstack, amount, userid } = body;

    // Input validation
    if (!type || !role || !level || !techstack || !amount || !userid) {
      return Response.json({
        success: false,
        error: "Missing required fields",
        required: ["type", "role", "level", "techstack", "amount", "userid"]
      }, { status: 400 });
    }

    // Validate amount is within reasonable limits
    const questionAmount = parseInt(amount);
    if (isNaN(questionAmount) || questionAmount < 1 || questionAmount > 20) {
      return Response.json({
        success: false,
        error: "Amount must be between 1 and 20"
      }, { status: 400 });
    }

    console.log(`Generating interview for ${role} position...`);

    // Enhanced prompt for better question generation
    const prompt = `Generate ${questionAmount} professional interview questions for a ${role} position.

Requirements:
- Experience Level: ${level}
- Technology Stack: ${techstack}
- Focus: ${type} (behavioral vs technical balance)
- Format: Return ONLY a valid JSON array of strings
- Voice-friendly: No special characters like "/", "*", or complex formatting
- Professional tone: Suitable for real interview scenarios

Example format: ["Question 1 here", "Question 2 here", "Question 3 here"]

Generate exactly ${questionAmount} questions that are:
1. Relevant to the ${role} role
2. Appropriate for ${level} experience level
3. Incorporating ${techstack} technologies where applicable
4. Balanced towards ${type} interview style
5. Clear and conversational for voice interaction`;

    // Generate questions using Gemini
    const { text: questionsResponse } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });

    let parsedQuestions;
    try {
      // Clean the response and parse JSON
      const cleanedResponse = questionsResponse
        .replace(/```/g, '')
        .trim();
      
      parsedQuestions = JSON.parse(cleanedResponse);
      
      // Validate the parsed questions
      if (!Array.isArray(parsedQuestions)) {
        throw new Error("Response is not an array");
      }
      
      if (parsedQuestions.length !== questionAmount) {
        console.warn(`Expected ${questionAmount} questions, got ${parsedQuestions.length}`);
      }
      
      // Ensure all questions are strings and not empty
      parsedQuestions = parsedQuestions
        .filter(q => typeof q === 'string' && q.trim().length > 0)
        .slice(0, questionAmount);
        
    } catch (parseError) {
      console.error('Failed to parse questions:', parseError);
      return Response.json({
        success: false,
        error: "Failed to generate valid questions. Please try again.",
        details: "AI response parsing failed"
      }, { status: 500 });
    }

    // Create interview object with enhanced metadata
    const interview = {
      role: role.trim(),
      type: type.trim(),
      level: level.trim(),
      techstack: Array.isArray(techstack) 
        ? techstack 
        : techstack.split(',').map((tech: string) => tech.trim()),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImg: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questionCount: parsedQuestions.length,
      difficulty: level,
      status: 'active',
      metadata: {
        generatedBy: 'gemini-2.0-flash-001',
        promptVersion: '2.0',
        requestTimestamp: new Date().toISOString()
      }
    };

    // Save to database
    const docRef = await db.collection('interviews').add(interview);
    
    console.log(`Interview created successfully with ID: ${docRef.id}`);

    return Response.json({
      success: true,
      data: {
        interviewId: docRef.id,
        questionCount: parsedQuestions.length,
        role: role,
        type: type,
        level: level
      },
      message: "Interview generated successfully"
    }, { status: 200 });

  } catch (error) {
    console.error('Interview generation error:', error);
    
    // Enhanced error handling
    if (error instanceof Error) {
      return Response.json({
        success: false,
        error: "Failed to generate interview",
        message: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    return Response.json({
      success: false,
      error: "An unexpected error occurred",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
