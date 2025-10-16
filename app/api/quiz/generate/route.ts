import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MCQQuestion {
  id: number;
  type: 'mcq';
  question: string;
  options: string[];
  correctAnswer: string;
  solution: string;
}

interface GeneratedQuiz {
  questions: MCQQuestion[];
  topic: string;
  difficulty: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, topic = 'General', numQuestions = 5, difficulty = 'medium' } = body;

    if (!text || text.trim().length === 0) {
      return Response.json({
        success: false,
        error: "Text content is required for MCQ generation"
      }, { status: 400 });
    }

    if (numQuestions < 1 || numQuestions > 20) {
      return Response.json({
        success: false,
        error: "Number of questions must be between 1 and 20"
      }, { status: 400 });
    }

    // Construct prompt for OpenAI GPT model
    const prompt = `You are an expert educational content creator specializing in generating high-quality Multiple Choice Questions (MCQs) from textual content.

Your task is to generate ${numQuestions} MCQs from the following text content. Follow this methodology strictly:

METHODOLOGY TO FOLLOW:
1. INPUT TEXT ACQUISITION: Use the provided text as the source material.
2. PREPROCESSING: Clean and understand the text content.
3. KEYWORD/CONCEPT EXTRACTION: Identify important concepts, terms, and key points from the text.
4. QUESTION FORMATION: Create meaningful questions that test understanding of the concepts.
5. DISTRACTOR GENERATION: Create 3 plausible but incorrect options for each question.
6. ANSWER KEY GENERATION: Ensure correct answers are accurate and well-supported by the text.
7. OUTPUT FORMATTING: Structure the output as valid JSON.

TEXT CONTENT:
"${text}"

REQUIREMENTS:
- Generate exactly ${numQuestions} MCQs
- Each question must be multiple choice with 4 options (A, B, C, D)
- One correct answer and three distractors
- Questions should test comprehension, not just recall
- Difficulty level: ${difficulty} (easy: basic facts, medium: understanding, hard: analysis/application)
- Topic: ${topic}
- Provide a brief explanation/solution for each correct answer
- Ensure questions are original and not copied directly from text
- Cover different aspects of the content

OUTPUT FORMAT:
Return a valid JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct Option Text",
      "solution": "Brief explanation of why this is correct and references to the text"
    }
  ],
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "totalQuestions": ${numQuestions}
}

IMPORTANT:
- Make sure the JSON is valid and parseable
- Each question should have exactly 4 options
- The correctAnswer should exactly match one of the options
- Solutions should be educational and reference the source text
- Questions should be challenging but fair for the specified difficulty level`;

    // Call OpenAI GPT-4 model to generate MCQs
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates MCQs from text.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message?.content || '';

    // Parse the JSON response
    let generatedQuiz: GeneratedQuiz;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      generatedQuiz = JSON.parse(jsonMatch[0]);

      if (!generatedQuiz.questions || !Array.isArray(generatedQuiz.questions)) {
        throw new Error('Invalid questions structure');
      }

      generatedQuiz.questions.forEach((q, index) => {
        if (!q.question || !q.options || q.options.length !== 4 || !q.correctAnswer || !q.solution) {
          throw new Error(`Invalid question structure at index ${index}`);
        }
        if (!q.options.includes(q.correctAnswer)) {
          throw new Error(`Correct answer not found in options for question ${index + 1}`);
        }
      });

    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', responseText);

      return Response.json({
        success: false,
        error: "Failed to parse generated MCQs. Please try again.",
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      data: {
        ...generatedQuiz,
        totalQuestions: generatedQuiz.questions.length
      },
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('MCQ Generation error details:', error);

    if (error instanceof Error) {
      return Response.json({
        success: false,
        error: "Failed to generate MCQs. Please try again.",
        message: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    return Response.json({
      success: false,
      error: "An unexpected error occurred during MCQ generation",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    success: true,
    message: "MCQ Generation API using OpenAI GPT-4 model",
    usage: {
      endpoint: "POST /api/quiz/generate",
      body: {
        text: "Text content to generate MCQs from (required)",
        topic: "Topic name (optional, default: 'General')",
        numQuestions: "Number of questions to generate (optional, default: 5, max: 20)",
        difficulty: "Difficulty level: 'easy', 'medium', or 'hard' (optional, default: 'medium')"
      },
      response: {
        success: true,
        data: {
          questions: [
            {
              id: 1,
              type: "mcq",
              question: "Question text?",
              options: ["A", "B", "C", "D"],
              correctAnswer: "Correct option",
              solution: "Explanation"
            }
          ],
          topic: "Topic name",
          difficulty: "Difficulty level",
          totalQuestions: 5
        }
      }
    }
  });
}
