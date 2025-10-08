import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import React from "react";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden w-full z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 items-center justify-center isolate z-0 py-16">
        <motion.div
          initial={{ opacity: 0.5, width: "10rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[20rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-32 h-[100%] left-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "10rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[20rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-32 h-[100%] right-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ width: "8rem", opacity: 0 }}
          whileInView={{ opacity: 1, width: "24rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-2 w-[24rem] -translate-y-[14rem] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-2xl shadow-cyan-400"
        ></motion.div>
        
        {/* Additional glow layers for light bar */}
        <motion.div
          initial={{ width: "8rem", opacity: 0 }}
          whileInView={{ opacity: 1, width: "24rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-45 h-6 w-[24rem] -translate-y-[14rem] bg-cyan-400/40 blur-lg"
        ></motion.div>
        <div className="absolute inset-auto z-40 h-12 w-[28rem] -translate-y-[14rem] bg-cyan-400/20 blur-2xl"></div>
      </div>

      <div className="relative z-50 flex flex-col items-center -mt-12">
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
          {/* Left Side - Lamp Effect with Quote */}
          <div className="relative flex flex-col items-center justify-center mt-20">
            <LampContainer className="h-[400px]">
              <motion.h1
                initial={{ opacity: 0.5, y: 50 }}
                whileInView={{ opacity: 1, y: -80 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="mt-1 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
              >
                Plan smart, <br /> execute flawlessly
              </motion.h1>
            </LampContainer>
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
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>
            
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
                        ? "bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 text-slate-950"
                        : "bg-slate-800 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin mr-2" />
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
                    className="font-semibold text-base border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-all bg-slate-900 rounded-xl"
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
