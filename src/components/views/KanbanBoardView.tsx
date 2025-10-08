import { useState, useCallback } from "react";
import { Task } from "@/types/plan";
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
    // Group tasks by a pseudo-status based on category or ID range
    const groups: Record<KanbanStatus, Task[]> = {
      "Not Started": [],
      "In Progress": [],
      "Review": [],
      "Completed": [],
    };

    tasks.forEach((task) => {
      // Distribute tasks across columns based on ID for demo
      const mod = task.id % 4;
      if (mod === 0) groups["Not Started"].push(task);
      else if (mod === 1) groups["In Progress"].push(task);
      else if (mod === 2) groups["Review"].push(task);
      else groups["Completed"].push(task);
    });

    return groups;
  });

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
    console.log("Saving task:", taskId, titleDrafts[taskId]);
    onTaskUpdate?.(taskId, { title: titleDrafts[taskId] });
    setEditingId(null);
  };

  const handleCancel = (taskId: number) => {
    setEditingId(null);
    const { [taskId]: _, ...rest } = titleDrafts;
    setTitleDrafts(rest);
  };

  const onDragStart = useCallback((e: any) => {
    e.itemData = e.fromData[e.fromIndex];
  }, []);

  const onAdd = useCallback((e: any, toStatus: KanbanStatus) => {
    const newTasksByStatus = { ...tasksByStatus };
    const task = e.itemData;
    
    // Remove from old status
    Object.keys(newTasksByStatus).forEach((status) => {
      newTasksByStatus[status as KanbanStatus] = newTasksByStatus[status as KanbanStatus].filter(
        (t) => t.id !== task.id
      );
    });

    // Add to new status
    newTasksByStatus[toStatus].splice(e.toIndex, 0, task);
    setTasksByStatus(newTasksByStatus);
    
    console.log(`Task ${task.id} moved to ${toStatus}`);
  }, [tasksByStatus]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
      {statuses.map((status) => {
        const statusTasks = tasksByStatus[status];
        const totalHours = statusTasks.reduce((sum, t) => sum + t.estimated_duration_hours, 0);

        return (
          <div key={status} className="flex flex-col h-fit min-h-[400px]">
            <div className={cn("border-l-4 pl-4 mb-4", getStatusColor(status))}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm uppercase tracking-wide">{status}</h3>
                <Badge className={cn("text-xs", getStatusBadgeColor(status))}>
                  {statusTasks.length}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {totalHours}h total
              </p>
            </div>

            <Sortable
              className="space-y-3 flex-1"
              group="tasks"
              data={statusTasks}
              onDragStart={onDragStart}
              onAdd={(e) => onAdd(e, status)}
            >
              {statusTasks.map((task) => (
                <Card
                  key={task.id}
                  className={cn(
                    "p-4 border-l-2 cursor-move hover:shadow-elevated transition-all",
                    getCategoryColor(task.category)
                  )}
                >
                  <div className="flex items-start gap-2 mb-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div className="w-6 h-6 bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs flex-shrink-0 rounded">
                      {task.id}
                    </div>
                    {editingId === task.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={titleDrafts[task.id] || task.title}
                          onChange={(e) =>
                            setTitleDrafts({ ...titleDrafts, [task.id]: e.target.value })
                          }
                          className="h-7 text-sm"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleSave(task.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleCancel(task.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold break-words max-w-full">
                          {task.title}
                        </h4>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={() => handleEdit(task)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 break-words">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
  );
};
