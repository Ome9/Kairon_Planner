import { Task } from "@/types/plan";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
  tasks: Task[];
}

export const TimelineView = ({ tasks }: TimelineViewProps) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Research: "bg-blue-500",
      Design: "bg-purple-500",
      Development: "bg-green-500",
      Marketing: "bg-orange-500",
      Legal: "bg-red-500",
      Planning: "bg-cyan-500",
      Testing: "bg-yellow-500",
    };
    return colors[category] || "bg-muted";
  };

  const maxHours = Math.max(...tasks.map(t => t.estimated_duration_hours));

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-4 px-4 pb-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        <div className="col-span-1">ID</div>
        <div className="col-span-4">Task</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-4">Timeline</div>
        <div className="col-span-1 text-right">Hours</div>
      </div>
      
      {tasks.map((task) => (
        <Card key={task.id} className="p-4 border-border hover:shadow-elevated transition-shadow">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1">
              <div className="w-8 h-8 bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                {task.id}
              </div>
            </div>
            
            <div className="col-span-4">
              <h3 className="text-sm font-semibold">{task.title}</h3>
            </div>
            
            <div className="col-span-2">
              <Badge className={cn("text-xs", getCategoryColor(task.category), "text-white border-0")}>
                {task.category}
              </Badge>
            </div>
            
            <div className="col-span-4">
              <div className="relative h-6 bg-secondary">
                <div
                  className={cn("absolute h-full", getCategoryColor(task.category))}
                  style={{ width: `${(task.estimated_duration_hours / maxHours) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="col-span-1 text-right text-sm font-semibold">
              {task.estimated_duration_hours}h
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
