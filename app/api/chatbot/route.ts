import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return Response.json({
        success: false,
        error: "Message is required"
      }, { status: 400 });
    }

    // Enhanced prompt for interview and DSA focused chatbot
    const prompt = `You are an expert AI assistant specializing in job interviews and Data Structures & Algorithms (DSA). Help users with their interview preparation and technical questions.

User's question: "${message}"

${context ? `Previous context: ${context}` : ''}

Guidelines for your response:
1. Be helpful, accurate, and encouraging
2. Focus on job interview preparation and DSA concepts
3. Provide clear, step-by-step explanations
4. Include relevant examples when helpful
5. Suggest follow-up questions or related topics
6. Keep responses conversational but informative
7. If the question is not related to interviews or DSA, politely redirect to those topics

Please provide a comprehensive but concise response that helps the user with their interview preparation or DSA understanding.`;

    // Generate response using Gemini
    const { text: response } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: prompt,
      maxTokens: 1500,
      temperature: 0.7,
    });

    return Response.json({
      success: true,
      response: response.trim(),
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('Chatbot error details:', error);

    // Enhanced error handling
    if (error instanceof Error) {
      return Response.json({
        success: false,
        error: "Failed to generate response. Please try again.",
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
