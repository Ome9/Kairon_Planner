import { motion } from "framer-motion";
import { Task } from "@/types/plan";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, GitBranch, ChevronDown, Pencil, Save, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ListViewProps {
  tasks: Task[];
}

export const ListView = ({ tasks }: ListViewProps) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [editing, setEditing] = useState<Record<number, boolean>>({});
  const [titleDrafts, setTitleDrafts] = useState<Record<number, string>>({});
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // dynamically import animejs if available and run a subtle entrance animation
    let mounted = true;
    (async () => {
      try {
        const anime = await import("animejs");
        if (!mounted || !listRef.current) return;
        anime.default({
          targets: listRef.current.querySelectorAll('.card-animate'),
          translateY: [6, 0],
          opacity: [0, 1],
          delay: (_el: Element, i: number) => i * 40,
          duration: 350,
          easing: 'easeOutCubic',
        });
      } catch (e) {
        // animejs not installed — ignore
      }
    })();
    return () => { mounted = false; };
  }, [tasks]);

  const toggleTask = (taskId: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Research: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Design: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Development: "bg-green-500/10 text-green-500 border-green-500/20",
      Marketing: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      Legal: "bg-red-500/10 text-red-500 border-red-500/20",
      Planning: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      Testing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      Financial: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      "Content Development": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
      Logistics: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    };
    return colors[category] || "bg-violet-500/10 text-violet-500 border-violet-500/20";
  };

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className="p-6 hover:shadow-elevated transition-all duration-200 cursor-pointer bg-card border-border card-animate overflow-hidden"
            onClick={() => toggleTask(task.id)}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {task.id}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {editing[task.id] ? (
                        <input
                          value={titleDrafts[task.id] ?? task.title}
                          onChange={(e) => setTitleDrafts((s) => ({ ...s, [task.id]: e.target.value }))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full text-base font-semibold p-1 rounded border border-border bg-background"
                        />
                      ) : (
                        <h3 className="text-base font-semibold break-words max-w-full">{titleDrafts[task.id] ?? task.title}</h3>
                      )}

                      <div className="ml-2 flex items-center gap-1 flex-shrink-0">
                        {editing[task.id] ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // apply draft locally (no persistence yet)
                                setEditing((s) => ({ ...s, [task.id]: false }));
                              }}
                              className="p-1 rounded text-muted-foreground hover:bg-primary/5"
                              aria-label="Save title"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTitleDrafts((s) => ({ ...s, [task.id]: task.title }));
                                setEditing((s) => ({ ...s, [task.id]: false }));
                              }}
                              className="p-1 rounded text-muted-foreground hover:bg-destructive/5"
                              aria-label="Cancel edit"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditing((s) => ({ ...s, [task.id]: true }));
                              setTitleDrafts((s) => ({ ...s, [task.id]: task.title }));
                            }}
                            className="p-1 rounded text-muted-foreground hover:bg-primary/5"
                            aria-label="Edit title"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={cn("text-xs border", getCategoryColor(task.category))}>
                        {task.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimated_duration_hours}h</span>
                      </div>
                      {task.dependencies.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-blue-500">
                          <GitBranch className="w-3 h-3" />
                          <span>Depends on: {task.dependencies.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0",
                      expandedTasks.has(task.id) && "rotate-180"
                    )}
                  />
                </div>

                {expandedTasks.has(task.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pt-3 border-t border-border"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed break-words max-w-full">
                      {task.description}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
