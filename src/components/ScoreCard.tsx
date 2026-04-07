import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreCardProps {
  score: number;
  maxScore?: number;
  trend: "improving" | "declining" | "stable";
  label?: string;
}

const trendConfig = {
  improving: { icon: TrendingUp, text: "Improving", className: "text-success" },
  declining: { icon: TrendingDown, text: "Declining", className: "text-destructive" },
  stable: { icon: Minus, text: "Stable", className: "text-muted-foreground" },
};

const ScoreCard = ({ score, maxScore = 10, trend, label = "Your Score" }: ScoreCardProps) => {
  const config = trendConfig[trend];
  const TrendIcon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-foreground">{score}</span>
            <span className="text-lg text-muted-foreground mb-1">/ {maxScore}</span>
          </div>
          <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${config.className}`}>
            <TrendIcon className="h-4 w-4" />
            {config.text}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScoreCard;
