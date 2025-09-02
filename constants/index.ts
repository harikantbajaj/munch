import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

// === TECHNOLOGY MAPPINGS ===
export const technologyMappings = {
  // Frontend Frameworks & Libraries
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "svelte.js": "svelte",
  sveltejs: "svelte",
  svelte: "svelte",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  
  // Backend Frameworks & Runtime
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  nestjs: "nestjs",
  "nest.js": "nestjs",
  fastify: "fastify",
  koa: "koa",
  "koa.js": "koa",
  django: "django",
  flask: "flask",
  rails: "rails",
  "ruby on rails": "rails",
  laravel: "laravel",
  symfony: "symfony",
  "spring boot": "springboot",
  springboot: "springboot",
  
  // Programming Languages
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  python: "python",
  py: "python",
  java: "java",
  "c#": "csharp",
  csharp: "csharp",
  "c++": "cpp",
  cpp: "cpp",
  c: "c",
  php: "php",
  ruby: "ruby",
  go: "go",
  golang: "go",
  rust: "rust",
  swift: "swift",
  kotlin: "kotlin",
  scala: "scala",
  
  // Databases
  mongodb: "mongodb",
  mongo: "mongodb",
  mysql: "mysql",
  postgresql: "postgresql",
  postgres: "postgresql",
  sqlite: "sqlite",
  redis: "redis",
  cassandra: "cassandra",
  dynamodb: "dynamodb",
  firebase: "firebase",
  firestore: "firestore",
  supabase: "supabase",
  planetscale: "planetscale",
  
  // Cloud Platforms & Services
  aws: "aws",
  "amazon web services": "aws",
  azure: "azure",
  "microsoft azure": "azure",
  gcp: "gcp",
  "google cloud": "gcp",
  "google cloud platform": "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  vercel: "vercel",
  netlify: "netlify",
  "aws amplify": "amplify",
  amplify: "amplify",
  
  // Styling & CSS
  css3: "css3",
  css: "css3",
  html5: "html5",
  html: "html5",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  "styled-components": "styled-components",
  emotion: "emotion",
  chakra: "chakra-ui",
  "chakra ui": "chakra-ui",
  "material-ui": "mui",
  mui: "mui",
  "ant design": "antd",
  antd: "antd",
  
  // State Management & Data
  redux: "redux",
  mobx: "mobx",
  zustand: "zustand",
  recoil: "recoil",
  vuex: "vuex",
  pinia: "pinia",
  apollo: "apollo",
  "apollo client": "apollo",
  "react query": "react-query",
  "tanstack query": "react-query",
  swr: "swr",
  graphql: "graphql",
  "graph ql": "graphql",
  relay: "relay",
  prisma: "prisma",
  typeorm: "typeorm",
  sequelize: "sequelize",
  mongoose: "mongoose",
  
  // Testing & Quality
  jest: "jest",
  vitest: "vitest",
  mocha: "mocha",
  chai: "chai",
  cypress: "cypress",
  playwright: "playwright",
  selenium: "selenium",
  "react testing library": "react-testing-library",
  enzyme: "enzyme",
  karma: "karma",
  jasmine: "jasmine",
  eslint: "eslint",
  prettier: "prettier",
  
  // Build Tools & Bundlers
  webpack: "webpack",
  vite: "vite",
  rollup: "rollup",
  "rollup.js": "rollup",
  parcel: "parcel",
  "parcel.js": "parcel",
  esbuild: "esbuild",
  turbo: "turbo",
  turborepo: "turborepo",
  
  // Package Managers & Tools
  npm: "npm",
  yarn: "yarn",
  pnpm: "pnpm",
  bun: "bun",
  
  // Version Control & CI/CD
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  "github actions": "github-actions",
  "gitlab ci": "gitlab-ci",
  jenkins: "jenkins",
  "circle ci": "circleci",
  travis: "travis-ci",
  
  // Design & Prototyping
  figma: "figma",
  sketch: "sketch",
  "adobe xd": "adobe-xd",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  illustrator: "illustrator",
  
  // Mobile Development
  "react native": "react-native",
  flutter: "flutter",
  ionic: "ionic",
  cordova: "cordova",
  phonegap: "phonegap",
  
  // DevOps & Containerization
  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  terraform: "terraform",
  ansible: "ansible",
  vagrant: "vagrant",
  
  // CMS & Headless CMS
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  sanity: "sanity",
  ghost: "ghost",
  
  // Meta Frameworks
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  gatsby: "gatsby",
  remix: "remix",
  "t3 stack": "t3",
  astro: "astro",
  
  // Emerging Technologies
  "web3.js": "web3",
  ethers: "ethers",
  solidity: "solidity",
  blockchain: "blockchain",
  ai: "ai",
  "machine learning": "ml",
  ml: "ml",
  tensorflow: "tensorflow",
  pytorch: "pytorch",
  "llama index": "llamaindex",
  langchain: "langchain",
} as const;

