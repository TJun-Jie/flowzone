interface DailyMetrics {
  id: number;
  date: Date;
  ratingOfDay: RatingOfDay;
  wins: string[];
  losses: string[];
  weight: number; // Assuming weight in kilograms for simplicity. Adjust the type as needed (e.g., string) if storing units.
  stressLevel: number; // Assuming a scale of 1-10 for simplicity.
  actionItemsCompleted: number; // This could represent a count, or could be replaced/extended with a relational link to specific action items.
  sleepHours: number;
}

interface wins {
  id: string;
  dailyMetricId: string;
  userId: string;
  win: string;
}

interface losses {
  id: string;
  dailyMetricId: string;
  userId: string;
  loses: string;
}

export enum RatingOfDay {
  Bad = "bad",
  Average = "average",
  Good = "good",
}

enum ActionItemPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

enum ActionItemStatus {
  Pending = "pending",
  InProgress = "inProgress",
  Completed = "completed",
}

interface ActionItem {
  name: string;
  priority: ActionItemPriority;
  dueDate: Date;
  status: ActionItemStatus;
  isDone: boolean;
  projects: string[]; // Assuming projects is an array of project names or identifiers
}
