import { motion } from "framer-motion";
import { Zap, TrendingUp, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

interface HeroSectionProps {
  onGeneratePlan: (goal: string) => void;
  isLoading: boolean;
}

export const HeroSection = ({ onGeneratePlan, isLoading }: HeroSectionProps) => {
  const [goalText, setGoalText] = useState("");

  const handleSubmit = () => {
    if (goalText.trim()) {
      onGeneratePlan(goalText);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-5xl mx-auto w-full"
      >
        {/* Minimal Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-8 mb-12 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span>10,000+ Plans Generated</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span>95% Success Rate</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-bold mb-6 text-center tracking-tight"
        >
          Plan Smarter.
          <br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">Execute Faster.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto text-center font-light"
        >
          Enterprise-grade project planning powered by AI. Turn any goal into a structured, 
          dependency-mapped execution plan in seconds.
        </motion.p>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border shadow-elevated p-8 max-w-3xl mx-auto"
        >
          <div className="space-y-4">
            <div className="text-left">
              <label htmlFor="goal-input" className="text-sm font-semibold mb-3 block uppercase tracking-wide text-muted-foreground">
                Project Goal
              </label>
              <Textarea
                id="goal-input"
                placeholder="Enter your project goal (e.g., Launch a SaaS product, Organize a conference, Build an AI application...)"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                className="min-h-[140px] resize-none text-base bg-background border-border focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={!goalText.trim() || isLoading}
              size="lg"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity font-semibold uppercase tracking-wide"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin mr-2" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Generate Project Plan
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
