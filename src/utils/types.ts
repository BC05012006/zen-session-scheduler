
export interface User {
  id: string;
  email: string;
  name?: string;
}

export type SessionStatus = 'completed' | 'pending' | 'in-progress';

export interface MeditationSession {
  id: string;
  title: string;
  duration: number; // in minutes
  date: string;
  time: string;
  status: SessionStatus;
  userId: string;
  notes?: string;
  elapsedTime?: number; // in seconds
}

export interface SessionMetrics {
  total: number;
  completed: number;
  pending: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  priority: TaskPriority;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
