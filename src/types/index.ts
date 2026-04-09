export interface UserProfile {
  name: string;
  email: string;
  branch: string;
  cgpa: number;
  targetCompanies: string[];
  company: string;
  role: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizQuestion {
  id: string;
  text: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
}

export interface Evaluation {
  score: number;
  feedback: string;
  weakTopics: string[];
  trend: "improving" | "declining" | "stable";
}

export interface ProgressData {
  weakTopics: string[];
  overallScore: number;
  topicMastery: TopicMastery[];
}

export interface TopicMastery {
  topic: string;
  mastery: number;
  status: "weak" | "moderate" | "strong";
}

export interface GamificationData {
  xp: number;
  level: number;
  xpForNextLevel: number;
  xpAtCurrentLevel: number;
  streak: number;
  xpEarnedToday: number;
  streakCalendar: boolean[]; // last 7 days
}

export interface ScoreTrend {
  date: string;
  score: number;
}

export interface WeeklyActivity {
  day: string;
  intensity: number; // 0-4
}

export interface AnalyticsData {
  averageScore: number;
  improvementRate: number;
  scoreTrend: ScoreTrend[];
  topicMastery: TopicMastery[];
  accuracyCorrect: number;
  accuracyIncorrect: number;
  weeklyActivity: WeeklyActivity[];
  insights: string[];
}
