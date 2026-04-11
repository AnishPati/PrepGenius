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
  weak_topics: string[];
  strong_topics: string[];
  progress_score: number;
};
