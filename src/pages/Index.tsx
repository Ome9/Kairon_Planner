import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { PlanDisplay } from "@/components/PlanDisplay";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProjectPlan } from "@/types/plan";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderOpen, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { plansAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use actual user ID from auth
  const userId = user?._id || "temp-user-123";

  // Load plan from navigation state if coming from SavedPlans
  useEffect(() => {
    if (location.state?.plan) {
      const loadedPlan = location.state.plan;
      setPlan(loadedPlan);
      setSavedPlanId(loadedPlan._id);
      
      // Clear the navigation state
      window.history.replaceState({}, document.title);
      
      toast.success("Plan loaded successfully!");
    }
  }, [location]);

  const savePlanToDatabase = async (planData: ProjectPlan) => {
    try {
      setIsSaving(true);
      
      // Helper function to convert TaskStatus to API status
      const convertStatus = (status: unknown): 'not_started' | 'in_progress' | 'review' | 'completed' => {
        if (!status) return 'not_started';
        if (typeof status === 'string') {
          const statusMap: Record<string, 'not_started' | 'in_progress' | 'review' | 'completed'> = {
            'Backlog': 'not_started',
            'To Do': 'not_started',
            'In Progress': 'in_progress',
            'In Review': 'review',
            'Done': 'completed',
            'not_started': 'not_started',
            'in_progress': 'in_progress',
            'review': 'review',
            'completed': 'completed'
          };
          return statusMap[status] || 'not_started';
        }
        return 'not_started';
      };
      
      if (savedPlanId) {
        // Update existing plan
        await plansAPI.updatePlan(savedPlanId, {
          projectName: planData.projectName,
          projectSummary: planData.projectSummary,
          tasks: planData.tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            category: task.category,
            estimated_duration_hours: task.estimated_duration_hours,
            dependencies: task.dependencies,
            status: convertStatus(task.status),
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + task.estimated_duration_hours * 60 * 60 * 1000).toISOString(),
            progress: 0,
            assignee: "",
            priority: "medium",
          })),
          status: "active",
        });
        setHasUnsavedChanges(false);
        toast.success("Plan saved successfully!");
      } else {
        // Create new plan
        const response = await plansAPI.createPlan({
          userId,
          projectName: planData.projectName,
          projectSummary: planData.projectSummary,
          goalText: planData.projectSummary,
          tasks: planData.tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            category: task.category,
            estimated_duration_hours: task.estimated_duration_hours,
            dependencies: task.dependencies,
            status: convertStatus(task.status),
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + task.estimated_duration_hours * 60 * 60 * 1000).toISOString(),
            progress: 0,
            assignee: "",
            priority: "medium",
          })),
          status: "active",
          tags: [],
          color: "#06b6d4",
        });

        setSavedPlanId(response.data._id!);
        setHasUnsavedChanges(false);
        toast.success("Plan saved to database!");
        return response.data._id;
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save plan to database");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

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

      const generatedPlan = data as ProjectPlan;
      setPlan(generatedPlan);
      toast.success("Your project plan has been generated!");

      // Auto-save to database
      await savePlanToDatabase(generatedPlan);
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setSavedPlanId(null);
    setHasUnsavedChanges(false);
  };

  const handlePlanUpdate = (updatedPlan: ProjectPlan) => {
    setPlan(updatedPlan);
    setHasUnsavedChanges(true);
  };

  const handleManualSave = async () => {
    if (plan && hasUnsavedChanges) {
      await savePlanToDatabase(plan);
    }
  };

  // Auto-save every 60 seconds when there are unsaved changes
  useEffect(() => {
    if (plan && hasUnsavedChanges && !isSaving) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer for 60 seconds
      autoSaveTimerRef.current = setTimeout(() => {
        console.log("Auto-saving plan...");
        savePlanToDatabase(plan);
      }, 60000); // 60 seconds
    }

    // Cleanup timer on unmount or when dependencies change
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, hasUnsavedChanges, isSaving]);

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
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/app/plans')}
              className="gap-2 font-semibold"
            >
              <FolderOpen className="w-4 h-4" />
              My Plans
            </Button>
            {plan && (
              <>
                <Button
                  variant={hasUnsavedChanges ? "default" : "outline"}
                  size="sm"
                  onClick={handleManualSave}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="gap-2 font-semibold"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? "Saving..." : hasUnsavedChanges ? "Save Changes" : "Saved"}
                </Button>
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
              </>
            )}
            <ProfileHeader />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={!plan ? "relative" : "pt-20 relative"}>
        <div className={!plan ? "" : "container mx-auto px-4"}>
          {!plan ? (
            <HeroSection onGeneratePlan={handleGeneratePlan} isLoading={isLoading} />
          ) : (
            <PlanDisplay plan={plan} onPlanUpdate={handlePlanUpdate} />
          )}
        </div>
      </main>

      {/* Footer - only show when plan is displayed */}
      {plan && (
        <footer className="border-t border-border py-8 mt-20">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Built with ❤️ for productivity • Powered by AI</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
