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

export interface TimerSnapshot {
  mode: 'focus' | 'break';
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
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
  const [tasks, setTasks] = useState(() => loadFromStorage<Task[]>(TASKS_KEY, initialTasks));
  const [snippets, setSnippets] = useState(() => loadFromStorage<Snippet[]>(SNIPPETS_KEY, initialSnippets));
  const [timerSnapshot, setTimerSnapshot] = useState<TimerSnapshot>({
    mode: 'focus',
    remainingSeconds: 25 * 60,
    totalSeconds: 25 * 60,
    isRunning: false,
  });

  useEffect(() => saveToStorage(TASKS_KEY, tasks), [tasks]);
  useEffect(() => saveToStorage(SNIPPETS_KEY, snippets), [snippets]);

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
