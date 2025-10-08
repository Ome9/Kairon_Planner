import { motion } from "framer-motion";
import { ProjectPlan } from "@/types/plan";
import { Card } from "./ui/card";
import { Clock, GitBranch, Target, Download, Filter } from "lucide-react";
import { useState } from "react";
import { ViewToggle, ViewType } from "./ViewToggle";
import { ListView } from "./views/ListView";
import { TimelineView } from "./views/TimelineView";
import { KanbanView } from "./views/KanbanView";
import { AnalyticsView } from "./views/AnalyticsView";
import { Button } from "./ui/button";

interface PlanDisplayProps {
  plan: ProjectPlan;
}

export const PlanDisplay = ({ plan }: PlanDisplayProps) => {
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const totalHours = plan.tasks.reduce((sum, task) => sum + task.estimated_duration_hours, 0);
  const categories = Array.from(new Set(plan.tasks.map(t => t.category)));
  
  const filteredTasks = filterCategory 
    ? plan.tasks.filter(t => t.category === filterCategory)
    : plan.tasks;

  const handleExport = () => {
    const dataStr = JSON.stringify(plan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${plan.projectName.replace(/\s/g, '_')}_plan.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            {plan.projectName}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            {plan.projectSummary}
          </p>
        </motion.div>

        {/* Stats & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-border"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{plan.tasks.length}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Tasks</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accent/10">
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalHours}h</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Estimated</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10">
                <GitBranch className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {plan.tasks.filter((t) => t.dependencies.length > 0).length}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Dependencies</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </motion.div>
      </div>

      {/* View Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
      >
        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterCategory || "all"}
            onChange={(e) => setFilterCategory(e.target.value === "all" ? null : e.target.value)}
            className="px-3 py-1.5 border border-border bg-background text-sm font-medium focus:outline-none focus:border-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Views */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {currentView === "list" && <ListView tasks={filteredTasks} />}
        {currentView === "timeline" && <TimelineView tasks={filteredTasks} />}
        {currentView === "kanban" && <KanbanView tasks={filteredTasks} />}
        {currentView === "analytics" && <AnalyticsView tasks={plan.tasks} projectName={plan.projectName} />}
      </motion.div>
    </motion.div>
  );
};
