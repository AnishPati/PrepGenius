"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, PartyPopper, ArrowRight } from "lucide-react";

const confettiColors = ["bg-primary", "bg-success", "bg-warning", "bg-destructive", "bg-accent"];

const Success = () => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 0.5,
      }))
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent relative overflow-hidden">
      {/* Confetti */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, scale: 1 }}
          animate={{ y: "100vh", opacity: 0, rotate: 360 }}
          transition={{ duration: 2 + Math.random() * 2, delay: p.delay, ease: "easeIn" }}
          className={`absolute top-0 h-2 w-2 rounded-full ${p.color}`}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center space-y-6 relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: 2, duration: 0.4, delay: 0.3 }}
        >
          <PartyPopper className="h-16 w-16 text-primary mx-auto" />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-foreground">Great Job! 🎉</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your AI coach is evaluating your answers and preparing tomorrow's personalized challenge.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/dashboard")} className="rounded-full px-8 gap-2">
            View Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/analytics")} className="rounded-full px-8 gap-2">
            View Analytics
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;
