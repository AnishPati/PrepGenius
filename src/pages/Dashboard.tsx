import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { fetchQuiz, fetchEvaluation, fetchProgress, fetchGamification, submitAnswers, getUserName, getGreeting } from "@/lib/api";
import type { QuizQuestion, Evaluation, ProgressData, GamificationData } from "@/types";
import { Loader2, Flame, Zap, Trophy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const userName = getUserName();
  const greeting = getGreeting();

  useEffect(() => {
    const load = async () => {
      try {
        const [q, e, p, g] = await Promise.all([
          fetchQuiz(), fetchEvaluation(), fetchProgress(), fetchGamification(),
        ]);
        setQuiz(q);
        setEvaluation(e);
        setProgress(p);
        setGamification(g);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    const unanswered = quiz.filter((q) => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      toast.error(`Please answer all ${unanswered.length} remaining question(s)`);
      return;
    }
    setSubmitting(true);
    try {
      await submitAnswers(quiz.map((q) => ({ questionId: q.id, answer: answers[q.id] })));
      navigate("/success");
    } catch {
      toast.error("Failed to submit answers");
    } finally {
      setSubmitting(false);
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

  // Mini score trend for inline chart
  const scoreTrend = [
    { d: "M", s: 65 }, { d: "T", s: 70 }, { d: "W", s: 68 },
    { d: "T", s: 75 }, { d: "F", s: 78 }, { d: "S", s: 82 },
  ];

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
            <p className="text-sm text-muted-foreground">Ready for today's challenge?</p>
          </div>
          <div className="flex items-center gap-4">
            {gamification && (
              <>
                <StreakBadge streak={gamification.streak} calendar={gamification.streakCalendar} />
              </>
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
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Flame className="h-3.5 w-3.5 text-destructive" />
                  Keep your streak alive — complete today's challenge!
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Today's Challenge */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Today's Challenge</h2>
          </div>
          {quiz.map((q, i) => (
            <QuizCard
              key={q.id}
              index={i + 1}
              question={q.text}
              topic={q.topic}
              difficulty={q.difficulty}
              value={answers[q.id] || ""}
              onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
            />
          ))}
          <Button onClick={handleSubmit} disabled={submitting} className="w-full sm:w-auto rounded-full px-6 gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Submitting..." : "Submit Answers"}
          </Button>
        </section>

        {/* Score + Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluation && (
            <ScoreCard
              score={(evaluation.score / 10)}
              maxScore={10}
              trend={evaluation.trend}
              label="Latest Score"
            />
          )}
          <ChartCard title="Score Trend">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrend}>
                  <XAxis dataKey="d" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis hide domain={[50, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="s" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Evaluation feedback */}
        {evaluation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="pt-6 space-y-3">
                <p className="text-sm font-medium text-foreground">AI Feedback</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{evaluation.feedback}</p>
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
            <HeatmapGrid data={[
              { day: "Mon", intensity: 3 }, { day: "Tue", intensity: 4 },
              { day: "Wed", intensity: 2 }, { day: "Thu", intensity: 0 },
              { day: "Fri", intensity: 3 }, { day: "Sat", intensity: 4 },
              { day: "Sun", intensity: 1 },
            ]} />
          </ChartCard>

          {progress && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Topic Mastery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {progress.topicMastery.map((tm) => (
                  <div key={tm.topic} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground font-medium">{tm.topic}</span>
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
                <p className="text-sm font-semibold text-foreground">Overall Readiness</p>
                <span className="text-2xl font-bold text-primary">{progress.overallScore}%</span>
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
