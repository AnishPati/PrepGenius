import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center space-y-5">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-foreground">Answers Submitted Successfully!</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your responses are being evaluated. Check back soon for your results.
        </p>
        <Button onClick={() => navigate("/dashboard")} className="rounded-full px-8">
          View Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Success;
