import { motion } from "framer-motion";
import type { WeeklyActivity } from "@/types";

interface HeatmapGridProps {
  data: WeeklyActivity[];
}

const intensityClasses = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary",
];

const HeatmapGrid = ({ data }: HeatmapGridProps) => {
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {data.map((item, i) => (
          <motion.div
            key={item.day}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`h-8 w-8 rounded-md ${intensityClasses[item.intensity]}`}
              title={`${item.day}: intensity ${item.intensity}`}
            />
            <span className="text-[10px] text-muted-foreground">{item.day.slice(0, 2)}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <span>Less</span>
        {intensityClasses.map((cls, i) => (
          <div key={i} className={`h-3 w-3 rounded-sm ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatmapGrid;
