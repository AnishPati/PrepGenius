import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border px-4 h-14 flex items-center">
        <div className="mx-auto max-w-4xl w-full flex items-center gap-2 font-semibold">
          <BookOpen className="h-5 w-5 text-primary" />
          InterviewPrep AI
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Your AI Interview Prep Agent
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Daily adaptive quizzes. Personalized learning. Ace your next tech interview with confidence.
          </p>
          <Button size="lg" className="rounded-full px-8 text-base" onClick={() => navigate("/onboarding")}>
            Get Started
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            {[
              { icon: Brain, title: "Adaptive Quizzes", desc: "Questions tailored to your weak areas" },
              { icon: BookOpen, title: "Instant Feedback", desc: "AI-powered evaluation of your answers" },
              { icon: TrendingUp, title: "Track Progress", desc: "See your improvement over time" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-lg border border-border p-4 text-left space-y-1.5">
                <Icon className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
