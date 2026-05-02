export type OnboardRequest = {
  name: string;
  email: string;
  branch: string;
  cgpa: string;
  company: string;
  role: string;
  difficulty: string;
  question_count: number;
};

export type UserProfileResponse = {
  user_id?: string;
  name?: string;
  email?: string;
  branch?: string;
  company?: string;
  role?: string;
  difficulty?: string;
  weak_topics: string[];
  strong_topics: string[];
  progress_score: number;
  overall_score?: number;
  feedback?: string;
  skill_gaps?: string[];
  insights?: string[];
  score_trend?: Array<{ date: string; score: number }>;
  weekly_activity?: Array<{ day: string; intensity: number }>;
};
