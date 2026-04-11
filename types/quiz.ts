export type QuizQuestion = {
  question_id: string;
  question: string;
  topic: string;
  difficulty: string;
};

export type QuizResponse = {
  quiz_id: string;
  questions: QuizQuestion[];
};

export type SubmitAnswer = {
  question_id: string;
  answer: string;
};

export type SubmitRequest = {
  user_id: string;
  quiz_id: string;
  answers: SubmitAnswer[];
};
