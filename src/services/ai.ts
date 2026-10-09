import { ChatOpenAI } from '@langchain/openai';
import type { QuizSessionMetrics, Question } from '../types/quiz';

export async function generateQuestionHint(question: string, apiKey: string): Promise<string> {
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
  });
  const response = await model.invoke(`Provide a subtle 1-sentence hint for this quiz question without giving away the answer: "${question}"`);
  return response.content.toString();
}

export async function generateConceptGuide(topic: string, apiKey: string): Promise<string> {
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini',
    temperature: 0.3,
  });
  const prompt = `Provide a high-yield conceptual study guide for: "${topic}". Include Core Definition, Key Principles, and Common Pitfalls.`;
  const response = await model.invoke(prompt);
  return response.content.toString();
}

export async function generateDynamicQuiz(promptText: string, apiKey: string): Promise<Question[]> {
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
  });
  const prompt = `Generate 5 multiple-choice questions based on: "${promptText}". Return ONLY a valid JSON array matching [{ "id": "1", "category": "General", "question": "...", "choice1": "...", "choice2": "...", "choice3": "...", "choice4": "...", "answer": 1 }].`;
  const response = await model.invoke(prompt);
  const text = response.content.toString().replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(text);
}

export async function generatePostQuizAnalysis(metrics: QuizSessionMetrics, _questions: Question[], apiKey: string): Promise<string> {
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
  });
  const prompt = `Analyze this assessment performance: Score ${metrics.score}, Correct Answers ${metrics.correctAnswers}/${metrics.totalQuestions}. Give professional feedback.`;
  const response = await model.invoke(prompt);
  return response.content.toString();
}

export async function generateAdaptiveQuestion(topic: string, apiKey: string): Promise<Question> {
  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
  });
  const prompt = `Generate ONE expert-level adaptive question for "${topic}". Return ONLY valid JSON matching { "id": "ad-1", "category": "${topic}", "question": "...", "choice1": "...", "choice2": "...", "choice3": "...", "choice4": "...", "answer": 1, "isAdaptive": true }.`;
  const response = await model.invoke(prompt);
  const text = response.content.toString().replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(text);
}