import { useMemo } from "react";
import { Task } from "@/types/plan";
import Scheduler, { View } from "devextreme-react/scheduler";

interface SchedulerViewProps {
  tasks: Task[];
}

export const SchedulerView = ({ tasks }: SchedulerViewProps) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Research: "#3b82f6",
      Design: "#a855f7",
      Development: "#22c55e",
      Marketing: "#f97316",
      Legal: "#ef4444",
      Planning: "#06b6d4",
      Testing: "#eab308",
      Financial: "#10b981",
      "Content Development": "#6366f1",
      Logistics: "#ec4899",
    };
    return colors[category] || "#6b7280";
  };

  // Transform tasks into scheduler appointments
  const appointments = useMemo(() => {
    return tasks.map((task, index) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + index); // Each task starts on a different day
      startDate.setHours(9, 0, 0, 0); // Start at 9 AM

      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + Math.min(task.estimated_duration_hours, 8)); // Max 8 hours per day

      return {
        text: task.title,
        description: task.description,
        startDate,
        endDate,
        allDay: task.estimated_duration_hours >= 8,
      };
    });
  }, [tasks]);

  return (
    <div className="h-[700px] w-full">
      <style>{`
        /* DevExtreme Scheduler Custom Theme - High Contrast */
        .dx-scheduler {
          background: hsl(240 10% 7%);
          color: hsl(0 0% 98%) !important;
        }
        .dx-scheduler-header {
          background: hsl(263 70% 35%);
          color: white !important;
          font-weight: 600;
          border-bottom: 2px solid hsl(263 70% 50%);
        }
        .dx-scheduler-header-panel {
          background: hsl(263 70% 35%);
          color: white !important;
        }
        .dx-scheduler-header-panel-cell {
          background: hsl(240 10% 12%);
          border: 1px solid hsl(240 3.7% 20%);
          color: hsl(0 0% 98%) !important;
        }
        .dx-scheduler-header-panel-current-time-cell {
          color: hsl(263 70% 60%) !important;
        }
        .dx-scheduler-date-table-cell {
          background: hsl(240 10% 7%);
          border: 1px solid hsl(240 3.7% 15.9%);
          color: hsl(0 0% 70%) !important;
        }
        .dx-scheduler-date-table-cell:hover {
          background: hsl(240 10% 12%);
        }
        .dx-scheduler-date-table-other-month-date-cell {
          color: hsl(0 0% 40%) !important;
        }
        .dx-scheduler-appointment {
          background: hsl(263 70% 45%);
          border-color: hsl(263 70% 50%);
          color: white !important;
        }
        .dx-scheduler-appointment:hover {
          background: hsl(263 70% 55%);
        }
        .dx-scheduler-appointment-title {
          color: white !important;
        }
        .dx-scheduler-appointment-content {
          color: white !important;
        }
        .dx-scheduler-time-panel-cell {
          background: hsl(240 10% 12%);
          border: 1px solid hsl(240 3.7% 20%);
          color: hsl(0 0% 85%) !important;
        }
        .dx-scheduler-navigator {
          background: hsl(240 10% 7%);
          color: hsl(0 0% 98%) !important;
        }
        .dx-scheduler-navigator-caption {
          color: hsl(0 0% 98%) !important;
        }
        .dx-toolbar {
          background: hsl(240 10% 7%);
          border-bottom: 1px solid hsl(240 3.7% 15.9%);
        }
        .dx-toolbar .dx-button {
          background: hsl(240 10% 15%);
          color: hsl(0 0% 98%) !important;
          border: 1px solid hsl(240 3.7% 25%);
        }
        .dx-toolbar .dx-button:hover {
          background: hsl(263 70% 25%);
          border-color: hsl(263 70% 40%);
        }
        .dx-toolbar .dx-button.dx-state-active {
          background: hsl(263 70% 45%);
          color: white !important;
        }
        .dx-button-text,
        .dx-icon {
          color: hsl(0 0% 98%) !important;
        }
        .dx-scheduler-work-space-month .dx-scheduler-date-table-cell-text {
          color: hsl(0 0% 98%) !important;
        }
        .dx-scheduler-agenda-date {
          color: hsl(263 70% 60%) !important;
        }
      `}</style>
      <Scheduler
        dataSource={appointments}
        defaultCurrentView="week"
        defaultCurrentDate={new Date()}
        height="100%"
        startDayHour={8}
        endDayHour={20}
        showAllDayPanel={true}
        textExpr="text"
        startDateExpr="startDate"
        endDateExpr="endDate"
        allDayExpr="allDay"
      >
        <View type="day" />
        <View type="week" />
        <View type="workWeek" />
        <View type="month" />
        <View type="agenda" />
      </Scheduler>
    </div>
  );
};
