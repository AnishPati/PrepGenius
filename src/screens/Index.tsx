"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Brain, TrendingUp, Target, Star, ArrowRight } from "lucide-react";

const features = [
  { icon: Brain, title: "Adaptive Learning", desc: "AI tailors questions to your weak areas for maximum improvement" },
  { icon: Target, title: "Daily Challenges", desc: "Build consistency with streak-based daily practice sessions" },
  { icon: TrendingUp, title: "Track Progress", desc: "Visualize your improvement with detailed analytics and insights" },
];

const testimonials = [
  { name: "Priya S.", role: "SDE at Google", text: "PrepAI helped me crack my dream job. The daily practice habit was a game changer." },
  { name: "Rahul K.", role: "SDE at Amazon", text: "The adaptive quizzes focused exactly on my weak areas. Improved my score by 40%!" },
  { name: "Anita M.", role: "SDE at Microsoft", text: "The gamification kept me motivated. 30-day streak and got 3 offers!" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="dark min-h-screen flex flex-col bg-transparent">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#121010]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 h-20">
          <div className="flex items-center gap-3 font-bold text-white text-2xl">
            <img src="https://raw.githubusercontent.com/Aayush081sahay/PrepGenius/refs/heads/main/AIIIIII.svg" alt="PrepGenius" className="h-10 w-10 invert" />
            PrepGenius
          </div>
          <Button variant="ghost" size="lg" onClick={() => navigate("/onboarding")} className="text-base font-medium hover:bg-white/10 hover:text-white">
            Sign Up for Free
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="flex items-center justify-center px-4 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-center space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00FFB2]/20 bg-[#00FFB2]/10 px-3 py-1 text-xs font-medium text-[#00FFB2]">
              <Star className="h-3 w-3" /> AI-Powered Interview Prep
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Your AI Interview
              <br />
              <span className="text-[#00FFB2]">Coach</span>
            </h1>
            <p className="text-lg text-white/70 max-w-md mx-auto">
              Daily adaptive challenges. Real-time AI feedback. Track your progress and ace your next tech interview.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-full px-8 text-base gap-2 bg-[#00FFB2] text-black hover:bg-[#00FFB2]/90" onClick={() => navigate("/onboarding")}>
                Start Your Prep <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Company Marquee */}
        <section className="w-full overflow-hidden border-y border-white/10 bg-white/5 py-6 mb-20">
          <div className="flex w-max animate-marquee">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex gap-6 px-3">
                {[
                  { name: "Persistent", domain: "persistent.com" },
                  { name: "Simplilearn", domain: "simplilearn.com" },
                  { name: "Texas Instruments", domain: "ti.com" },
                  { name: "upGrad", domain: "upgrad.com" },
                  { name: "whatfix", domain: "whatfix.com" },
                  { name: "ZOHO", domain: "zoho.com" },
                  { name: "Accenture", domain: "accenture.com" },
                  { name: "BOSCH", domain: "bosch.com" },
                  { name: "GaragePlug", domain: "garageplug.com" },
                  { name: "Google", domain: "google.com" },
                  { name: "Infosys", domain: "infosys.com" },
                  { name: "KPMG", domain: "kpmg.com" },
                  { name: "Amazon", domain: "amazon.com" },
                  { name: "Microsoft", domain: "microsoft.com" },
                  { name: "TCS", domain: "tcs.com" }
                ].map((company) => (
                  <div key={company.name} className="flex h-12 items-center justify-center gap-2 rounded bg-white px-8 font-bold text-black text-sm md:text-base shadow-sm whitespace-nowrap flex-shrink-0">
                    <img 
                      src={`https://logo.clearbit.com/${company.domain}`} 
                      alt={`${company.name} logo`} 
                      className="h-5 w-5 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {company.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-4xl space-y-8">
            <h2 className="text-2xl font-bold text-center text-foreground">Loved by Engineers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-5 space-y-3"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
