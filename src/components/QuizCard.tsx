import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface QuizCardProps {
  index: number;
  question: string;
  topic: string;
  difficulty?: "easy" | "medium" | "hard";
  value: string;
  onChange: (value: string) => void;
}

const difficultyColors = {
  easy: "bg-success/10 text-success border-success/30",
  medium: "bg-warning/10 text-warning border-warning/30",
  hard: "bg-destructive/10 text-destructive border-destructive/30",
};

const QuizCard = ({ index, question, topic, difficulty = "medium", value, onChange }: QuizCardProps) => {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex w-full items-start justify-between gap-3 text-left">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-foreground">
              <span className="text-muted-foreground mr-1.5">Q{index}.</span>
              {question}
            </p>
            <div className="flex gap-1.5">
              <Badge variant="secondary" className="text-xs">{topic}</Badge>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${difficultyColors[difficulty]}`}>
                {difficulty}
              </span>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform mt-0.5 ${open ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <Textarea
            placeholder="Type your answer here..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[100px] resize-y rounded-xl"
          />
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default QuizCard;
