export type TaskPriority = "low" | "medium" | "high";

export type TaskCategory = "code" | "study" | "rest";

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
}
