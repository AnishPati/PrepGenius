import type {
  UserProfile,
  QuizQuestion,
  QuizAnswer,
  Evaluation,
  ProgressData,
  GamificationData,
  AnalyticsData,
  TopicMastery,
} from "@/types";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

type ApiError = {
  error?: string;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const err = (await res.json()) as ApiError;
      if (err.error) message = err.error;
    } catch {
      // Keep fallback message when response body is not JSON.
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

type BackendQuestion = {
  question_id?: string;
  id?: string;
  question?: string;
  text?: string;
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
};

type BackendQuizResponse = {
  quiz_id?: string;
  questions?: BackendQuestion[];
};

type BackendEvaluationResponse = {
  overall_score?: number;
  weak_topics?: string[];
  skill_gaps?: string[];
  feedback?: string;
};

type BackendProfileResponse = {
  weak_topics?: string[];
  strong_topics?: string[];
  progress_score?: number;
};

function normalizeDifficulty(
  value: string | undefined,
): "easy" | "medium" | "hard" {
  if (value === "easy" || value === "hard") return value;
  return "medium";
}

function profileFromStorage(): Partial<UserProfile> & { user_id?: string } {
  try {
    const raw = localStorage.getItem("user_profile");
    if (!raw) return {};
    return JSON.parse(raw) as Partial<UserProfile> & { user_id?: string };
  } catch {
    return {};
  }
}

function deriveTrend(score: number): "improving" | "declining" | "stable" {
  if (score >= 75) return "improving";
  if (score <= 45) return "declining";
  return "stable";
}

function mergeWeakStrongTopics(
  weak: string[],
  strong: string[],
): TopicMastery[] {
  const weakSet = new Set(weak);
  const strongSet = new Set(strong);
  const topics = new Set([...weakSet, ...strongSet]);

  return Array.from(topics).map((topic) => {
    if (weakSet.has(topic)) {
      return { topic, mastery: 35, status: "weak" as const };
    }
    if (strongSet.has(topic)) {
      return { topic, mastery: 85, status: "strong" as const };
    }
    return { topic, mastery: 60, status: "moderate" as const };
  });
}

function buildGamification(progressScore: number): GamificationData {
  const xp = Math.max(0, Math.round(progressScore * 5));
  const levelInfo = getLevelInfo(xp);
  const streak = Math.min(7, Math.max(0, Math.round(progressScore / 15)));
  const streakCalendar = Array.from(
    { length: 7 },
    (_, idx) => idx >= 7 - streak,
  );

  return {
    xp,
    level: levelInfo.level,
    xpForNextLevel: levelInfo.max,
    xpAtCurrentLevel: levelInfo.min,
    streak,
    xpEarnedToday: Math.max(5, Math.round(progressScore / 8)),
    streakCalendar,
  };
}

export async function onboardUser(
  profile: UserProfile,
): Promise<{ success: boolean }> {
  const body = {
    name: profile.name,
    email: profile.email,
    branch: profile.branch,
    cgpa: String(profile.cgpa),
    company: profile.company,
    role: profile.role,
    difficulty: profile.difficulty,
    question_count: 10,
  };

  const result = await apiFetch<{ success: boolean; user_id?: string }>(
    "/api/onboard",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  localStorage.setItem(
    "user_profile",
    JSON.stringify({
      ...profile,
      user_id: result.user_id || profile.email,
    }),
  );

  return { success: !!result.success };
}

export function getUserId(): string {
  const profile = profileFromStorage();
  return String(profile.user_id || profile.email || "").trim();
}

export function getCurrentQuizId(): string {
  return (localStorage.getItem("current_quiz_id") || "").trim();
}

export async function fetchQuiz(userId: string): Promise<QuizQuestion[]> {
  const data = await apiFetch<BackendQuizResponse>(
    `/api/quiz?user_id=${encodeURIComponent(userId)}`,
  );
  if (data.quiz_id) {
    localStorage.setItem("current_quiz_id", data.quiz_id);
  }

  return (data.questions || [])
    .map((q) => ({
      id: String(q.question_id || q.id || ""),
      text: String(q.question || q.text || ""),
      topic: String(q.topic || "General"),
      difficulty: normalizeDifficulty(q.difficulty),
    }))
    .filter((q) => q.id && q.text);
}

export async function submitAnswers(
  userId: string,
  quizId: string,
  answers: QuizAnswer[],
): Promise<{ success: boolean }> {
  const payload = {
    user_id: userId,
    quiz_id: quizId,
    answers: answers.map((a) => ({
      question_id: a.questionId,
      answer: a.answer,
    })),
  };

  const result = await apiFetch<{ success: boolean }>("/api/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return { success: !!result.success };
}

export async function fetchEvaluation(userId: string): Promise<Evaluation> {
  const data = await apiFetch<BackendEvaluationResponse>(
    `/api/evaluation?user_id=${encodeURIComponent(userId)}`,
  );

  const score = typeof data.overall_score === "number" ? data.overall_score : 0;
  const weakTopics = Array.isArray(data.weak_topics) ? data.weak_topics : [];

  return {
    score,
    feedback: String(data.feedback || "No feedback yet."),
    weakTopics,
    trend: deriveTrend(score),
  };
}

export async function fetchProgress(userId: string): Promise<ProgressData> {
  const data = await apiFetch<BackendProfileResponse>(
    `/api/profile?user_id=${encodeURIComponent(userId)}`,
  );

  const weakTopics = Array.isArray(data.weak_topics) ? data.weak_topics : [];
  const strongTopics = Array.isArray(data.strong_topics)
    ? data.strong_topics
    : [];
  const overallScore =
    typeof data.progress_score === "number" ? data.progress_score : 0;

  return {
    weakTopics,
    overallScore,
    topicMastery: mergeWeakStrongTopics(weakTopics, strongTopics),
  };
}

export async function fetchGamification(
  userId: string,
): Promise<GamificationData> {
  const progress = await fetchProgress(userId);
  return buildGamification(progress.overallScore);
}

export async function fetchAnalytics(userId: string): Promise<AnalyticsData> {
  const [evaluation, progress] = await Promise.all([
    fetchEvaluation(userId),
    fetchProgress(userId),
  ]);

  const score = Math.max(0, Math.min(100, evaluation.score));
  const avg = Math.round((progress.overallScore + score) / 2);
  const weakCount = progress.topicMastery.filter(
    (t) => t.status === "weak",
  ).length;
  const totalTopics = Math.max(progress.topicMastery.length, 1);
  const improvementRate = Math.max(
    0,
    Math.min(100, Math.round(((totalTopics - weakCount) / totalTopics) * 100)),
  );
  const weeklyActivity = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (day, index) => ({
      day,
      intensity:
        index < 5
          ? Math.max(1, Math.min(4, Math.round(avg / 25)))
          : Math.max(0, Math.min(4, Math.round(score / 25))),
    }),
  );

  return {
    averageScore: avg,
    improvementRate,
    scoreTrend: [
      { date: "Mon", score: Math.max(0, score - 10) },
      { date: "Tue", score: Math.max(0, score - 8) },
      { date: "Wed", score: Math.max(0, score - 6) },
      { date: "Thu", score: Math.max(0, score - 4) },
      { date: "Fri", score: Math.max(0, score - 2) },
      { date: "Sat", score },
      { date: "Sun", score },
    ],
    topicMastery: progress.topicMastery,
    accuracyCorrect: score,
    accuracyIncorrect: Math.max(0, 100 - score),
    weeklyActivity,
    insights: [
      evaluation.feedback,
      progress.weakTopics.length
        ? `Focus next on: ${progress.weakTopics.join(", ")}`
        : "No weak topics reported right now.",
    ],
  };
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
