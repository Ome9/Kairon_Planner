import { Task } from "@/types/plan";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Calendar, 
  GitBranch, 
  FileText, 
  MessageSquare, 
  Activity,
  Save,
  X,
  Paperclip,
} from "lucide-react";
import { useState } from "react";

interface TaskDetailsModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (taskId: number, updates: Partial<Task>) => void;
}

export const TaskDetailsModal = ({
  task,
  open,
  onOpenChange,
  onSave,
}: TaskDetailsModalProps) => {
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  if (!task) return null;

  const handleSave = () => {
    onSave?.(task.id, editedTask);
    onOpenChange(false);
    setEditedTask({});
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getCategoryColor(task.category)}>
                  {task.category}
                </Badge>
                <Badge variant="outline">Task #{task.id}</Badge>
              </div>
              <DialogTitle className="text-2xl">{task.title}</DialogTitle>
              <DialogDescription className="mt-2">
                {task.description}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="details" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">
                <FileText className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="activities">
                <Activity className="w-4 h-4 mr-2" />
                Activities
              </TabsTrigger>
              <TabsTrigger value="notes">
                <Paperclip className="w-4 h-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="w-4 h-4 mr-2" />
                Comments
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4">
              <TabsContent value="details" className="space-y-4 m-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      defaultValue={task.title}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-category">Category</Label>
                    <Input
                      id="task-category"
                      defaultValue={task.category}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, category: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    defaultValue={task.description}
                    rows={4}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Duration:</span>
                      <span>{task.estimated_duration_hours} hours</span>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <GitBranch className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Dependencies:</span>
                      <span>
                        {task.dependencies.length > 0
                          ? task.dependencies.join(", ")
                          : "None"}
                      </span>
                    </div>
                  </Card>
                </div>

                {task.dependencies.length > 0 && (
                  <div className="space-y-2">
                    <Label>Blocked By</Label>
                    <div className="flex flex-wrap gap-2">
                      {task.dependencies.map((dep) => (
                        <Badge key={dep} variant="outline">
                          Task #{dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activities" className="m-0">
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Task Created</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Task was created and assigned to project
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No recent activities
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="m-0">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add notes about this task..."
                    rows={6}
                  />
                  <Button>
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach Files
                  </Button>
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No notes yet
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="m-0">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write a comment..."
                    rows={3}
                  />
                  <Button>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No comments yet
                  </p>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
