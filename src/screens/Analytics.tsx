"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lightbulb, Target, TrendingUp, UserRound } from "lucide-react";

import Navbar from "@/components/Navbar";
import TopicTag from "@/components/TopicTag";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserProfile, getUserId } from "@/lib/api";

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
  feedback?: string;
  skill_gaps: string[];
  insights: string[];
  score_trend: Array<{ date: string; score: number }>;
  weekly_activity: Array<{ day: string; intensity: number }>;
}

interface RawProfileData {
  user_id?: string;
  name?: string;
  email?: string;
  branch?: string;
  company?: string;
  role?: string;
  difficulty?: string;
  weak_topics?: string[];
  strong_topics?: string[];
  progress_score?: number;
  feedback?: string;
  skill_gaps?: string[];
  insights?: string[];
  score_trend?: Array<{ date: string; score: number }>;
  weekly_activity?: Array<{ day: string; intensity: number }>;
}

function normalizeProfile(profile: RawProfileData): ProfileData {
  // Extract topic names from objects if they have a 'topic' property, otherwise use as-is
  const extractTopics = (topics: any[]): string[] => {
    if (!Array.isArray(topics)) return [];
    return topics
      .map((t) => (typeof t === "string" ? t : t?.topic))
      .filter((t) => t && typeof t === "string");
  };

  return {
    user_id: profile.user_id,
    name: profile.name,
    email: profile.email,
    branch: profile.branch,
    company: profile.company,
    role: profile.role,
    difficulty: profile.difficulty,
    weak_topics: extractTopics(profile.weak_topics),
    strong_topics: extractTopics(profile.strong_topics),
    progress_score:
      typeof profile.progress_score === "number" ? profile.progress_score : 0,
    feedback: profile.feedback,
    skill_gaps: Array.isArray(profile.skill_gaps) ? profile.skill_gaps : [],
    insights: Array.isArray(profile.insights) ? profile.insights : [],
    score_trend: Array.isArray(profile.score_trend) ? profile.score_trend : [],
    weekly_activity: Array.isArray(profile.weekly_activity)
      ? profile.weekly_activity
      : [],
  };
}

const Analytics = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please complete onboarding first");
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const raw = (await fetchUserProfile(userId)) as RawProfileData;
        setProfile(normalizeProfile(raw));
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-48 w-full rounded-2xl" />
          ))}
        </main>
      </div>
    );
  }

  if (!profile) return null;

  const liveInsights: string[] = [];
  if (profile.feedback && profile.feedback.trim()) {
    liveInsights.push(profile.feedback.trim());
  }
  for (const insight of profile.insights) {
    if (insight && insight.trim()) {
      liveInsights.push(insight.trim());
    }
  }
  if (profile.skill_gaps.length > 0) {
    liveInsights.push(`Skill gaps: ${profile.skill_gaps.join(", ")}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserRound className="h-6 w-6 text-primary" /> Live Profile
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Live data from your profile webhook. No generated metrics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {profile.progress_score}%
                </p>
                <p className="text-xs text-muted-foreground">Progress Score</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-success">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {profile.strong_topics.length}
                </p>
                <p className="text-xs text-muted-foreground">Strong Topics</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-warning">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {profile.weak_topics.length}
                </p>
                <p className="text-xs text-muted-foreground">Weak Topics</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Profile Summary
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {profile.name && <p>Name: {profile.name}</p>}
                {profile.company && <p>Company: {profile.company}</p>}
                {profile.role && <p>Role: {profile.role}</p>}
                {profile.branch && <p>Branch: {profile.branch}</p>}
                {profile.difficulty && <p>Difficulty: {profile.difficulty}</p>}
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
                  {liveInsights.map((insight, index) => (
                    <li
                      key={`${insight}-${index}`}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Strong Topics
              </h3>
              {profile.strong_topics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.strong_topics.map((topic) => (
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
              {profile.weak_topics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.weak_topics.map((topic) => (
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
              progress_score: {profile.progress_score}
            </p>
            {profile.score_trend.length > 0 && (
              <div className="space-y-1 text-sm text-muted-foreground">
                {profile.score_trend.map((point) => (
                  <p key={point.date}>
                    {point.date}: {point.score}
                  </p>
                ))}
              </div>
            )}
            {profile.weekly_activity.length > 0 && (
              <div className="space-y-1 text-sm text-muted-foreground">
                {profile.weekly_activity.map((day) => (
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