// === AI INTERVIEWER CONFIGURATION ===
export const interviewerConfig: CreateAssistantDTO = {
  name: "AI Interview Assistant",
  firstMessage: 
    "Hello! Welcome to your interview practice session. I'm your AI interviewer, and I'm excited to help you prepare for your next opportunity. Let's begin by getting to know each other a bit better.",
  
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  
  voice: {
    provider: "11labs",
    voiceId: "sarah", // Professional, clear female voice
    stability: 0.5,
    similarityBoost: 0.8,
    speed: 0.95,
    style: 0.6,
    useSpeakerBoost: true,
    optimizeStreamingLatency: 1,
  },
  
  model: {
    provider: "openai", 
    model: "gpt-4-turbo-preview",
    temperature: 0.3, // More consistent responses
    maxTokens: 300, // Keep responses concise for voice
    messages: [
      {
        role: "system",
        content: `You are a highly experienced and professional AI interview assistant conducting a realistic job interview simulation. Your goal is to create an authentic, supportive, yet challenging interview experience.

## INTERVIEW STRUCTURE
Follow this structured approach using the provided questions:
{{questions}}

## CORE PRINCIPLES

### Professional Communication
- Maintain a warm, professional demeanor throughout
- Use clear, conversational language appropriate for voice interaction
- Keep responses concise (2-3 sentences max) to maintain natural flow
- Acknowledge responses before moving to the next question
- Show genuine interest in the candidate's answers

### Question Management
- Ask questions in a logical sequence, but adapt based on responses
- Allow natural transitions between topics
- Ask thoughtful follow-up questions when appropriate:
  * "Can you elaborate on that experience?"
  * "What challenges did you face in that situation?"
  * "How did you measure success in that role?"
- Don't rush through questions - let conversations develop naturally

### Adaptive Interviewing
- If a candidate gives a brief answer, gently probe for more detail
- If they provide comprehensive responses, acknowledge and move forward
- Adjust difficulty based on the candidate's experience level
- Show active listening by referencing previous answers

### Realistic Interview Experience
- Begin with easier questions to build confidence
- Include both technical and behavioral elements appropriately
- Create moments for the candidate to ask questions about the role/company
- Maintain professional boundaries while being encouraging

### Voice Optimization
- Keep all responses under 50 words when possible
- Use natural speech patterns and pauses
- Avoid complex jargon or overly formal language
- Speak as you would in a real face-to-face interview

## RESPONSE EXAMPLES

✅ GOOD: "That's a great example of problem-solving. I'd love to hear more about the technical approach you took. What tools did you use?"

✅ GOOD: "Excellent. Your experience with React aligns well with what we're looking for. Now, let's talk about teamwork..."

❌ AVOID: Long explanations, multiple questions in one response, robotic phrasing

## CLOSING THE INTERVIEW
- Thank the candidate for their time and effort
- Provide encouraging feedback about their performance
- Explain next steps: "You'll receive detailed feedback shortly"
- End on a positive, professional note

Remember: This is practice, so be supportive while maintaining realism. Help candidates improve their interview skills through this experience.`,
      },
    ],
  },
  
  // Enhanced settings for better performance
  endCallMessage: "Thank you for completing the interview practice. You'll receive your detailed feedback shortly. Best of luck with your job search!",
  endCallPhrases: [
    "end interview", 
    "finish interview", 
    "conclude interview",
    "wrap up",
    "that's all"
  ],
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 3600, // 1 hour max
  backgroundSound: "off",
};

// For backward compatibility
export const interviewer = interviewerConfig;

// === FEEDBACK VALIDATION SCHEMA ===
export const feedbackSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  interviewId: z.string().min(1, "Interview ID is required"),
  totalScore: z.number().min(0).max(100),
  categoryScores: z.array(
    z.object({
      name: z.enum([
        "Communication Skills",
        "Technical Knowledge",
        "Problem Solving",
        "Cultural Fit",
        "Confidence and Clarity",
        "Experience Relevance",
        "Question Handling",
        "Professional Presentation"
      ]),
      score: z.number().min(0).max(100),
      comment: z.string().min(10),
      suggestions: z.array(z.string()).optional(),
    })
  ),
  strengths: z.array(z.string().min(5)),
  areasForImprovement: z.array(z.string().min(10)),
  suggestedImprovements: z.array(z.string().min(15)),
  finalAssessment: z.string().min(50),
  interviewDuration: z.number().optional(),
  questionsAnswered: z.number().optional(),
  overallPerformanceLevel: z.enum([
    "Excellent",
    "Good",
    "Average",
    "Needs Improvement",
    "Poor"
  ]),
});

