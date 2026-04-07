import { Badge } from "@/components/ui/badge";

interface TopicTagProps {
  topic: string;
  status?: "weak" | "moderate" | "strong";
}

const statusStyles = {
  weak: "border-destructive/30 bg-destructive/10 text-destructive",
  moderate: "border-warning/30 bg-warning/10 text-warning",
  strong: "border-success/30 bg-success/10 text-success",
};

const TopicTag = ({ topic, status }: TopicTagProps) => {
  if (!status) {
    return (
      <Badge variant="outline" className="text-xs font-medium">
        {topic}
      </Badge>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
      {topic}
    </span>
  );
};

export default TopicTag;
