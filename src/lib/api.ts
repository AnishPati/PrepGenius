import type { UserProfile, QuizQuestion, QuizAnswer, Evaluation, ProgressData, GamificationData, AnalyticsData } from "@/types";

const MOCK_DELAY = 600;

const mockQuiz: QuizQuestion[] = [
  { id: "1", text: "Explain the difference between a stack and a queue. When would you use each?", topic: "Data Structures", difficulty: "easy" },
  { id: "2", text: "What is the time complexity of binary search? Explain why.", topic: "Algorithms", difficulty: "medium" },
  { id: "3", text: "Describe the SOLID principles in object-oriented programming.", topic: "OOP", difficulty: "medium" },
  { id: "4", text: "What is a deadlock? How can it be prevented?", topic: "Operating Systems", difficulty: "hard" },
];

const mockEvaluation: Evaluation = {
  score: 82,
  feedback: "Strong understanding of data structures and algorithms. Your OOP explanation was thorough. Focus more on OS concepts and concurrency patterns for improvement.",
  weakTopics: ["Operating Systems", "Concurrency", "System Design"],
  trend: "improving",
};

const mockProgress: ProgressData = {
  weakTopics: ["Operating Systems", "Concurrency", "System Design", "Dynamic Programming"],
  overallScore: 72,
  topicMastery: [
    { topic: "Data Structures", mastery: 88, status: "strong" },
    { topic: "Algorithms", mastery: 75, status: "moderate" },
    { topic: "OOP", mastery: 82, status: "strong" },
    { topic: "Operating Systems", mastery: 45, status: "weak" },
    { topic: "System Design", mastery: 38, status: "weak" },
    { topic: "Dynamic Programming", mastery: 52, status: "moderate" },
  ],
};

const mockGamification: GamificationData = {
  xp: 240,
  level: 3,
  xpForNextLevel: 500,
  xpAtCurrentLevel: 250,
  streak: 7,
  xpEarnedToday: 20,
  streakCalendar: [true, true, true, false, true, true, true],
};

const mockAnalytics: AnalyticsData = {
  averageScore: 76,
  improvementRate: 15,
  scoreTrend: [
    { date: "Mon", score: 65 },
    { date: "Tue", score: 70 },
    { date: "Wed", score: 68 },
    { date: "Thu", score: 75 },
    { date: "Fri", score: 78 },
    { date: "Sat", score: 82 },
    { date: "Sun", score: 85 },
  ],
  topicMastery: mockProgress.topicMastery,
  accuracyCorrect: 73,
  accuracyIncorrect: 27,
  weeklyActivity: [
    { day: "Mon", intensity: 3 },
    { day: "Tue", intensity: 4 },
    { day: "Wed", intensity: 2 },
    { day: "Thu", intensity: 0 },
    { day: "Fri", intensity: 3 },
    { day: "Sat", intensity: 4 },
    { day: "Sun", intensity: 1 },
  ],
  insights: [
    "You struggle with Dynamic Programming — try more practice problems",
    "Your accuracy improved by 15% this week",
    "Operating Systems needs more attention — review process scheduling",
    "Great consistency! 7-day streak maintained",
  ],
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

export async function fetchGamification(): Promise<GamificationData> {
  await delay(MOCK_DELAY);
  return mockGamification;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  await delay(MOCK_DELAY);
  return mockAnalytics;
}

export function getUserName(): string {
  try {
    const profile = localStorage.getItem("user_profile");
    if (profile) return JSON.parse(profile).name;
  } catch {}
  return "User";
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getLevelInfo(xp: number) {
  if (xp < 100) return { level: 1, min: 0, max: 100 };
  if (xp < 250) return { level: 2, min: 100, max: 250 };
  return { level: 3, min: 250, max: 500 };
}
