import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import TopicTag from "@/components/TopicTag";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserProfile, getUserId } from "@/lib/api";
import { TrendingUp, Target, Lightbulb, UserRound } from "lucide-react";

interface ProfileData {
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
}

const Analytics = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please complete onboarding first");
      setLoading(false);
      return;
    }

    fetchUserProfile(userId)
      .then(setData)
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </main>
      </div>
    );
  }

  if (!data) return null;

  const liveInsights = [
    data.feedback,
    ...(Array.isArray(data.insights) ? data.insights : []),
    ...(Array.isArray(data.skill_gaps) && data.skill_gaps.length > 0
      ? [`Skill gaps: ${data.skill_gaps.join(", ")}`]
      : []),
  ].filter((item): item is string => Boolean(item && item.trim()));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserRound className="h-6 w-6 text-primary" /> Live Profile Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Live data from your profile webhook. No generated metrics.
          </p>
        </motion.div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Progress Score",
              value: `${data.progress_score}%`,
              icon: Target,
              color: "text-primary",
            },
            {
              label: "Strong Topics",
              value: `${data.strong_topics.length}`,
              icon: TrendingUp,
              color: "text-success",
            },
            {
              label: "Weak Topics",
              value: `${data.weak_topics.length}`,
              icon: Lightbulb,
              color: "text-warning",
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6 flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${item.color}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Profile Summary
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {data.name && <p>Name: {data.name}</p>}
                {data.company && <p>Company: {data.company}</p>}
                {data.role && <p>Role: {data.role}</p>}
                {data.branch && <p>Branch: {data.branch}</p>}
                {data.difficulty && <p>Difficulty: {data.difficulty}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" /> Live Notes
              </h3>
              {liveInsights.length > 0 ? (
                <ul className="space-y-2">
                  {liveInsights.map((insight, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  The profile webhook did not return feedback yet.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Strong Topics
              </h3>
              {data.strong_topics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.strong_topics.map((topic) => (
                    <TopicTag key={topic} topic={topic} status="strong" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No strong topics returned by the live profile API.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Weak Topics
              </h3>
              {data.weak_topics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.weak_topics.map((topic) => (
                    <TopicTag key={topic} topic={topic} status="weak" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No weak topics returned by the live profile API.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Raw profile payload
            </h3>
            <p className="text-sm text-muted-foreground">
              progress_score: {data.progress_score}
              {typeof data.overall_score === "number"
                ? `, overall_score: ${data.overall_score}`
                : ""}
            </p>
            {Array.isArray(data.score_trend) && data.score_trend.length > 0 && (
              <div className="space-y-1 text-sm text-muted-foreground">
                {data.score_trend.map((point) => (
                  <p key={point.date}>
                    {point.date}: {point.score}
                  </p>
                ))}
              </div>
            )}
            {Array.isArray(data.weekly_activity) &&
              data.weekly_activity.length > 0 && (
                <div className="space-y-1 text-sm text-muted-foreground">
                  {data.weekly_activity.map((day) => (
                    <p key={day.day}>
                      {day.day}: {day.intensity}
                    </p>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
