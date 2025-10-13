import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import React from "react";
import { WavyBackground } from "./ui/wavy-background";

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
    <section className="relative">
      <WavyBackground 
        className="max-w-4xl mx-auto py-8"
        containerClassName="min-h-screen flex items-center"
      >
        {/* Centered Content */}
        <div className="relative z-10 w-full px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            {/* Title and Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
                Plan smart, <br /> execute flawlessly
              </h1>
              <p className="text-base md:text-lg text-white">
                Transform your goals into actionable plans with AI
              </p>
            </motion.div>

            {/* Project Goal Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl p-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="goal-input" className="text-sm font-bold mb-3 block text-white/90">
                      PROJECT GOAL
                    </label>
                    <Textarea
                      id="goal-input"
                      placeholder="Describe your project goal..."
                      value={goalText}
                      onChange={(e) => setGoalText(e.target.value)}
                      className="min-h-[150px] resize-none text-base bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 focus:border-white/30 focus:ring-0 transition-all text-white placeholder:text-white/40"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSubmit}
                      disabled={!goalText.trim() || isLoading}
                      size="lg"
                      className={`flex-1 font-semibold text-base transition-all ${
                        goalText.trim()
                          ? "bg-white text-slate-900 hover:bg-white/90 hover:shadow-lg"
                          : "bg-white/10 text-white/30 cursor-not-allowed"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin mr-2" />
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
                      variant="outline"
                      className="font-semibold text-base border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all bg-transparent"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </WavyBackground>
    </section>
  );
};
