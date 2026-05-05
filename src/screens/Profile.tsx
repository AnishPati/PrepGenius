"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import TopicTag from "@/components/TopicTag";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/api";
import { TrendingUp, Zap, Target } from "lucide-react";

interface ProfileData {
  weak_topics: string[];
  strong_topics: string[];
  progress_score: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please complete onboarding first");
      navigate("/onboarding");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `/api/profile?user_id=${encodeURIComponent(userId)}`,
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" /> Your Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your strengths and areas for improvement
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="rounded-full"
          >
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Progress Score */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Overall Progress
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {profile.progress_score}%
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Strong Topics */}
        {profile && profile.strong_topics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-foreground">
                  ✅ Strong Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.strong_topics.map((topic) => (
                    <TopicTag key={topic} topic={topic} status="strong" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Weak Topics */}
        {profile && profile.weak_topics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-foreground">
                  ⚠️ Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.weak_topics.map((topic) => (
                    <TopicTag key={topic} topic={topic} status="weak" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Focus on these topics in your next daily challenges
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {profile &&
          profile.weak_topics.length === 0 &&
          profile.strong_topics.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center space-y-3">
                <p className="text-muted-foreground">No profile data yet</p>
                <p className="text-sm text-muted-foreground">
                  Complete your first daily challenge to see your topics
                </p>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-full"
                >
                  Start Challenges
                </Button>
              </CardContent>
            </Card>
          )}
      </main>
    </div>
  );
};

export default Profile;
