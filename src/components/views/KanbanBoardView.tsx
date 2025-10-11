import { useState, useCallback, useEffect } from "react";
import { Task, TaskStatus } from "@/types/plan";
import Sortable from "devextreme-react/sortable";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Clock, GitBranch, Pencil, Check, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanBoardViewProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: number, updates: Partial<Task>) => void;
}

type KanbanStatus = "Not Started" | "In Progress" | "Review" | "Completed";

export const KanbanBoardView = ({ tasks, onTaskUpdate }: KanbanBoardViewProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [titleDrafts, setTitleDrafts] = useState<Record<number, string>>({});
  const [tasksByStatus, setTasksByStatus] = useState<Record<KanbanStatus, Task[]>>(() => {
    // Group tasks by their actual status field
    const groups: Record<KanbanStatus, Task[]> = {
      "Not Started": [],
      "In Progress": [],
      "Review": [],
      "Completed": [],
    };

    tasks.forEach((task) => {
      // Map task status to Kanban columns
      const status = task.status;
      if (!status || status === TaskStatus.BACKLOG || status === TaskStatus.TODO) {
        groups["Not Started"].push(task);
      } else if (status === TaskStatus.IN_PROGRESS) {
        groups["In Progress"].push(task);
      } else if (status === TaskStatus.IN_REVIEW) {
        groups["Review"].push(task);
      } else if (status === TaskStatus.DONE) {
        groups["Completed"].push(task);
      } else {
        // Fallback: distribute by ID if status doesn't match
        const mod = task.id % 4;
        if (mod === 0) groups["Not Started"].push(task);
        else if (mod === 1) groups["In Progress"].push(task);
        else if (mod === 2) groups["Review"].push(task);
        else groups["Completed"].push(task);
      }
    });

    return groups;
  });

  // Re-group tasks when tasks prop changes (e.g., when loading a saved plan)
  useEffect(() => {
    const groups: Record<KanbanStatus, Task[]> = {
      "Not Started": [],
      "In Progress": [],
      "Review": [],
      "Completed": [],
    };

    tasks.forEach((task) => {
      const status = task.status;
      if (!status || status === TaskStatus.BACKLOG || status === TaskStatus.TODO) {
        groups["Not Started"].push(task);
      } else if (status === TaskStatus.IN_PROGRESS) {
        groups["In Progress"].push(task);
      } else if (status === TaskStatus.IN_REVIEW) {
        groups["Review"].push(task);
      } else if (status === TaskStatus.DONE) {
        groups["Completed"].push(task);
      } else {
        const mod = task.id % 4;
        if (mod === 0) groups["Not Started"].push(task);
        else if (mod === 1) groups["In Progress"].push(task);
        else if (mod === 2) groups["Review"].push(task);
        else groups["Completed"].push(task);
      }
    });

    setTasksByStatus(groups);
  }, [tasks]);


  const statuses: KanbanStatus[] = ["Not Started", "In Progress", "Review", "Completed"];

  const getStatusColor = (status: KanbanStatus) => {
    const colors: Record<KanbanStatus, string> = {
      "Not Started": "border-gray-500",
      "In Progress": "border-blue-500",
      "Review": "border-yellow-500",
      "Completed": "border-green-500",
    };
    return colors[status];
  };

  const getStatusBadgeColor = (status: KanbanStatus) => {
    const colors: Record<KanbanStatus, string> = {
      "Not Started": "bg-gray-500/10 text-gray-500",
      "In Progress": "bg-blue-500/10 text-blue-500",
      "Review": "bg-yellow-500/10 text-yellow-500",
      "Completed": "bg-green-500/10 text-green-500",
    };
    return colors[status];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Research: "border-blue-500",
      Design: "border-purple-500",
      Development: "border-green-500",
      Marketing: "border-orange-500",
      Legal: "border-red-500",
      Planning: "border-cyan-500",
      Testing: "border-yellow-500",
      Financial: "border-emerald-500",
      "Content Development": "border-indigo-500",
      Logistics: "border-pink-500",
    };
    return colors[category] || "border-muted";
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setTitleDrafts({ ...titleDrafts, [task.id]: task.title });
  };

  const handleSave = (taskId: number) => {
    const newTitle = titleDrafts[taskId];
    console.log("Saving task:", taskId, newTitle);
    
    // Update local state immediately
    setTasksByStatus((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((status) => {
        newState[status as KanbanStatus] = newState[status as KanbanStatus].map((task) =>
          task.id === taskId ? { ...task, title: newTitle } : task
        );
      });
      return newState;
    });
    
    // Notify parent
    onTaskUpdate?.(taskId, { title: newTitle });
    setEditingId(null);
  };

  const handleCancel = (taskId: number) => {
    setEditingId(null);
    const { [taskId]: _, ...rest } = titleDrafts;
    setTitleDrafts(rest);
  };

  interface DragEvent {
    fromData?: Task[];
    fromIndex?: number;
    itemData?: Task;
  }

  interface AddEvent {
    itemData?: Task;
    toIndex?: number;
  }

  const onDragStart = useCallback((e: DragEvent) => {
    if (e.fromData && typeof e.fromIndex === 'number') {
      e.itemData = e.fromData[e.fromIndex];
    }
  }, []);

  const onAdd = useCallback((e: AddEvent, toStatus: KanbanStatus) => {
    const newTasksByStatus = { ...tasksByStatus };
    const task = e.itemData;
    
    if (!task) return;
    
    // Remove from old status
    Object.keys(newTasksByStatus).forEach((status) => {
      newTasksByStatus[status as KanbanStatus] = newTasksByStatus[status as KanbanStatus].filter(
        (t) => t.id !== task.id
      );
    });

    // Add to new status
    newTasksByStatus[toStatus].splice(e.toIndex ?? 0, 0, task);
    setTasksByStatus(newTasksByStatus);
    
    console.log(`Task ${task.id} moved to ${toStatus}`);
    
    // Update the task status and notify parent component
    if (onTaskUpdate) {
      const statusMap: Record<KanbanStatus, TaskStatus> = {
        "Not Started": TaskStatus.BACKLOG,
        "In Progress": TaskStatus.IN_PROGRESS,
        "Review": TaskStatus.IN_REVIEW,
        "Completed": TaskStatus.DONE,
      };
      
      onTaskUpdate(task.id, { 
        status: statusMap[toStatus]
      });
    }
  }, [tasksByStatus, onTaskUpdate]);

  return (
    <div className="w-full space-y-2">
      {/* Top Scrollbar - Synced with main content */}
      <div className="w-full overflow-x-auto overflow-y-hidden" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'hsl(var(--primary)) hsl(var(--muted))'
      }} onScroll={(e) => {
        const mainScroll = e.currentTarget.nextElementSibling as HTMLElement;
        if (mainScroll) mainScroll.scrollLeft = e.currentTarget.scrollLeft;
      }}>
        <div className="min-w-[900px] h-3 bg-muted/30 rounded-full">
          <div className="h-full bg-primary/20 rounded-full" style={{ width: "100%" }} />
        </div>
      </div>
      
      {/* Main Kanban Board */}
      <div className="w-full overflow-x-auto pb-2" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'hsl(var(--primary)) hsl(var(--muted))'
      }} onScroll={(e) => {
        const topScroll = e.currentTarget.previousElementSibling as HTMLElement;
        const bottomScroll = e.currentTarget.nextElementSibling as HTMLElement;
        if (topScroll) topScroll.scrollLeft = e.currentTarget.scrollLeft;
        if (bottomScroll) bottomScroll.scrollLeft = e.currentTarget.scrollLeft;
      }}>
        <div className="grid grid-cols-4 gap-2 min-w-[900px] auto-rows-max">
          {statuses.map((status) => {
            const statusTasks = tasksByStatus[status];
            const totalHours = statusTasks.reduce((sum, t) => sum + t.estimated_duration_hours, 0);

        return (
          <div key={status} className="flex flex-col h-fit min-h-[400px]">
            <div className={cn("border-l-4 pl-3 mb-3", getStatusColor(status))}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-xs uppercase tracking-wide">{status}</h3>
                <Badge className={cn("text-xs", getStatusBadgeColor(status))}>
                  {statusTasks.length}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {totalHours}h total
              </p>
            </div>

            <Sortable
              className="space-y-2 flex-1"
              group="tasks"
              data={statusTasks}
              onDragStart={onDragStart}
              onAdd={(e) => onAdd(e, status)}
            >
              {statusTasks.map((task) => (
                <Card
                  key={task.id}
                  className={cn(
                    "p-3 border-l-2 cursor-move hover:shadow-elevated transition-all",
                    getCategoryColor(task.category)
                  )}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <GripVertical className="w-3 h-3 text-muted-foreground mt-1 flex-shrink-0" />
                    <div className="w-5 h-5 bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-[10px] flex-shrink-0 rounded">
                      {task.id}
                    </div>
                    {editingId === task.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={titleDrafts[task.id] || task.title}
                          onChange={(e) =>
                            setTitleDrafts({ ...titleDrafts, [task.id]: e.target.value })
                          }
                          className="h-6 text-xs"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5"
                          onClick={() => handleSave(task.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5"
                          onClick={() => handleCancel(task.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold break-words max-w-full leading-tight">
                          {task.title}
                        </h4>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 flex-shrink-0"
                          onClick={() => handleEdit(task)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2 break-words leading-tight">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      {task.category}
                    </Badge>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimated_duration_hours}h</span>
                      </div>
                      {task.dependencies.length > 0 && (
                        <div className="flex items-center gap-1 text-blue-500">
                          <GitBranch className="w-3 h-3" />
                          <span>{task.dependencies.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </Sortable>
          </div>
        );
      })}
        </div>
      </div>
      
      {/* Bottom Scrollbar - Synced with main content */}
      <div className="w-full overflow-x-auto overflow-y-hidden" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'hsl(var(--primary)) hsl(var(--muted))'
      }} onScroll={(e) => {
        const mainScroll = e.currentTarget.previousElementSibling as HTMLElement;
        if (mainScroll) mainScroll.scrollLeft = e.currentTarget.scrollLeft;
      }}>
        <div className="min-w-[900px] h-3 bg-muted/30 rounded-full">
          <div className="h-full bg-primary/20 rounded-full" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
};
