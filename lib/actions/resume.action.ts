'use server';

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const resumeAnalysisSchema = z.object({
  overallScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Content Quality"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Formatting & Design"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Keywords & ATS Optimization"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Experience & Achievements"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Skills & Competencies"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  suggestedImprovements: z.array(z.string()),
  keywordSuggestions: z.array(z.string()),
  finalAssessment: z.string(),
});

export interface ResumeAnalysis {
  overallScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  suggestedImprovements: string[];
  keywordSuggestions: string[];
  finalAssessment: string;
}

export async function analyzeResume(params: { resumeText: string; jobTitle?: string }): Promise<ResumeAnalysis | null> {
  const { resumeText, jobTitle = "Software Developer" } = params;

  try {
    const {
      object: {
        overallScore,
        categoryScores,
        strengths,
        areasForImprovement,
        suggestedImprovements,
        keywordSuggestions,
        finalAssessment,
      },
    } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: resumeAnalysisSchema,
      prompt: `
        You are an expert resume reviewer and career coach. Analyze the following resume content for a ${jobTitle} position. Provide detailed, constructive feedback to help improve the resume.

        Resume Content:
        ${resumeText}

        Please evaluate the resume on a scale of 0-100 in the following categories:

        1. **Content Quality**: Clarity, relevance, completeness, and professionalism of the content
        2. **Formatting & Design**: Visual appeal, organization, readability, and proper use of formatting
        3. **Keywords & ATS Optimization**: Use of industry-specific keywords and ATS-friendly formatting
        4. **Experience & Achievements**: Quality and impact of work experience descriptions
        5. **Skills & Competencies**: Relevance and presentation of technical and soft skills

        Provide:
        - Specific strengths of the resume
        - Areas that need improvement
        - Concrete suggestions for enhancement
        - Relevant keywords that should be included
        - An overall assessment with actionable advice

        Be thorough, specific, and provide actionable recommendations. Focus on both content and presentation aspects.
      `,
      system:
        "You are a professional resume reviewer with extensive experience in HR, recruitment, and career coaching. Provide detailed, constructive feedback that helps candidates improve their resumes.",
    });

    return {
      overallScore,
      categoryScores,
      strengths,
      areasForImprovement,
      suggestedImprovements,
      keywordSuggestions,
      finalAssessment,
    };
  } catch (error) {
    console.error(`Error analyzing resume: ${error}`);
    return null;
  }
}
