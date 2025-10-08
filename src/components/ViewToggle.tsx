import { LayoutList, Calendar, BarChart3, Kanban } from "lucide-react";
import { Button } from "./ui/button";

export type ViewType = "list" | "timeline" | "kanban" | "analytics";

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  const views = [
    { type: "list" as ViewType, icon: LayoutList, label: "List" },
    { type: "timeline" as ViewType, icon: Calendar, label: "Timeline" },
    { type: "kanban" as ViewType, icon: Kanban, label: "Board" },
    { type: "analytics" as ViewType, icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="inline-flex border border-border bg-card">
      {views.map((view) => (
        <Button
          key={view.type}
          variant={currentView === view.type ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(view.type)}
          className={currentView === view.type ? "bg-primary text-primary-foreground" : ""}
        >
          <view.icon className="w-4 h-4 mr-2" />
          {view.label}
        </Button>
      ))}
    </div>
  );
};
