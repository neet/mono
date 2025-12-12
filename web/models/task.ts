export type TaskStatus = "pending" | "completed" | "canceled";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  deadline_on: string | null;
}
