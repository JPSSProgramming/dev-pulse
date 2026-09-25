/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useLocation,
  useRouter,
} from '@tanstack/react-router';
import type { PaletteMode } from '@mui/material';
import { Box, CssBaseline, ThemeProvider, Toolbar } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import FlareRoundedIcon from '@mui/icons-material/FlareRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';

import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Dashboard } from '../pages/Dashboard';
import { DailyGoalsPage } from '../pages/DailyGoalsPage';
import { FocusPulsePage } from '../pages/FocusPulsePage';
import { SnippetsVaultPage } from '../pages/SnippetsVaultPage';
import { createAppTheme } from '../theme/theme';
import type { NavSection } from '../types/navigation';
import type { Task } from '../types/task';
import type { Snippet } from '../types/snippet';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';
import { useTranslation } from '../i18n/I18nProvider';

const THEME_KEY = 'devpulse-theme-mode';
const TASKS_KEY = 'devpulse-tasks';
const SNIPPETS_KEY = 'devpulse-snippets';
const drawerWidth = 260;

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

const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateContext');
  }
  return context;
};

const rootRoute = createRootRoute({
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardRoute,
});

function DashboardRoute() {
    const { tasks, snippets, timerSnapshot } = useAppState();
    return (
      <Dashboard
        totalTasks={tasks.length}
        completedTasks={tasks.filter((task) => task.completed).length}
        snippetCount={snippets.length}
        timerSnapshot={timerSnapshot}
        onGoToGoals={() => void router.navigate({ to: '/daily-goals' })}
        onGoToFocus={() => void router.navigate({ to: '/focus-pulse' })}
        onGoToSnippets={() => void router.navigate({ to: '/snippets-vault' })}
      />
    );
}

const dailyGoalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-goals',
  component: DailyGoalsRoute,
});

function DailyGoalsRoute() {
    const { tasks, setTasks } = useAppState();
    return <DailyGoalsPage tasks={tasks} onTasksChange={setTasks} />;
}

const focusPulseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/focus-pulse',
  component: FocusPulseRoute,
});

function FocusPulseRoute() {
    const { timerSnapshot, setTimerSnapshot } = useAppState();
    return <FocusPulsePage snapshot={timerSnapshot} onSnapshotChange={setTimerSnapshot} />;
}

const snippetsVaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/snippets-vault',
  component: SnippetsVaultRoute,
});

function SnippetsVaultRoute() {
    const { snippets, setSnippets } = useAppState();
    return <SnippetsVaultPage snippets={snippets} onSnippetsChange={setSnippets} />;
}

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  dailyGoalsRoute,
  focusPulseRoute,
  snippetsVaultRoute,
]);

export const router = createRouter({ routeTree });

function AppLayout() {
  const { t } = useTranslation();
  const routerInstance = useRouter();
  const location = useLocation();
  const [mode, setMode] = useState<PaletteMode>(() => {
    const stored = loadFromStorage<PaletteMode | null>(THEME_KEY, null);
    return stored === 'dark' ? 'dark' : 'light';
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage<Task[]>(TASKS_KEY, initialTasks));
  const [snippets, setSnippets] = useState<Snippet[]>(() => loadFromStorage<Snippet[]>(SNIPPETS_KEY, initialSnippets));
  const [timerSnapshot, setTimerSnapshot] = useState<TimerSnapshot>({
    mode: 'focus',
    remainingSeconds: 25 * 60,
    totalSeconds: 25 * 60,
    isRunning: false,
  });

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => saveToStorage(THEME_KEY, mode), [mode]);
  useEffect(() => saveToStorage(TASKS_KEY, tasks), [tasks]);
  useEffect(() => saveToStorage(SNIPPETS_KEY, snippets), [snippets]);

  const activeSection: NavSection =
    location.pathname === '/daily-goals'
      ? 'daily-goals'
      : location.pathname === '/focus-pulse'
        ? 'focus-pulse'
        : location.pathname === '/snippets-vault'
          ? 'snippets-vault'
          : 'dashboard';

  const navigationItems = [
    { key: 'dashboard' as const, label: t('navigation.dashboard'), icon: <DashboardRoundedIcon /> },
    { key: 'daily-goals' as const, label: t('navigation.dailyGoals'), icon: <TrackChangesRoundedIcon /> },
    { key: 'focus-pulse' as const, label: t('navigation.focusPulse'), icon: <FlareRoundedIcon /> },
    { key: 'snippets-vault' as const, label: t('navigation.snippetsVault'), icon: <CodeRoundedIcon /> },
  ];

  const routeBySection: Record<NavSection, string> = {
    dashboard: '/',
    'daily-goals': '/daily-goals',
    'focus-pulse': '/focus-pulse',
    'snippets-vault': '/snippets-vault',
  };

  return (
    <AppStateContext.Provider value={{ tasks, setTasks, snippets, setSnippets, timerSnapshot, setTimerSnapshot }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header
            onMenuToggle={() => setMobileOpen((previous) => !previous)}
            mode={mode}
            onToggleMode={() => setMode((previous) => (previous === 'light' ? 'dark' : 'light'))}
            drawerWidth={drawerWidth}
          />
          <Sidebar
            drawerWidth={drawerWidth}
            items={navigationItems}
            activeSection={activeSection}
            onSelect={(section) => {
              setMobileOpen(false);
              void routerInstance.navigate({ to: routeBySection[section] });
            }}
            mobileOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />
          <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, sm: 3 }, width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` } }}>
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
      </ThemeProvider>
    </AppStateContext.Provider>
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
