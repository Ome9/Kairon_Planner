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
}

export interface ProjectPlan {
  projectName: string;
  projectSummary: string;
  tasks: Task[];
}
