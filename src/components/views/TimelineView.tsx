import { Task } from "@/types/plan";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Pencil, Save, X } from "lucide-react";
import { useState } from "react";

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
      Financial: "bg-emerald-500",
      "Content Development": "bg-indigo-500",
      Logistics: "bg-pink-500",
    };
    return colors[category] || "bg-violet-500";
  };

  const maxHours = Math.max(...tasks.map(t => t.estimated_duration_hours));

  const [editing, setEditing] = useState<Record<number, boolean>>({});
  const [titleDrafts, setTitleDrafts] = useState<Record<number, string>>({});

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
        <Card key={task.id} className="p-4 border-border hover:shadow-elevated transition-shadow card-animate overflow-hidden">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1">
              <div className="w-8 h-8 bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                {task.id}
              </div>
            </div>
            
            <div className="col-span-4 min-w-0">
              <div className="flex items-center gap-2">
                {editing[task.id] ? (
                  <input value={titleDrafts[task.id] ?? task.title} onChange={(e) => setTitleDrafts((s) => ({ ...s, [task.id]: e.target.value }))} className="w-full text-sm font-semibold p-1 rounded border border-border bg-background" />
                ) : (
                  <h3 className="text-sm font-semibold break-words">{titleDrafts[task.id] ?? task.title}</h3>
                )}
                <div className="ml-2 flex items-center gap-1 flex-shrink-0">
                  {editing[task.id] ? (
                    <>
                      <button onClick={() => setEditing((s) => ({ ...s, [task.id]: false }))} className="p-1 rounded text-muted-foreground hover:bg-primary/5"><Save className="w-4 h-4" /></button>
                      <button onClick={() => { setTitleDrafts((s) => ({ ...s, [task.id]: task.title })); setEditing((s) => ({ ...s, [task.id]: false })); }} className="p-1 rounded text-muted-foreground hover:bg-destructive/5"><X className="w-4 h-4" /></button>
                    </>
                  ) : (
                    <button onClick={() => { setEditing((s) => ({ ...s, [task.id]: true })); setTitleDrafts((s) => ({ ...s, [task.id]: task.title })); }} className="p-1 rounded text-muted-foreground hover:bg-primary/5"><Pencil className="w-4 h-4" /></button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <Badge className={cn("text-xs", getCategoryColor(task.category), "text-white border-0")}>
                {task.category}
              </Badge>
            </div>
            
            <div className="col-span-4">
              <div className="relative h-6 bg-secondary rounded-sm overflow-hidden">
                <div
                  className={cn("absolute h-full transition-all duration-300", getCategoryColor(task.category))}
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
