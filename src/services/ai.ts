import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import type { Question, QuizSessionMetrics } from '../types/quiz';

// Zod schema to enforce strict JSON output from the LLM
const questionSchema = z.object({
  question: z.string().describe("The multiple choice question text. Must be collegiate-level and analytical."),
  choice1: z.string(),
  choice2: z.string(),
  choice3: z.string(),
  choice4: z.string(),
  answer: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).describe("The integer (1-4) representing the correct choice."),
});

const quizResponseSchema = z.object({
  questions: z.array(questionSchema).length(5).describe("Exactly 5 multiple-choice questions derived from the source material."),
});

/**
 * Dynamically generates a quiz from a provided topic or block of text.
 */
export async function generateDynamicQuiz(content: string, apiKey: string): Promise<Question[]> {
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini',
    temperature: 0.2, // Low temperature for factual consistency
    dangerouslyAllowBrowser: true, // Required for Vite client-side execution
  });

  const structuredLlm = model.withStructuredOutput(quizResponseSchema);

  const prompt = `
    You are a Staff-Level Technical Assessor. Construct a rigorous, 5-question multiple-choice 
    assessment based on the following subject matter or content:
    
    "${content}"
    
    Requirements:
    - The distractors (incorrect answers) must be highly plausible and address common misconceptions.
    - Do not use "All of the above" or "None of the above".
    - Output perfectly structured JSON matching the requested schema.
  `;

  try {
    const response = await structuredLlm.invoke(prompt);
    
    // Map the response to our internal Question interface by injecting UUIDs
    return response.questions.map((q) => ({
      id: crypto.randomUUID(),
      ...q,
    }));
  } catch (error) {
    console.error("AI Generation Failed:", error);
    throw new Error("Failed to generate assessment. Please verify your API key and try again.");
  }
}

/**
 * Generates an analytical post-quiz breakdown identifying knowledge gaps.
 */
export async function generatePostQuizAnalysis(
  metrics: QuizSessionMetrics, 
  questions: Question[],
  apiKey: string
): Promise<string> {
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    dangerouslyAllowBrowser: true,
  });

  const accuracy = Math.round((metrics.correctAnswers / metrics.totalQuestions) * 100);
  const avgTime = (metrics.timePerQuestionMs.reduce((a, b) => a + b, 0) / metrics.totalQuestions / 1000).toFixed(1);

  const prompt = `
    You are an AI Technical Coach evaluating a user's recent assessment performance.
    
    Telemetry Data:
    - Total Score: ${metrics.score}
    - Accuracy: ${accuracy}%
    - Average Time per Question: ${avgTime} seconds

    Provide a concise, 3-sentence editorial-style feedback paragraph. Adopt a professional, slightly intense "Dark Technical Maximalism" tone. Acknowledge their cognitive speed (time taken) and accuracy, and suggest one conceptual area they should review based on standard collegiate-level expectations. Do not use hashtags or emojis.
  `;

  const response = await model.invoke(prompt);
  return response.content.toString();
}
/**
 * Generates a subtle, single-sentence hint for a specific question.
 */
export async function generateQuestionHint(
  question: Question, 
  apiKey: string
): Promise<string> {
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
    dangerouslyAllowBrowser: true,
  });

  const prompt = `
    You are an AI Technical Coach assisting a user during an assessment.
    
    Question: ${question.question}
    Options: 
    1) ${question.choice1}
    2) ${question.choice2}
    3) ${question.choice3}
    4) ${question.choice4}
    The correct option is: ${question.answer}

    Provide a concise, 1-sentence hint that nudges the user toward the correct concept without directly giving away the answer. Maintain a professional, intense "Dark Technical Maximalism" tone.
  `;

  const response = await model.invoke(prompt);
  return response.content.toString();
}
/**
 * Generates a concise study guide for a specific topic.
 */
export async function generateConceptGuide(
  topic: string, 
  apiKey: string
): Promise<string> {
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini',
    temperature: 0.3,
    dangerouslyAllowBrowser: true,
  });

  const prompt = `
    You are an expert technical instructor. Provide a high-yield, conceptual study guide for the following topic: "${topic}". 
    
    Structure the response clearly using exactly three sections:
    1. Core Definition (1-2 sentences)
    2. Key Principles (3-4 bullet points)
    3. Common Pitfalls (What to watch out for)
    
    Keep the tone professional, educational, and concise. Do not use markdown headers, just plain text with clear spacing and bullet points.
  `;

  const response = await model.invoke(prompt);
  return response.content.toString();
}
export async function generateAdaptiveQuestion(
  topic: string, 
  apiKey: string
): Promise<Question> {
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    dangerouslyAllowBrowser: true,
  });

  const prompt = `
    The user is performing exceptionally well in the topic: "${topic}". 
    Generate ONE highly advanced, expert-level multiple-choice question to challenge them.
    It must require critical thinking, not just rote memorization.
    
    Return ONLY a valid JSON object matching this exact structure:
    {
      "id": "adaptive-1",
      "category": "${topic}",
      "question": "...",
      "choice1": "...",
      "choice2": "...",
      "choice3": "...",
      "choice4": "...",
      "answer": 1 (or 2, 3, 4),
      "isAdaptive": true
    }
  `;

  const response = await model.invoke(prompt);
  const text = response.content.toString().replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(text) as Question;
}