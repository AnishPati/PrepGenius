import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import QuizCard from "@/components/QuizCard";
import TopicTag from "@/components/TopicTag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchQuiz, fetchEvaluation, fetchProgress, submitAnswers } from "@/lib/api";
import type { QuizQuestion, Evaluation, ProgressData } from "@/types";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [q, e, p] = await Promise.all([fetchQuiz(), fetchEvaluation(), fetchProgress()]);
        setQuiz(q);
        setEvaluation(e);
        setProgress(p);
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
      toast.error("Failed to submit answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Today's Quiz */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Today's Quiz</h2>
          {quiz.map((q, i) => (
            <QuizCard
              key={q.id}
              index={i + 1}
              question={q.text}
              topic={q.topic}
              value={answers[q.id] || ""}
              onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
            />
          ))}
          <Button onClick={handleSubmit} disabled={submitting} className="w-full sm:w-auto">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Submitting..." : "Submit Answers"}
          </Button>
        </section>

        {/* Last Evaluation */}
        {evaluation && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Last Evaluation</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  {evaluation.score >= 70 ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  )}
                  <div>
                    <p className="text-3xl font-bold text-foreground">{evaluation.score}%</p>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{evaluation.feedback}</p>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.weakTopics.map((t) => (
                    <TopicTag key={t} topic={t} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Progress Overview */}
        {progress && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Progress Overview</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-medium text-foreground">{progress.overallScore}%</span>
                  </div>
                  <Progress value={progress.overallScore} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Weak Topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {progress.weakTopics.map((t) => (
                      <TopicTag key={t} topic={t} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
