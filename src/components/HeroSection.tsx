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
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>
              
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-6 md:p-8 rounded-2xl">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="goal-input" className="text-sm font-semibold mb-2 block tracking-wide text-slate-300">
                      PROJECT GOAL
                    </label>
                    <Textarea
                      id="goal-input"
                      placeholder="Describe your project goal..."
                      value={goalText}
                      onChange={(e) => setGoalText(e.target.value)}
                      className="min-h-[120px] resize-none text-base bg-slate-950/50 border-slate-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-100 placeholder:text-slate-500 rounded-xl"
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
      </WavyBackground>
    </section>
  );
};
