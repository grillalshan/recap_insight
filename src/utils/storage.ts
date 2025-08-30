import { DailyLog, WeeklySummary, AppSettings } from '@/types';

const STORAGE_KEYS = {
  DAILY_LOGS: 'recap_daily_logs',
  WEEKLY_SUMMARIES: 'recap_weekly_summaries',
  SETTINGS: 'recap_settings',
} as const;

// Daily Logs Storage
export const saveDailyLog = (log: DailyLog): void => {
  const logs = getDailyLogs();
  const existingIndex = logs.findIndex(l => l.id === log.id);
  
  if (existingIndex >= 0) {
    logs[existingIndex] = { ...log, updatedAt: new Date().toISOString() };
  } else {
    logs.push(log);
  }
  
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
};

export const getDailyLogs = (): DailyLog[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
  return stored ? JSON.parse(stored) : [];
};

export const deleteDailyLog = (id: string): void => {
  const logs = getDailyLogs().filter(log => log.id !== id);
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
};

// Weekly Summaries Storage
export const saveWeeklySummary = (summary: WeeklySummary): void => {
  const summaries = getWeeklySummaries();
  const existingIndex = summaries.findIndex(s => s.weekStart === summary.weekStart);
  
  if (existingIndex >= 0) {
    summaries[existingIndex] = summary;
  } else {
    summaries.push(summary);
  }
  
  localStorage.setItem(STORAGE_KEYS.WEEKLY_SUMMARIES, JSON.stringify(summaries));
};

export const getWeeklySummaries = (): WeeklySummary[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.WEEKLY_SUMMARIES);
  return stored ? JSON.parse(stored) : [];
};

// Settings Storage
export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return stored ? JSON.parse(stored) : { openaiApiKey: '' };
};

// Utility functions
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const getWeekEnd = (date: Date): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getLogsForWeek = (date: Date): DailyLog[] => {
  const weekStart = getWeekStart(date);
  const weekEnd = getWeekEnd(date);
  const startStr = formatDate(weekStart);
  const endStr = formatDate(weekEnd);
  
  return getDailyLogs().filter(log => 
    log.date >= startStr && log.date <= endStr
  ).sort((a, b) => a.date.localeCompare(b.date));
};