import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakBadgeProps {
  streak: number;
  calendar?: boolean[];
}

const StreakBadge = ({ streak, calendar }: StreakBadgeProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-3"
    >
      <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5">
        <Flame className="h-4 w-4 text-destructive" />
        <span className="text-sm font-bold text-destructive">{streak}</span>
      </div>
      {calendar && (
        <div className="flex gap-1">
          {calendar.map((active, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${
                active ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default StreakBadge;
