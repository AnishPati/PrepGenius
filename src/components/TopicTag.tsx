import { Badge } from "@/components/ui/badge";

interface TopicTagProps {
  topic: string;
}

const TopicTag = ({ topic }: TopicTagProps) => {
  return (
    <Badge variant="outline" className="text-xs font-medium">
      {topic}
    </Badge>
  );
};

export default TopicTag;
