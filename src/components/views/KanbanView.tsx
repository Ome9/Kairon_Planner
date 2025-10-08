import { useState, useCallback } from "react";
import { Task, TaskStatus } from "@/types/plan";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Clock, GitBranch, Pencil, Check, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useToast } from "@/hooks/use-toast";

interface KanbanViewProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: number, updates: Partial<Task>) => void;
  onTaskAdd?: (task: Partial<Task>) => void;
}

export const KanbanView = ({ tasks, onTaskUpdate, onTaskAdd }: KanbanViewProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [titleDrafts, setTitleDrafts] = useState<Record<number, string>>({});
  const { toast } = useToast();

  // Ensure all tasks have a status (default to Backlog)
  const tasksWithStatus = tasks.map(task => ({
    ...task,
    status: task.status || TaskStatus.BACKLOG,
  }));

  // Status columns configuration
  const statusColumns = [
    { id: TaskStatus.BACKLOG, title: "Backlog", color: "border-gray-500" },
    { id: TaskStatus.TODO, title: "To Do", color: "border-blue-500" },
    { id: TaskStatus.IN_PROGRESS, title: "In Progress", color: "border-purple-500" },
    { id: TaskStatus.IN_REVIEW, title: "In Review", color: "border-orange-500" },
    { id: TaskStatus.DONE, title: "Done", color: "border-green-500" },
  ];

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

  // Drag and drop handler
  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as TaskStatus;

    // Update task status
    if (onTaskUpdate) {
      const updates: Partial<Task> = {
        status: newStatus,
        // Auto-complete when moved to Done
        completed: newStatus === TaskStatus.DONE,
      };
      
      onTaskUpdate(taskId, updates);
      
      toast({
        title: "Task Status Updated",
        description: `Task moved to ${newStatus}`,
      });
    }
  }, [onTaskUpdate, toast]);

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setTitleDrafts({ ...titleDrafts, [task.id]: task.title });
  };

  const handleSave = (taskId: number) => {
    const newTitle = titleDrafts[taskId];
    if (onTaskUpdate && newTitle) {
      onTaskUpdate(taskId, { title: newTitle });
      toast({
        title: "Task Updated",
        description: "Task title updated successfully",
      });
    }
    setEditingId(null);
  };

  const handleCancel = (taskId: number) => {
    setEditingId(null);
    const { [taskId]: _, ...rest } = titleDrafts;
    setTitleDrafts(rest);
  };

  const handleAddTask = (status: TaskStatus) => {
    if (onTaskAdd) {
      const newTask: Partial<Task> = {
        title: "New Task",
        description: "",
        category: "General",
        estimated_duration_hours: 1,
        dependencies: [],
        completed: false,
        status: status,
      };
      onTaskAdd(newTask);
      toast({
        title: "Task Added",
        description: `New task added to ${status}`,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
        {statusColumns.map((column, columnIndex) => {
          const columnTasks = tasksWithStatus.filter(t => t.status === column.id);
          const totalHours = columnTasks.reduce((sum, t) => sum + t.estimated_duration_hours, 0);

          return (
            <div
              key={column.id}
              className={cn(
                "flex-shrink-0 w-80 flex flex-col bg-card/30 rounded-lg",
                columnIndex > 0 && "border-l border-border/30"
              )}
            >
              {/* Column Header */}
              <div className={cn("border-l-4 pl-4 py-3 mb-3 rounded-t-lg bg-card/50", column.color)}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm uppercase tracking-wide">{column.title}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => handleAddTask(column.id)}
                    title="Add Task"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {columnTasks.length} tasks Β· {totalHours}h
                </p>
              </div>

              {/* Droppable Column */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 px-3 space-y-3 min-h-[400px] transition-colors rounded-b-lg",
                      snapshot.isDraggingOver && "bg-primary/5"
                    )}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "p-4 border-border cursor-grab active:cursor-grabbing",
                              "hover:shadow-lg transition-all",
                              "bg-card",
                              snapshot.isDragging && "shadow-2xl ring-2 ring-primary/50 rotate-2"
                            )}
                          >
                            {/* Task Header */}
                            <div className="flex items-start gap-3 mb-3">
                              {/* Task ID Badge */}
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xs rounded flex-shrink-0">
                                {task.id}
                              </div>

                              {/* Title Edit/Display */}
                              {editingId === task.id ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <Input
                                    value={titleDrafts[task.id] || task.title}
                                    onChange={(e) =>
                                      setTitleDrafts({ ...titleDrafts, [task.id]: e.target.value })
                                    }
                                    className="h-7 text-sm"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleSave(task.id);
                                      if (e.key === "Escape") handleCancel(task.id);
                                    }}
                                  />
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => handleSave(task.id)}
                                  >
                                    <Check className="h-3 w-3 text-green-500" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => handleCancel(task.id)}
                                  >
                                    <X className="h-3 w-3 text-red-500" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex-1 flex items-start justify-between gap-2">
                                  <h4 className="text-sm font-semibold break-words max-w-full leading-tight">
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

                            {/* Category Badge */}
                            <div className={cn("border-l-2 pl-2 mb-3", getCategoryColor(task.category))}>
                              <Badge variant="secondary" className="text-xs">
                                {task.category}
                              </Badge>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2 break-words">
                              {task.description}
                            </p>

                            {/* Task Metadata */}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/50">
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
                              {task.completed && (
                                <div className="ml-auto">
                                  <Badge variant="default" className="bg-green-500 text-xs">
                                    <Check className="w-3 h-3 mr-1" />
                                    Done
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Empty State */}
                    {columnTasks.length === 0 && (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed border-border/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Drop tasks here</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
