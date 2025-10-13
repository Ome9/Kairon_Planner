import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import { Boxes } from "./ui/background-boxes";

export const BackgroundBoxesContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("h-[500px] relative w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center", className)}>
      <div className="absolute inset-0 w-full h-full bg-slate-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <div className="relative z-30 flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};

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

  const handleReset = () => {
    setGoalText("");
  };

  return (
    <section className="relative h-screen overflow-hidden bg-slate-950 pt-20">
      <div className="h-full flex items-center justify-center px-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Boxes Background with Quote */}
          <div className="relative flex flex-col items-center justify-center">
            <BackgroundBoxesContainer className="h-[500px]">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="md:text-6xl text-4xl text-white font-bold text-center px-4"
              >
                Plan smart, <br /> execute flawlessly
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.8,
                }}
                className="text-center mt-4 text-neutral-300 text-lg px-4"
              >
                Transform your goals into actionable plans with AI
              </motion.p>
            </BackgroundBoxesContainer>
          </div>

          {/* Right Side - Project Goal Box */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.4,
              duration: 0.6,
              ease: "easeInOut",
            }}
            className="relative group"
          >
            {/* Glow effect - Updated to purple theme */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>
            
            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-8 rounded-2xl">
              <div className="space-y-6">
                <div>
                  <label htmlFor="goal-input" className="text-sm font-semibold mb-3 block tracking-wide text-slate-300">
                    PROJECT GOAL
                  </label>
                  <Textarea
                    id="goal-input"
                    placeholder="Describe your project goal..."
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    className="min-h-[150px] resize-none text-base bg-slate-950/50 border-slate-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-100 placeholder:text-slate-500 rounded-xl"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={!goalText.trim() || isLoading}
                    size="lg"
                    className={`font-semibold text-base transition-all rounded-xl px-6 ${
                      goalText.trim()
                        ? "bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 text-white"
                        : "bg-slate-800 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </Button>

                  <Button
                    onClick={handleReset}
                    disabled={!goalText || isLoading}
                    size="lg"
                    className="font-semibold text-base border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-purple-400 hover:border-purple-500/50 transition-all bg-slate-900 rounded-xl"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
