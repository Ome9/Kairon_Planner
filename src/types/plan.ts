export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  estimated_duration_hours: number;
  dependencies: number[];
  completed?: boolean;
}

export interface ProjectPlan {
  projectName: string;
  projectSummary: string;
  tasks: Task[];
}
