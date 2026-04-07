export interface UserProfile {
  name: string;
  email: string;
  branch: string;
  cgpa: number;
  targetCompanies: string[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  topic: string;
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
}

export interface Evaluation {
  score: number;
  feedback: string;
  weakTopics: string[];
}

export interface ProgressData {
  weakTopics: string[];
  overallScore: number;
}
