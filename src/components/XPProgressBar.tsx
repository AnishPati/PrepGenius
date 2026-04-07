import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface XPProgressBarProps {
  xp: number;
  xpForNextLevel: number;
  xpAtCurrentLevel: number;
  level: number;
  xpEarnedToday?: number;
}

const XPProgressBar = ({ xp, xpForNextLevel, xpAtCurrentLevel, level, xpEarnedToday }: XPProgressBarProps) => {
  const progress = ((xp - xpAtCurrentLevel) / (xpForNextLevel - xpAtCurrentLevel)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {level}
          </div>
          <span className="text-sm font-medium text-foreground">Level {level}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {xp - xpAtCurrentLevel} / {xpForNextLevel - xpAtCurrentLevel} XP
        </span>
      </div>
      <Progress value={progress} className="h-2.5" />
      {xpEarnedToday !== undefined && xpEarnedToday > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1 text-xs font-medium text-primary"
        >
          <Zap className="h-3.5 w-3.5" />
          +{xpEarnedToday} XP today
        </motion.div>
      )}
    </motion.div>
  );
};

export default XPProgressBar;
