import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TagInput from "@/components/TagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { onboardUser } from "@/lib/api";
import { Loader2, ArrowRight, ArrowLeft, Zap, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BRANCHES = ["Computer Science", "Information Technology", "Electronics", "Electrical", "Mechanical", "Civil", "Other"];

const STEPS = [
  { title: "Personal Info", subtitle: "Let's get to know you" },
  { title: "Academic Details", subtitle: "Tell us about your background" },
  { title: "Goals", subtitle: "What are you preparing for?" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [companies, setCompanies] = useState<string[]>([]);

  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext = () => {
    if (step === 0) return name.trim() && email.trim();
    if (step === 1) return branch && cgpa;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onboardUser({ name, email, branch, cgpa: parseFloat(cgpa), targetCompanies: companies });
      toast.success("Profile created!");
      navigate("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          PrepAI
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{STEPS[step].title}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{STEPS[step].title}</h2>
                  <p className="text-sm text-muted-foreground">{STEPS[step].subtitle}</p>
                </div>

                {step === 0 && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="space-y-1.5">
                      <Label>Branch</Label>
                      <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                        <SelectContent>
                          {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input id="cgpa" type="number" step="0.01" min="0" max="10" value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="8.5" />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-1.5">
                      <Label>Target Companies</Label>
                      <TagInput tags={companies} onChange={setCompanies} placeholder="e.g. Google, Amazon — press Enter" />
                    </div>
                    <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 text-center space-y-2">
                      <Rocket className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-sm font-medium text-foreground">Your personalized AI prep plan is ready 🚀</p>
                      <p className="text-xs text-muted-foreground">Complete setup to unlock your dashboard</p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0} size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canNext()} size="sm">
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} size="sm">
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                  {loading ? "Setting up..." : "Get Started"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
