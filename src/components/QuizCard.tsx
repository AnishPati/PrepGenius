import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface QuizCardProps {
  index: number;
  question: string;
  topic: string;
  value: string;
  onChange: (value: string) => void;
}

const QuizCard = ({ index, question, topic, value, onChange }: QuizCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-foreground">
          <span className="text-muted-foreground mr-1">Q{index}.</span>
          {question}
        </p>
        <Badge variant="secondary" className="shrink-0 text-xs">{topic}</Badge>
      </div>
      <Textarea
        placeholder="Type your answer here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] resize-y"
      />
    </div>
  );
};

export default QuizCard;
