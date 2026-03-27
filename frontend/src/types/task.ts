export type TaskStatus = "todo" | "in_progress" | "completed" | "blocked";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  reminderTime?: string;
  reminderOffsetMinutes?: number;
  tags: string[];
  position: number;
  assignedUser?: string;
};
