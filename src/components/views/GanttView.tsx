import { useRef, forwardRef, useImperativeHandle, useMemo, useState, useCallback } from "react";
import { Task } from "@/types/plan";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, Maximize2, Plus, Save } from "lucide-react";
import { toast } from "sonner";

interface GanttViewProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: number, updates: Partial<Task>) => void;
  onTaskAdd?: (task: Partial<Task>) => void;
  onTaskDelete?: (taskId: number) => void;
}

export interface GanttViewHandle {
  exportToPDF: () => void;
}

interface GanttTask {
  id: number;
  text: string;
  start_date: Date;
  end_date: Date;
  duration: number;
  progress: number;
  parent?: number;
  type?: string;
  details?: string;
}

interface GanttLink {
  id: number;
  source: number;
  target: number;
  type: string;
}

export const GanttView = forwardRef<GanttViewHandle, GanttViewProps>(
  ({ tasks, onTaskUpdate, onTaskAdd, onTaskDelete }, ref) => {
    const ganttRef = useRef<any>(null);
    const [zoom, setZoom] = useState<"day" | "week" | "month">("week");

    // Transform tasks into wx-react-gantt format
    const ganttData = useMemo(() => {
      if (!tasks || tasks.length === 0) {
        return { data: [], links: [] };
      }

      const ganttTasks: GanttTask[] = tasks.map((task, index) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + index * 2);
        
        const duration = Math.max(1, Math.ceil(task.estimated_duration_hours / 8)); // Convert hours to days
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);

        return {
          id: task.id,
          text: task.title || "Untitled Task",
          start_date: startDate,
          end_date: endDate,
          duration: duration,
          progress: task.completed ? 1 : 0,
          type: "task",
          details: `${task.category} - ${task.description}`,
        };
      });

      const ganttLinks: GanttLink[] = [];
      let linkId = 1;
      
      tasks.forEach((task) => {
        if (task.dependencies && task.dependencies.length > 0) {
          task.dependencies.forEach((depId) => {
            ganttLinks.push({
              id: linkId++,
              source: depId,
              target: task.id,
              type: "0", // finish-to-start
            });
          });
        }
      });

      return { data: ganttTasks, links: ganttLinks };
    }, [tasks]);

    const handleTaskUpdate = useCallback((id: number, task: any) => {
      console.log("Task updated:", id, task);
      
      if (onTaskUpdate) {
        const updates: Partial<Task> = {
          title: task.text,
          estimated_duration_hours: task.duration * 8, // Convert days back to hours
          completed: task.progress >= 1,
        };
        onTaskUpdate(id, updates);
        toast.success("Task updated successfully");
      }
    }, [onTaskUpdate]);

    const handleTaskAdd = useCallback((task: any) => {
      console.log("Task added:", task);
      
      if (onTaskAdd) {
        const newTask: Partial<Task> = {
          title: task.text || "New Task",
          description: "",
          category: "General",
          estimated_duration_hours: (task.duration || 1) * 8,
          dependencies: [],
          completed: false,
        };
        onTaskAdd(newTask);
        toast.success("Task added successfully");
      }
    }, [onTaskAdd]);

    const handleTaskDelete = useCallback((id: number) => {
      console.log("Task deleted:", id);
      
      if (onTaskDelete) {
        onTaskDelete(id);
        toast.success("Task deleted successfully");
      }
    }, [onTaskDelete]);

    const handleLinkAdd = useCallback((link: any) => {
      console.log("Link added:", link);
      toast.info("Dependency added - save to persist");
    }, []);

    const handleLinkDelete = useCallback((id: number) => {
      console.log("Link deleted:", id);
      toast.info("Dependency removed - save to persist");
    }, []);

    const handleZoomIn = () => {
      if (zoom === "month") setZoom("week");
      else if (zoom === "week") setZoom("day");
    };

    const handleZoomOut = () => {
      if (zoom === "day") setZoom("week");
      else if (zoom === "week") setZoom("month");
    };

    const handleFullscreen = () => {
      const element = document.querySelector('.gantt-container');
      if (element) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          element.requestFullscreen();
        }
      }
    };

    const exportToPDF = () => {
      toast.info("PDF export coming soon!");
      // Will implement custom PDF export
    };

    useImperativeHandle(ref, () => ({
      exportToPDF,
    }));

    return (
      <div className="h-[600px] w-full flex flex-col">
        <style>{`
          /* wx-react-gantt Custom Theme - High Contrast */
          .gantt-container {
            background: hsl(240 10% 7%);
            color: hsl(0 0% 98%);
            border: 1px solid hsl(240 3.7% 15.9%);
            border-radius: 8px;
            overflow: hidden;
          }
          
          /* Grid area (left side - task list) */
          .wx-grid {
            background: hsl(240 10% 7%);
            border-right: 2px solid hsl(240 3.7% 15.9%);
          }
          
          .wx-grid-header {
            background: hsl(263 70% 35%);
            color: white !important;
            font-weight: 600;
            border-bottom: 2px solid hsl(263 70% 50%);
          }
          
          .wx-grid-header-cell {
            color: white !important;
            border-right: 1px solid hsl(263 70% 50%);
          }
          
          .wx-grid-row {
            background: hsl(240 10% 7%);
            border-bottom: 1px solid hsl(240 3.7% 15.9%);
            color: hsl(0 0% 98%);
          }
          
          .wx-grid-row:hover {
            background: hsl(240 10% 12%);
          }
          
          .wx-grid-row.selected {
            background: hsl(263 70% 20% / 0.3);
          }
          
          .wx-grid-cell {
            color: hsl(0 0% 98%);
            border-right: 1px solid hsl(240 3.7% 15.9%);
          }
          
          /* Timeline area (right side - gantt chart) */
          .wx-timeline {
            background: hsl(240 10% 5%);
          }
          
          .wx-timeline-header {
            background: hsl(263 70% 35%);
            color: white !important;
            font-weight: 600;
            border-bottom: 2px solid hsl(263 70% 50%);
          }
          
          .wx-timeline-header-cell {
            color: white !important;
            border-right: 1px solid hsl(263 70% 50%);
          }
          
          .wx-timeline-row {
            border-bottom: 1px solid hsl(240 3.7% 15.9%);
          }
          
          /* Task bars */
          .wx-task-bar {
            background: linear-gradient(135deg, hsl(263 70% 45%) 0%, hsl(263 70% 55%) 100%);
            border: 1px solid hsl(263 70% 60%);
            border-radius: 4px;
            color: white;
          }
          
          .wx-task-bar:hover {
            background: linear-gradient(135deg, hsl(263 70% 50%) 0%, hsl(263 70% 60%) 100%);
            box-shadow: 0 2px 8px hsl(263 70% 50% / 0.4);
          }
          
          .wx-task-bar.completed {
            background: linear-gradient(135deg, hsl(142 76% 45%) 0%, hsl(142 76% 55%) 100%);
            border-color: hsl(142 76% 60%);
          }
          
          .wx-task-progress {
            background: hsl(263 70% 30%);
          }
          
          .wx-task-text {
            color: white !important;
            font-weight: 500;
          }
          
          /* Dependencies/Links */
          .wx-link-line {
            stroke: hsl(263 70% 50%);
            stroke-width: 2px;
          }
          
          .wx-link-arrow {
            fill: hsl(263 70% 50%);
          }
          
          /* Tooltips */
          .wx-tooltip {
            background: hsl(240 10% 10%);
            color: hsl(0 0% 98%);
            border: 1px solid hsl(263 70% 50%);
            border-radius: 6px;
            padding: 8px 12px;
            box-shadow: 0 4px 12px hsl(0 0% 0% / 0.5);
          }
          
          /* Scrollbars */
          .wx-scrollbar {
            background: hsl(240 10% 10%);
          }
          
          .wx-scrollbar-thumb {
            background: hsl(263 70% 40%);
            border-radius: 4px;
          }
          
          .wx-scrollbar-thumb:hover {
            background: hsl(263 70% 50%);
          }
        `}</style>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 bg-card border-b border-border">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom === "month"}
              className="gap-1"
            >
              <ZoomOut className="w-4 h-4" />
              Zoom Out
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom === "day"}
              className="gap-1"
            >
              <ZoomIn className="w-4 h-4" />
              Zoom In
            </Button>
            <div className="px-3 py-1 text-sm bg-muted rounded">
              {zoom.charAt(0).toUpperCase() + zoom.slice(1)} View
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="gap-1"
            >
              <Maximize2 className="w-4 h-4" />
              Fullscreen
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              className="gap-1"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 gantt-container">
          <Gantt
            ref={ganttRef}
            tasks={ganttData.data}
            links={ganttData.links}
            zoom={zoom}
            scales={[
              { unit: zoom === "day" ? "day" : zoom === "week" ? "week" : "month", step: 1, format: zoom === "day" ? "d MMM" : zoom === "week" ? "d MMM" : "MMM yyyy" }
            ]}
            columns={[
              { name: "text", label: "Task", width: 200, resize: true },
              { name: "start_date", label: "Start", width: 100, resize: true },
              { name: "duration", label: "Duration", width: 80, resize: true },
              { name: "progress", label: "Progress", width: 80, resize: true, template: (task: any) => `${Math.round(task.progress * 100)}%` },
            ]}
            onUpdate={(id: number, task: any) => handleTaskUpdate(id, task)}
            onAdd={(task: any) => handleTaskAdd(task)}
            onDelete={(id: number) => handleTaskDelete(id)}
            onLinkAdd={(link: any) => handleLinkAdd(link)}
            onLinkDelete={(id: number) => handleLinkDelete(id)}
          />
        </div>
      </div>
    );
  }
);

GanttView.displayName = "GanttView";
