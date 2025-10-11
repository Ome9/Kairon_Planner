import { forwardRef, useImperativeHandle, useState } from "react";
import { Task } from "@/types/plan";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GanttViewProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: number, updates: Partial<Task>) => void;
}

export interface GanttViewHandle {
  exportToPDF: () => void;
}

export const GanttView = forwardRef<GanttViewHandle, GanttViewProps>(
  ({ tasks }, ref) => {
    const [timeScale, setTimeScale] = useState<"day" | "week" | "month">("week");

    // Calculate date range based on actual task dates
    const getDateRange = () => {
      if (!tasks || tasks.length === 0) {
        const today = new Date();
        const start = new Date(today);
        start.setDate(start.getDate() - 7);
        const end = new Date(today);
        end.setDate(end.getDate() + 60);
        return { startDate: start, endDate: end };
      }

      let earliestStart = new Date();
      let latestEnd = new Date();
      
      tasks.forEach((task, index) => {
        // Use task dates if available, otherwise calculate from index
        const taskStart = task.start_date ? new Date(task.start_date) : new Date(new Date().getTime() + index * 24 * 60 * 60 * 1000);
        const taskDuration = Math.max(1, Math.ceil(task.estimated_duration_hours / 8));
        const taskEnd = task.end_date ? new Date(task.end_date) : new Date(taskStart.getTime() + taskDuration * 24 * 60 * 60 * 1000);
        
        if (index === 0 || taskStart < earliestStart) earliestStart = taskStart;
        if (index === 0 || taskEnd > latestEnd) latestEnd = taskEnd;
      });

      // Add padding
      const paddedStart = new Date(earliestStart);
      paddedStart.setDate(paddedStart.getDate() - 7);
      const paddedEnd = new Date(latestEnd);
      paddedEnd.setDate(paddedEnd.getDate() + 14);

      return { startDate: paddedStart, endDate: paddedEnd };
    };

    const { startDate, endDate } = getDateRange();

    const generateTimeColumns = () => {
      const columns: Date[] = [];
      const current = new Date(startDate);
      
      while (current <= endDate) {
        columns.push(new Date(current));
        
        if (timeScale === "day") {
          current.setDate(current.getDate() + 1);
        } else if (timeScale === "week") {
          current.setDate(current.getDate() + 7);
        } else {
          current.setMonth(current.getMonth() + 1);
        }
      }
      
      return columns;
    };

    const timeColumns = generateTimeColumns();
    const columnWidth = timeScale === "day" ? 60 : timeScale === "week" ? 100 : 140;

    const getTaskBarStyle = (task: Task, index: number) => {
      // Use task dates if available, otherwise calculate from index
      let taskStart: Date;
      let taskEnd: Date;
      
      if (task.start_date && task.end_date) {
        taskStart = new Date(task.start_date);
        taskEnd = new Date(task.end_date);
      } else if (task.start_date) {
        taskStart = new Date(task.start_date);
        const taskDuration = Math.max(1, Math.ceil(task.estimated_duration_hours / 8));
        taskEnd = new Date(taskStart);
        taskEnd.setDate(taskEnd.getDate() + taskDuration);
      } else {
        // Fallback: spread tasks across timeline
        taskStart = new Date(startDate);
        taskStart.setDate(taskStart.getDate() + index * 3);
        const taskDuration = Math.max(1, Math.ceil(task.estimated_duration_hours / 8));
        taskEnd = new Date(taskStart);
        taskEnd.setDate(taskEnd.getDate() + taskDuration);
      }

      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const startOffset = Math.ceil((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const durationDays = Math.max(1, Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)));

      const left = Math.max(0, (startOffset / totalDays) * 100);
      const width = Math.min(100 - left, (durationDays / totalDays) * 100);

      return { left: `${left}%`, width: `${Math.max(2, width)}%` };
    };

    const getCategoryColor = (category: string) => {
      const colors: Record<string, string> = {
        Research: "bg-blue-500",
        Design: "bg-purple-500",
        Development: "bg-green-500",
        Marketing: "bg-orange-500",
        Legal: "bg-red-500",
        Planning: "bg-cyan-500",
        Testing: "bg-yellow-500",
        Financial: "bg-emerald-500",
        "Content Development": "bg-indigo-500",
        Logistics: "bg-pink-500",
      };
      return colors[category] || "bg-muted";
    };

    const formatDate = (date: Date) => {
      if (timeScale === "day") {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else if (timeScale === "week") {
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      } else {
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      }
    };

    const exportToPDF = () => {
      toast.info("PDF export coming soon!");
    };

    useImperativeHandle(ref, () => ({
      exportToPDF,
    }));

    if (!tasks || tasks.length === 0) {
      return (
        <div className="flex items-center justify-center h-[600px] border rounded-lg bg-muted/30">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No tasks to display in Gantt chart</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-[600px] w-full flex flex-col">
        <div className="flex items-center justify-between mb-4 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-2">
            <Button variant={timeScale === "day" ? "default" : "outline"} size="sm" onClick={() => setTimeScale("day")}>Day</Button>
            <Button variant={timeScale === "week" ? "default" : "outline"} size="sm" onClick={() => setTimeScale("week")}>Week</Button>
            <Button variant={timeScale === "month" ? "default" : "outline"} size="sm" onClick={() => setTimeScale("month")}>Month</Button>
          </div>
          <Button variant="outline" size="sm" onClick={exportToPDF} className="gap-1">
            <Download className="w-4 h-4" />Export PDF
          </Button>
        </div>

        <Card className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <div className="min-w-[1200px]">
              <div className="flex border-b bg-muted/50 sticky top-0 z-10">
                <div className="w-64 p-3 border-r font-semibold flex-shrink-0">Task Name</div>
                <div className="w-32 p-3 border-r font-semibold flex-shrink-0 text-center">Duration</div>
                <div className="flex-1 flex">
                  {timeColumns.map((date, index) => (
                    <div key={index} className="border-r p-2 text-xs text-center" style={{ minWidth: `${columnWidth}px` }}>
                      {formatDate(date)}
                    </div>
                  ))}
                </div>
              </div>

              {tasks.map((task, index) => {
                const barStyle = getTaskBarStyle(task, index);
                
                return (
                  <div key={task.id} className="flex border-b hover:bg-muted/30 transition-colors">
                    <div className="w-64 p-3 border-r flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs rounded">{task.id}</div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("text-sm font-medium truncate", task.completed && "line-through opacity-60")}>{task.title}</div>
                          <Badge variant="outline" className="text-xs mt-1">{task.category}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-32 p-3 border-r flex-shrink-0 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />{task.estimated_duration_hours}h
                    </div>
                    
                    <div className="flex-1 relative bg-muted/10" style={{ minHeight: "60px" }}>
                      <div className="absolute inset-0 flex items-center px-2">
                        <div 
                          className={cn(
                            "h-10 rounded-lg flex items-center px-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer relative overflow-hidden border-2 border-white/20",
                            getCategoryColor(task.category),
                            task.completed && "opacity-70"
                          )} 
                          style={barStyle} 
                          title={`${task.title}\nDuration: ${task.estimated_duration_hours}h\nStatus: ${task.completed ? 'Completed' : 'In Progress'}`}
                        >
                          <span className="truncate text-shadow">{task.title}</span>
                          {task.completed && (
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600/40 to-green-800/40 flex items-center justify-center backdrop-blur-[1px]">
                              <span className="text-sm font-bold drop-shadow-lg">✓ DONE</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    );
  }
);

GanttView.displayName = "GanttView";
