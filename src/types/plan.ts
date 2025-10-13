export enum TaskStatus {
  BACKLOG = "Backlog",
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  IN_REVIEW = "In Review",
  DONE = "Done",
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  estimated_duration_hours: number;
  dependencies: number[];
  completed?: boolean;
  status?: TaskStatus; // Kanban status column
  start_date?: string;
  end_date?: string;
  due_date?: string; // Scheduled due date
  scheduled_start?: string; // Auto-scheduled start time
  scheduled_end?: string; // Auto-scheduled end time
  actual_start?: string; // When task actually started
  actual_end?: string; // When task actually completed
  progress?: number;
  assignee?: string;
  priority?: string;
  order?: number; // Position in the overall task list
  kanban_column?: string; // Which Kanban column the task is in
  kanban_position?: number; // Position within the Kanban column
  cover_image?: string; // Topic-themed cover image URL
  tags?: string[]; // Smart tags for categorization
  estimated_complexity?: 'Low' | 'Medium' | 'High'; // Smart complexity estimation
  subtasks?: string[]; // Subtask checklist
  is_milestone?: boolean; // Mark as milestone
  blocked_by?: number[]; // Tasks blocking this one
  blocking?: number[]; // Tasks this one is blocking
  slack_time?: number; // Buffer time in hours
  is_critical_path?: boolean; // Part of critical path
}

export interface ProjectPlan {
  projectName: string;
  projectSummary: string;
  tasks: Task[];
  project_start_date?: string;
  project_end_date?: string;
  working_hours?: {
    start: string;
    end: string;
    hours_per_day: number;
  };
  working_days?: number[];
  schedule_settings?: {
    auto_schedule_enabled: boolean;
    last_scheduled_at?: Date;
    schedule_from?: 'now' | 'project_start';
    respect_dependencies: boolean;
    respect_working_hours: boolean;
  };
}
