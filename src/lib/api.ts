import type { UserProfile, QuizQuestion, QuizAnswer, Evaluation, ProgressData } from "@/types";

const MOCK_DELAY = 800;

const mockQuiz: QuizQuestion[] = [
  { id: "1", text: "Explain the difference between a stack and a queue. When would you use each?", topic: "Data Structures" },
  { id: "2", text: "What is the time complexity of binary search? Explain why.", topic: "Algorithms" },
  { id: "3", text: "Describe the SOLID principles in object-oriented programming.", topic: "OOP" },
  { id: "4", text: "What is a deadlock? How can it be prevented?", topic: "Operating Systems" },
];

const mockEvaluation: Evaluation = {
  score: 72,
  feedback: "Good understanding of core data structures. Your explanation of binary search was solid. Consider diving deeper into OS concepts and concurrency patterns — your deadlock answer could use more practical examples.",
  weakTopics: ["Operating Systems", "Concurrency", "System Design"],
};

const mockProgress: ProgressData = {
  weakTopics: ["Operating Systems", "Concurrency", "System Design", "Dynamic Programming"],
  overallScore: 68,
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function onboardUser(profile: UserProfile): Promise<{ success: boolean }> {
  await delay(MOCK_DELAY);
  localStorage.setItem("user_profile", JSON.stringify(profile));
  return { success: true };
}

export async function fetchQuiz(): Promise<QuizQuestion[]> {
  await delay(MOCK_DELAY);
  return mockQuiz;
}

export async function submitAnswers(answers: QuizAnswer[]): Promise<{ success: boolean }> {
  await delay(MOCK_DELAY);
  console.log("Submitted answers:", answers);
  return { success: true };
}

export async function fetchEvaluation(): Promise<Evaluation> {
  await delay(MOCK_DELAY);
  return mockEvaluation;
}

export async function fetchProgress(): Promise<ProgressData> {
  await delay(MOCK_DELAY);
  return mockProgress;
}
