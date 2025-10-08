import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { PlanDisplay } from "@/components/PlanDisplay";
import { ProjectPlan } from "@/types/plan";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async (goalText: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-plan", {
        body: { goalText },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setPlan(data as ProjectPlan);
      toast.success("Your project plan has been generated!");
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary" />
            <span className="text-xl font-bold tracking-tight">
              Kairon
            </span>
          </div>
          {plan && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                New Plan
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {!plan ? (
          <HeroSection onGeneratePlan={handleGeneratePlan} isLoading={isLoading} />
        ) : (
          <PlanDisplay plan={plan} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Lovable AI • Built with ❤️ for productivity</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
