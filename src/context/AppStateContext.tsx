/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Snippet } from '../types/snippet';
import type { Task } from '../types/task';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

const TASKS_KEY = 'devpulse-tasks';
const SNIPPETS_KEY = 'devpulse-snippets';

const initialTasks: Task[] = [
  { id: 1, title: 'Finish DevPulse layout', priority: 'high', category: 'code', completed: false },
  { id: 2, title: 'Study advanced TypeScript types', priority: 'medium', category: 'study', completed: false },
  { id: 3, title: 'Take a short reset break', priority: 'low', category: 'rest', completed: true },
];

const initialSnippets: Snippet[] = [
  {
    id: 1,
    title: 'Debounced input hook',
    language: 'typescript',
    code: 'const [value, setValue] = useState("");\nuseEffect(() => {\n  const id = setTimeout(() => onChange(value), 300);\n  return () => clearTimeout(id);\n}, [value]);',
    tags: ['react', 'hooks'],
  },
  {
    id: 2,
    title: 'Fetch with error handling',
    language: 'javascript',
    code: 'async function fetchJson(url) {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json();\n}',
    tags: ['api', 'fetch'],
  },
];

const isTask = (value: unknown): value is Task => {
  if (!value || typeof value !== 'object') return false;
  const task = value as Partial<Task>;
  return typeof task.id === 'number'
    && typeof task.title === 'string'
    && (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high')
    && (task.category === 'code' || task.category === 'study' || task.category === 'rest')
    && typeof task.completed === 'boolean';
};

const isSnippet = (value: unknown): value is Snippet => {
  if (!value || typeof value !== 'object') return false;
  const snippet = value as Partial<Snippet>;
  return typeof snippet.id === 'number'
    && typeof snippet.title === 'string'
    && (snippet.language === 'typescript' || snippet.language === 'javascript' || snippet.language === 'python'
      || snippet.language === 'go' || snippet.language === 'java' || snippet.language === 'css'
      || snippet.language === 'html' || snippet.language === 'other')
    && typeof snippet.code === 'string'
    && Array.isArray(snippet.tags)
    && snippet.tags.every((tag) => typeof tag === 'string');
};

const isTimerSnapshot = (value: unknown): value is TimerSnapshot => {
  if (!value || typeof value !== 'object') return false;
  const timer = value as Partial<TimerSnapshot>;
  return (timer.mode === 'focus' || timer.mode === 'break')
    && typeof timer.remainingSeconds === 'number'
    && typeof timer.totalSeconds === 'number'
    && typeof timer.isRunning === 'boolean'
    && (timer.startedAt === undefined || typeof timer.startedAt === 'number');
};

export interface TimerSnapshot {
  mode: 'focus' | 'break';
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  startedAt?: number;
}

interface AppState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  snippets: Snippet[];
  setSnippets: (snippets: Snippet[]) => void;
  timerSnapshot: TimerSnapshot;
  setTimerSnapshot: (snapshot: TimerSnapshot) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState(() => {
    const stored = loadFromStorage<unknown>(TASKS_KEY, null);
    return Array.isArray(stored) && stored.every(isTask) ? stored : initialTasks;
  });
  const [snippets, setSnippets] = useState(() => {
    const stored = loadFromStorage<unknown>(SNIPPETS_KEY, null);
    return Array.isArray(stored) && stored.every(isSnippet) ? stored : initialSnippets;
  });
  const [timerSnapshot, setTimerSnapshot] = useState<TimerSnapshot>(() => {
    const fallback: TimerSnapshot = { mode: 'focus', remainingSeconds: 25 * 60, totalSeconds: 25 * 60, isRunning: false };
    const stored = loadFromStorage<unknown>('devpulse-timer', null);
    return isTimerSnapshot(stored) ? stored : fallback;
  });

  useEffect(() => saveToStorage(TASKS_KEY, tasks), [tasks]);
  useEffect(() => saveToStorage(SNIPPETS_KEY, snippets), [snippets]);
  useEffect(() => saveToStorage('devpulse-timer', timerSnapshot), [timerSnapshot]);

  return (
    <AppStateContext.Provider value={{ tasks, setTasks, snippets, setSnippets, timerSnapshot, setTimerSnapshot }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
};
