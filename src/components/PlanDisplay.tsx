import { motion } from "framer-motion";
import { ProjectPlan, Task } from "@/types/plan";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, GitBranch, Target, Download, Filter, FileDown, Table2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ViewToggle, ViewType } from "./ViewToggle";
import { ListView } from "./views/ListView";
import { TimelineView } from "./views/TimelineView";
import { KanbanView } from "./views/KanbanView";
import { AnalyticsView } from "./views/AnalyticsView";
import { DataGridView, DataGridViewHandle } from "./views/DataGridView";
import { KanbanBoardView } from "./views/KanbanBoardView";
import { GanttView, GanttViewHandle } from "./views/GanttView";
import { SchedulerView } from "./views/SchedulerView";
import { DevExtremeProvider } from "./DevExtremeProvider";
import { Button } from "./ui/button";
import anime from "animejs";
import { toast } from "./ui/use-toast";

interface PlanDisplayProps {
  plan: ProjectPlan;
  onPlanUpdate?: (updatedPlan: ProjectPlan) => void;
}

export const PlanDisplay = ({ plan, onPlanUpdate }: PlanDisplayProps) => {
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const statCardsRef = useRef<HTMLDivElement>(null);
  const dataGridRef = useRef<DataGridViewHandle>(null);
  const ganttRef = useRef<GanttViewHandle>(null);

  const totalHours = plan.tasks.reduce((sum, task) => sum + task.estimated_duration_hours, 0);
  const categories = Array.from(new Set(plan.tasks.map(t => t.category)));
  
  const filteredTasks = filterCategory 
    ? plan.tasks.filter(t => t.category === filterCategory)
    : plan.tasks;

  // Animate stat cards on mount
  useEffect(() => {
    if (statCardsRef.current) {
      const cards = statCardsRef.current.querySelectorAll('.stat-card');
      anime({
        targets: cards,
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutExpo'
      });
    }
  }, []);

  const handleExport = () => {
    const dataStr = JSON.stringify(plan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${plan.projectName.replace(/\s/g, '_')}_plan.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExportPDF = () => {
    if (currentView === "datagrid") {
      dataGridRef.current?.exportToPDF();
    } else if (currentView === "gantt") {
      ganttRef.current?.exportToPDF();
    }
  };

  const handleExportExcel = () => {
    if (currentView === "datagrid") {
      dataGridRef.current?.exportToExcel();
    }
  };

  const handleColumnChooser = () => {
    if (currentView === "datagrid") {
      dataGridRef.current?.showColumnChooser();
    }
  };

  const handleTaskAdd = (task: Partial<Task>) => {
    const maxId = plan.tasks.length > 0 ? Math.max(...plan.tasks.map(t => t.id)) : 0;
    const newTask: Task = {
      id: maxId + 1,
      title: task.title || "New Task",
      description: task.description || "",
      category: task.category || "General",
      estimated_duration_hours: task.estimated_duration_hours || 1,
      dependencies: task.dependencies || [],
      completed: task.completed || false,
      status: task.status,
    };
    
    const updatedPlan = {
      ...plan,
      tasks: [...plan.tasks, newTask],
    };
    
    if (onPlanUpdate) {
      onPlanUpdate(updatedPlan);
    }
    
    toast({
      title: "Task Added",
      description: `Task "${newTask.title}" has been added successfully.`,
    });
  };

  const handleTaskUpdate = (taskId: number, updates: Partial<Task>) => {
    const updatedTasks = plan.tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    const updatedPlan = {
      ...plan,
      tasks: updatedTasks,
    };
    
    if (onPlanUpdate) {
      onPlanUpdate(updatedPlan);
    }
    
    toast({
      title: "Task Updated",
      description: `Task #${taskId} has been updated successfully.`,
    });
  };

  const handleTaskDelete = (taskId: number) => {
    const updatedTasks = plan.tasks.filter(task => task.id !== taskId);
    
    const updatedPlan = {
      ...plan,
      tasks: updatedTasks,
    };
    
    if (onPlanUpdate) {
      onPlanUpdate(updatedPlan);
    }
    
    toast({
      title: "Task Deleted",
      description: `Task #${taskId} has been deleted successfully.`,
    });
  };

  const showDevExtremeToolbar = ["datagrid", "gantt", "scheduler"].includes(currentView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="max-w-7xl mx-auto px-4 py-10"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight break-words">
                {plan.projectName}
              </h2>
              <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                Active
              </Badge>
            </div>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl break-words">
              {plan.projectSummary}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
            {showDevExtremeToolbar && (
              <>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <FileDown className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                {currentView === "datagrid" && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleExportExcel}>
                      <Table2 className="w-4 h-4 mr-2" />
                      Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleColumnChooser}>
                      Columns
                    </Button>
                  </>
                )}
              </>
            )}
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Full Width Row */}
      <div ref={statCardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <Card className="p-4 bg-card border border-border h-full flex items-center gap-3 hover:shadow-lg hover:scale-105 cursor-pointer group transition-all">
            <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xl font-semibold">{plan.tasks.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Tasks</div>
            </div>
          </Card>
        </div>

        <div className="stat-card">
          <Card className="p-4 bg-card border border-border h-full flex items-center gap-3 hover:shadow-lg hover:scale-105 cursor-pointer group transition-all">
            <div className="p-2 rounded-md bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-xl font-semibold">{totalHours}h</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Estimated</div>
            </div>
          </Card>
        </div>

        <div className="stat-card">
          <Card className="p-4 bg-card border border-border h-full flex items-center gap-3 hover:shadow-lg hover:scale-105 cursor-pointer group transition-all">
            <div className="p-2 rounded-md bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <GitBranch className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-xl font-semibold">{plan.tasks.filter((t) => t.dependencies.length > 0).length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Dependencies</div>
            </div>
          </Card>
        </div>
      </div>

      {/* View Toggle & Filter - Separate Floating Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Card className="p-3 bg-card border border-border shadow-md">
            <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
          </Card>
        </div>

        <Card className="p-3 bg-card border border-border shadow-md w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <select
              value={filterCategory || "all"}
              onChange={(e) => setFilterCategory(e.target.value === "all" ? null : e.target.value)}
              className="flex-1 sm:min-w-[200px] px-3 py-1.5 border border-border bg-background text-sm font-medium focus:outline-none focus:border-primary rounded hover:bg-accent transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </Card>
      </div>

      {/* Views */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.06 }}
      >
        <div className="bg-background p-4 rounded-lg border border-border">
          <DevExtremeProvider>
            {currentView === "list" && <ListView tasks={filteredTasks} />}
            {currentView === "timeline" && <TimelineView tasks={filteredTasks} />}
            {currentView === "kanban" && (
              <KanbanView 
                tasks={filteredTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskAdd={handleTaskAdd}
              />
            )}
            {currentView === "analytics" && <AnalyticsView tasks={plan.tasks} projectName={plan.projectName} />}
            {currentView === "datagrid" && <DataGridView ref={dataGridRef} tasks={filteredTasks} onTaskAdd={handleTaskAdd} />}
            {currentView === "gantt" && (
              <GanttView 
                ref={ganttRef} 
                tasks={filteredTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskAdd={handleTaskAdd}
                onTaskDelete={handleTaskDelete}
              />
            )}
            {currentView === "scheduler" && <SchedulerView tasks={filteredTasks} />}
          </DevExtremeProvider>
        </div>
      </motion.div>
    </motion.div>
  );
};
