import { Task } from "@/types/plan";
import { Card } from "../ui/card";
import { BarChart3, Clock, Target, TrendingUp, GitBranch } from "lucide-react";

interface AnalyticsViewProps {
  tasks: Task[];
  projectName: string;
}

export const AnalyticsView = ({ tasks, projectName }: AnalyticsViewProps) => {
  const totalHours = tasks.reduce((sum, task) => sum + task.estimated_duration_hours, 0);
  const categories = Array.from(new Set(tasks.map(t => t.category)));
  const avgHoursPerTask = totalHours / tasks.length;
  const tasksWithDeps = tasks.filter(t => t.dependencies.length > 0).length;
  
  const categoryBreakdown = categories.map(cat => ({
    category: cat,
    tasks: tasks.filter(t => t.category === cat).length,
    hours: tasks.filter(t => t.category === cat).reduce((sum, t) => sum + t.estimated_duration_hours, 0),
  })).sort((a, b) => b.hours - a.hours);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Total Tasks</p>
              <p className="text-3xl font-bold">{tasks.length}</p>
            </div>
            <div className="p-3 bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Total Hours</p>
              <p className="text-3xl font-bold">{totalHours}</p>
            </div>
            <div className="p-3 bg-accent/10">
              <Clock className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Avg per Task</p>
              <p className="text-3xl font-bold">{avgHoursPerTask.toFixed(1)}h</p>
            </div>
            <div className="p-3 bg-blue-500/10">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Dependencies</p>
              <p className="text-3xl font-bold">{tasksWithDeps}</p>
            </div>
            <div className="p-3 bg-purple-500/10">
              <GitBranch className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="p-6 border-border">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">Category Breakdown</h3>
        </div>
        
        <div className="space-y-4">
          {categoryBreakdown.map((cat) => {
            const percentage = (cat.hours / totalHours) * 100;
            
            return (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{cat.category}</span>
                    <span className="text-xs text-muted-foreground">{cat.tasks} tasks</span>
                  </div>
                  <span className="text-sm font-semibold">{cat.hours}h ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Project Summary */}
      <Card className="p-6 border-border">
        <h3 className="text-lg font-bold mb-4">Project Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Project Name</span>
            <span className="font-semibold">{projectName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Total Phases</span>
            <span className="font-semibold">{categories.length}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Estimated Duration</span>
            <span className="font-semibold">{Math.ceil(totalHours / 8)} working days</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Critical Path Tasks</span>
            <span className="font-semibold">{tasksWithDeps} tasks</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