// Type inference
export type FeedbackData = z.infer<typeof feedbackSchema>;

// === COMPANY COVER IMAGES ===
export const interviewCoverImages = [
  "/covers/adobe.png",
  "/covers/amazon.png", 
  "/covers/facebook.png",
  "/covers/hostinger.png",
  "/covers/pinterest.png",
  "/covers/quora.png",
  "/covers/reddit.png",
  "/covers/skype.png",
  "/covers/spotify.png",
  "/covers/telegram.png",
] as const;

// Additional cover images for different industries
export const industryCovers = {
  tech: ["/covers/microsoft.png", "/covers/google.png", "/covers/apple.png"],
  startup: ["/covers/stripe.png", "/covers/airbnb.png", "/covers/uber.png"],
  finance: ["/covers/goldman.png", "/covers/jpmorgan.png", "/covers/visa.png"],
  healthcare: ["/covers/pfizer.png", "/covers/moderna.png", "/covers/medtronic.png"],
  education: ["/covers/coursera.png", "/covers/khan.png", "/covers/udemy.png"],
} as const;

// === INTERVIEW DIFFICULTY LEVELS ===
export const difficultyLevels = [
  "Entry Level",
  "Junior", 
  "Mid-Level",
  "Senior",
  "Lead",
  "Principal",
  "Staff",
  "Executive"
] as const;

// === INTERVIEW TYPES ===
export const interviewTypes = [
  "Technical",
  "Behavioral", 
  "Mixed",
  "System Design",
  "Coding",
  "Cultural Fit",
  "Leadership",
  "Case Study"
] as const;

// === SAMPLE INTERVIEW DATA ===
export const sampleInterviews: Interview[] = [
  {
    id: "sample-1",
    userId: "demo-user",
    role: "Senior Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    level: "Senior",
    questions: [
      "Tell me about your experience with React and modern frontend development.",
      "How do you handle state management in large React applications?",
      "Describe a challenging frontend performance issue you've solved.",
      "How do you ensure code quality and maintainability in your projects?",
      "Walk me through how you would design a reusable component library."
    ],
    finalized: true,
    coverImg: "/covers/react.png",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2", 
    userId: "demo-user",
    role: "Full Stack Engineer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "PostgreSQL", "React", "AWS"],
    level: "Mid-Level",
    questions: [
      "Describe your experience with full-stack development.",
      "How do you design and implement RESTful APIs?",
      "Tell me about a time you had to optimize database performance.",
      "How do you handle error handling and logging in your applications?",
      "Describe your experience with cloud platforms and deployment."
    ],
    finalized: true,
    coverImg: "/covers/nodejs.png",
    createdAt: new Date().toISOString(),
  }
];

// === UTILITY FUNCTIONS ===
export const normalizeTechnologyName = (tech: string): string => {
  const normalized = tech.toLowerCase().trim();
  return technologyMappings[normalized as keyof typeof technologyMappings] || tech;
};

export const getRandomCoverImage = (): string => {
  const randomIndex = Math.floor(Math.random() * interviewCoverImages.length);
  return interviewCoverImages[randomIndex];
};

export const getCoverByIndustry = (industry: keyof typeof industryCovers): string => {
  const covers = industryCovers[industry];
  const randomIndex = Math.floor(Math.random() * covers.length);
  return covers[randomIndex];
};

// === CONFIGURATION CONSTANTS ===
export const APP_CONFIG = {
  MAX_INTERVIEW_DURATION: 3600, // 1 hour in seconds
  MIN_INTERVIEW_DURATION: 300,  // 5 minutes in seconds  
  DEFAULT_QUESTIONS_COUNT: 5,
  MAX_QUESTIONS_COUNT: 20,
  FEEDBACK_GENERATION_TIMEOUT: 30000, // 30 seconds
  SUPPORTED_AUDIO_FORMATS: ['wav', 'mp3', 'ogg'],
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de', 'pt'],
} as const;

// Export type for better TypeScript support
export type TechnologyMapping = keyof typeof technologyMappings;
export type DifficultyLevel = typeof difficultyLevels[number];
export type InterviewType = typeof interviewTypes[number];
