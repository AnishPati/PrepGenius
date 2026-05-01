"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { onboardUser } from "@/lib/api";
import { Loader2, ArrowRight, ArrowLeft, Zap, Rocket, Building2, Briefcase, CheckCircle2, Brain, Code, BookOpen, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BRANCHES = ["Computer Science", "Information Technology", "Electronics", "Electrical", "Mechanical", "Civil", "Other"];
const COMPANIES = ["Google", "Amazon", "Microsoft", "TCS", "Infosys", "Other"];
const ROLES = ["SDE", "Data Analyst", "Core Engineer", "Product Manager", "Other"];

const CHALLENGE_BREAKDOWN = [
  { icon: Brain, label: "Aptitude", count: 3, color: "text-primary" },
  { icon: Code, label: "Technical / DSA", count: 4, color: "text-primary" },
  { icon: BookOpen, label: "Core Subjects", count: 2, color: "text-primary" },
  { icon: MessageSquare, label: "Behavioral", count: 1, color: "text-primary" },
];

const STEPS = [
  { title: "Personal Info", subtitle: "Let's get to know you" },
  { title: "Academic Details", subtitle: "Tell us about your background" },
  { title: "Career Target", subtitle: "What role are you aiming for?" },
  { title: "Daily Challenge", subtitle: "Here's what to expect each day" },
  { title: "Confirmation", subtitle: "Review your prep plan" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [company, setCompany] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const progress = ((step + 1) / STEPS.length) * 100;
  const resolvedCompany = company === "Other" ? customCompany : company;
  const resolvedRole = role === "Other" ? customRole : role;

  const canNext = () => {
    if (step === 0) return name.trim() && email.trim();
    if (step === 1) return branch && cgpa;
    if (step === 2) {
      return (company && (company !== "Other" || customCompany.trim())) &&
             (role && (role !== "Other" || customRole.trim()));
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onboardUser({
        name, email, branch, cgpa: parseFloat(cgpa),
        targetCompanies: [resolvedCompany],
        company: resolvedCompany, role: resolvedRole, difficulty,
      });
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
        <div className="flex items-center justify-center gap-2 font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          PrepAI
        </div>

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
                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.98 }}
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
                      <Label className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-muted-foreground" /> Target Company
                      </Label>
                      <Select value={company} onValueChange={setCompany}>
                        <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                        <SelectContent>
                          {COMPANIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {company === "Other" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-1.5">
                          <Input value={customCompany} onChange={(e) => setCustomCompany(e.target.value)} placeholder="Enter company name" />
                        </motion.div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-muted-foreground" /> Job Role
                      </Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {role === "Other" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-1.5">
                          <Input value={customRole} onChange={(e) => setCustomRole(e.target.value)} placeholder="Enter role title" />
                        </motion.div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty Preference <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <RadioGroup value={difficulty} onValueChange={(v) => setDifficulty(v as "easy" | "medium" | "hard")} className="flex gap-4">
                        {(["easy", "medium", "hard"] as const).map((d) => (
                          <div key={d} className="flex items-center gap-1.5">
                            <RadioGroupItem value={d} id={`diff-${d}`} />
                            <Label htmlFor={`diff-${d}`} className="capitalize cursor-pointer text-sm font-normal">{d}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5 space-y-4">
                      <p className="text-sm font-medium text-foreground text-center">
                        Your daily AI challenge will include:
                      </p>
                      <div className="space-y-2.5">
                        {CHALLENGE_BREAKDOWN.map((item, i) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <item.icon className={`h-4 w-4 ${item.color}`} />
                              <span>{item.label}</span>
                            </div>
                            <span className="font-medium text-foreground">{item.count} questions</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="border-t border-primary/10 pt-3 flex items-center justify-between text-sm font-semibold text-foreground">
                        <span>Total</span>
                        <span>10 questions/day</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5 space-y-3">
                      <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-center text-sm font-medium text-foreground">You are preparing for</p>
                      <p className="text-center text-lg font-bold text-primary">
                        {resolvedCompany} — {resolvedRole}
                      </p>
                      <p className="text-center text-xs text-muted-foreground">Daily Challenge: 10 questions</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t border-primary/10">
                        <div><span className="font-medium text-foreground">Branch:</span> {branch}</div>
                        <div><span className="font-medium text-foreground">CGPA:</span> {cgpa}</div>
                        <div><span className="font-medium text-foreground">Difficulty:</span> <span className="capitalize">{difficulty}</span></div>
                        <div><span className="font-medium text-foreground">Email:</span> {email}</div>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 text-center space-y-2">
                      <Rocket className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-sm font-medium text-foreground">Your personalized AI prep plan is ready 🚀</p>
                      <p className="text-xs text-muted-foreground">Hit the button below to start your journey</p>
                    </div>
                  </div>
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
                  {loading ? "Setting up..." : "Start My Preparation 🚀"}
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
