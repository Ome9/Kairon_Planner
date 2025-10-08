import { Task } from "@/types/plan";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanViewProps {
  tasks: Task[];
}

export const KanbanView = ({ tasks }: KanbanViewProps) => {
  const categories = Array.from(new Set(tasks.map(t => t.category)));

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Research: "border-blue-500",
      Design: "border-purple-500",
      Development: "border-green-500",
      Marketing: "border-orange-500",
      Legal: "border-red-500",
      Planning: "border-cyan-500",
      Testing: "border-yellow-500",
    };
    return colors[category] || "border-muted";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((category) => {
        const categoryTasks = tasks.filter(t => t.category === category);
        const totalHours = categoryTasks.reduce((sum, t) => sum + t.estimated_duration_hours, 0);
        
        return (
          <div key={category} className="flex flex-col">
            <div className={cn("border-l-4 pl-4 mb-4", getCategoryColor(category))}>
              <h3 className="font-bold text-sm uppercase tracking-wide mb-1">{category}</h3>
              <p className="text-xs text-muted-foreground">{categoryTasks.length} tasks · {totalHours}h</p>
            </div>
            
            <div className="space-y-3 flex-1">
              {categoryTasks.map((task) => (
                <Card key={task.id} className="p-4 border-border hover:shadow-elevated transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-6 h-6 bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs flex-shrink-0">
                      {task.id}
                    </div>
                    <h4 className="text-sm font-semibold flex-1">{task.title}</h4>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {task.description}
                  </p>
                  
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
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
