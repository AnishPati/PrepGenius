"use client";

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import QuizCard from "@/components/QuizCard";
import TopicTag from "@/components/TopicTag";
import ScoreCard from "@/components/ScoreCard";
import StreakBadge from "@/components/StreakBadge";
import XPProgressBar from "@/components/XPProgressBar";
import ChartCard from "@/components/ChartCard";
import HeatmapGrid from "@/components/HeatmapGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchQuiz,
  fetchEvaluation,
  fetchProgress,
  fetchGamification,
  submitAnswers,
  getUserName,
  getGreeting,
  getUserId,
  getCurrentQuizId,
  getStoredProfileMeta,
} from "@/lib/api";
import type {
  QuizQuestion,
  Evaluation,
  ProgressData,
  GamificationData,
} from "@/types";
import {
  Loader2,
  Flame,
  Zap,
  Trophy,
  Briefcase,
  Brain,
  Code,
  BookOpen,
  MessageSquare,
  RefreshCcw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const SECTION_META: Record<string, { icon: typeof Brain; label: string }> = {
  Aptitude: { icon: Brain, label: "Aptitude" },
  "Technical / DSA": { icon: Code, label: "Technical / DSA" },
  "Core Subject": { icon: BookOpen, label: "Core Subject" },
  Behavioral: { icon: MessageSquare, label: "Behavioral" },
};

const SECTION_ORDER = [
  "Aptitude",
  "Technical / DSA",
  "Core Subject",
  "Behavioral",
];

function normalizeTopic(topic: string): string {
  const value = topic.toLowerCase();
  if (value.includes("aptitude")) return "Aptitude";
  if (value.includes("technical") || value.includes("dsa"))
    return "Technical / DSA";
  if (value.includes("core")) return "Core Subject";
  if (value.includes("behavior")) return "Behavioral";
  return topic.trim() || "General";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [gamification, setGamification] = useState<GamificationData | null>(
    null,
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizId, setQuizId] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchingQuiz, setFetchingQuiz] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scoreTrend, setScoreTrend] = useState<Array<{ d: string; s: number }>>(
    [],
  );
  const userId = getUserId();

  const userName = getUserName();
  const greeting = getGreeting();
  const { company, role } = getStoredProfileMeta();

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        toast.error("Please complete onboarding first");
        navigate("/onboarding");
        return;
      }

      try {
        const [q, e, p, g] = await Promise.all([
          fetchQuiz(userId),
          fetchEvaluation(userId),
          fetchProgress(userId),
          fetchGamification(userId),
        ]);
        setQuiz(q);
        setEvaluation(e);
        setProgress(p);
        setGamification(g);
        setQuizId(getCurrentQuizId());
        const base = Math.max(0, Math.min(100, e.score));
        setScoreTrend([
          { d: "M", s: Math.max(0, base - 10) },
          { d: "T", s: Math.max(0, base - 8) },
          { d: "W", s: Math.max(0, base - 6) },
          { d: "T", s: Math.max(0, base - 4) },
          { d: "F", s: Math.max(0, base - 2) },
          { d: "S", s: base },
        ]);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate, userId]);

  const completedCount = useMemo(
    () => quiz.filter((q) => answers[q.id]?.trim()).length,
    [quiz, answers],
  );

  const groupedQuestions = useMemo(() => {
    const groups: Record<string, QuizQuestion[]> = {};
    for (const q of quiz) {
      const key = normalizeTopic(q.topic);
      (groups[key] ??= []).push({ ...q, topic: key });
    }
    const orderedKnownSections = SECTION_ORDER.filter((s) => groups[s]).map(
      (s) => ({
        section: s,
        questions: groups[s],
      }),
    );

    const otherSections = Object.keys(groups)
      .filter((s) => !SECTION_ORDER.includes(s))
      .map((s) => ({ section: s, questions: groups[s] }));

    return [...orderedKnownSections, ...otherSections];
  }, [quiz]);

  // Running index for question numbering
  let questionIndex = 0;

  const handleSubmit = async () => {
    if (completedCount === 0) {
      toast.error("Please answer at least one question");
      return;
    }
    if (!userId) {
      toast.error("Missing user session. Please onboard again.");
      navigate("/onboarding");
      return;
    }
    if (!quizId) {
      toast.error("Missing quiz session. Refresh and try again.");
      return;
    }

    setSubmitting(true);
    try {
      await submitAnswers(
        userId,
        quizId,
        quiz.map((q) => ({ questionId: q.id, answer: answers[q.id] || "" })),
      );
      navigate("/success");
    } catch {
      toast.error("Failed to submit answers");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetQuiz = async () => {
    if (!userId) {
      toast.error("Missing user session. Please onboard again.");
      navigate("/onboarding");
      return;
    }

    setFetchingQuiz(true);
    try {
      const nextQuiz = await fetchQuiz(userId);
      setQuiz(nextQuiz);
      setAnswers({});
      setQuizId(getCurrentQuizId());
      toast.success("Quiz loaded from N8N");
    } catch {
      toast.error("Failed to load quiz from N8N");
    } finally {
      setFetchingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting}, {userName} 👋
            </h1>
            {company && role ? (
              <div className="flex items-center gap-1.5 mt-1">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Preparing for{" "}
                  <span className="font-medium text-foreground">
                    {company} — {role}
                  </span>
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ready for today's challenge?
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {gamification && (
              <StreakBadge
                streak={gamification.streak}
                calendar={gamification.streakCalendar}
              />
            )}
          </div>
        </motion.div>

        {/* XP + Gamification */}
        {gamification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <XPProgressBar
                  xp={gamification.xp}
                  level={gamification.level}
                  xpForNextLevel={gamification.xpForNextLevel}
                  xpAtCurrentLevel={gamification.xpAtCurrentLevel}
                  xpEarnedToday={gamification.xpEarnedToday}
                />
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Flame className="h-3.5 w-3.5 text-destructive" />
                    Keep your streak alive — complete today's challenge!
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    +10 XP per challenge
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Today's 10-Question Challenge */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Today's 10-Question Challenge
                </h2>
                <p className="text-xs text-muted-foreground">
                  Aptitude • Technical • Core • Behavioral
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleGetQuiz}
                  disabled={fetchingQuiz}
                  variant="outline"
                  className="rounded-full px-4 gap-2"
                >
                  {fetchingQuiz ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                  {fetchingQuiz ? "Loading Quiz..." : "Get Quiz"}
                </Button>
                <span className="text-sm font-medium text-foreground">
                  {completedCount} / {quiz.length}
                </span>
              </div>
              <Progress
                value={(completedCount / Math.max(quiz.length, 1)) * 100}
                className="h-2 w-32"
              />
            </div>
          </div>

          {groupedQuestions.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No quiz questions loaded yet. Click{" "}
                <span className="font-medium text-foreground">Get Quiz</span> to
                fetch questions from N8N.
              </CardContent>
            </Card>
          ) : (
            groupedQuestions.map(({ section, questions }) => {
              const meta = SECTION_META[section];
              const Icon = meta?.icon ?? Brain;
              return (
                <Card key={section}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      {meta?.label ?? section}
                      <Badge
                        variant="outline"
                        className="text-xs font-normal ml-auto"
                      >
                        {questions.length}{" "}
                        {questions.length === 1 ? "question" : "questions"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {questions.map((q) => {
                      questionIndex++;
                      return (
                        <QuizCard
                          key={q.id}
                          index={questionIndex}
                          question={q.text}
                          topic={q.topic}
                          difficulty={q.difficulty}
                          value={answers[q.id] || ""}
                          onChange={(v) =>
                            setAnswers((prev) => ({ ...prev, [q.id]: v }))
                          }
                        />
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Questions completed: {completedCount}/{quiz.length}
            </p>
            <Button
              onClick={handleSubmit}
              disabled={submitting || completedCount === 0}
              className="rounded-full px-6 gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit Answers"}
            </Button>
          </div>
        </section>

        {/* Score + Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluation && (
            <ScoreCard
              score={evaluation.score / 10}
              maxScore={10}
              trend={evaluation.trend}
              label="Score (10-question evaluation)"
            />
          )}
          <ChartCard title="Score Trend">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrend}>
                  <XAxis
                    dataKey="d"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide domain={[50, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="s"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Evaluation feedback */}
        {evaluation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6 space-y-3">
                <p className="text-sm font-medium text-foreground">
                  AI Feedback
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {evaluation.feedback}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.weakTopics.map((t) => (
                    <TopicTag key={t} topic={t} status="weak" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Weekly Activity + Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="Weekly Activity">
            <HeatmapGrid
              data={(
                gamification?.streakCalendar || [
                  false,
                  false,
                  false,
                  false,
                  false,
                  false,
                  false,
                ]
              ).map((active, idx) => ({
                day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx],
                intensity: active ? 4 : 0,
              }))}
            />
          </ChartCard>

          {progress && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Topic Mastery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {progress.topicMastery.map((tm) => (
                  <div key={tm.topic} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground font-medium">
                        {tm.topic}
                      </span>
                      <TopicTag topic={`${tm.mastery}%`} status={tm.status} />
                    </div>
                    <Progress value={tm.mastery} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Overall Readiness */}
        {progress && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Overall Readiness
                </p>
                <span className="text-2xl font-bold text-primary">
                  {progress.overallScore}%
                </span>
              </div>
              <Progress value={progress.overallScore} className="h-3" />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
