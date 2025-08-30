export interface DailyLog {
  id: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  summary: string;
  generatedAt: string;
}

export interface AppSettings {
  openaiApiKey: string;
}