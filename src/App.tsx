import { useEffect, useMemo, useState } from 'react';
import type { PaletteMode } from '@mui/material';
import { Box, CssBaseline, ThemeProvider, Toolbar} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import FlareRoundedIcon from '@mui/icons-material/FlareRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { DailyGoals } from './features/tasks/DailyGoals';
import { FocusTimer } from './features/timer/FocusTimer';
import { SnippetsVault } from './features/snippets/SnippetsVault';
import { createAppTheme } from './theme/theme';
import type { NavSection } from './types/navigation';
import type { Task } from './types/task';
import type { Snippet } from './types/snippet';
import { loadFromStorage, saveToStorage } from './utils/localStorage';

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

const initialTimerSnapshot: TimerSnapshot = {
  mode: 'focus',
  remainingSeconds: 25 * 60,
  totalSeconds: 25 * 60,
  isRunning: false,
};

const App = () => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const stored = loadFromStorage<PaletteMode | null>(THEME_KEY, null);
    return stored === 'dark' ? 'dark' : 'light';
  });
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage<Task[]>(TASKS_KEY, initialTasks));
  const [snippets, setSnippets] = useState<Snippet[]>(() => loadFromStorage<Snippet[]>(SNIPPETS_KEY, initialSnippets));
  const [timerSnapshot, setTimerSnapshot] = useState<TimerSnapshot>(initialTimerSnapshot);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    saveToStorage(THEME_KEY, mode);
  }, [mode]);

  useEffect(() => {
    saveToStorage(TASKS_KEY, tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage(SNIPPETS_KEY, snippets);
  }, [snippets]);

  const completedTasks = tasks.filter((task) => task.completed).length;

  const navigationItems = [
    { key: 'dashboard' as const, label: 'Dashboard', icon: <DashboardRoundedIcon /> },
    { key: 'daily-goals' as const, label: 'Daily Goals', icon: <TrackChangesRoundedIcon /> },
    { key: 'focus-pulse' as const, label: 'Focus Pulse', icon: <FlareRoundedIcon /> },
    { key: 'snippets-vault' as const, label: 'Snippets Vault', icon: <CodeRoundedIcon /> },
  ];

  const handleSectionSelect = (section: NavSection) => {
    setActiveSection(section);
    setMobileOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header
          onMenuToggle={() => setMobileOpen((prev) => !prev)}
          mode={mode}
          onToggleMode={() => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
          drawerWidth={drawerWidth}
        />
        <Sidebar
          drawerWidth={drawerWidth}
          items={navigationItems}
          activeSection={activeSection}
          onSelect={handleSectionSelect}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            p: { xs: 2, sm: 3 },
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          <Toolbar />
          {activeSection === 'dashboard' && (
            <Dashboard
              totalTasks={tasks.length}
              completedTasks={completedTasks}
              snippetCount={snippets.length}
              timerSnapshot={timerSnapshot}
              onGoToGoals={() => setActiveSection('daily-goals')}
              onGoToFocus={() => setActiveSection('focus-pulse')}
              onGoToSnippets={() => setActiveSection('snippets-vault')}
            />
          )}
          {activeSection === 'daily-goals' && (
            <DailyGoals tasks={tasks} onTasksChange={setTasks} />
          )}
          {activeSection === 'focus-pulse' && (
            <FocusTimer
              onSnapshotChange={setTimerSnapshot}
              snapshot={timerSnapshot}
            />
          )}
          {activeSection === 'snippets-vault' && (
            <SnippetsVault snippets={snippets} onSnippetsChange={setSnippets} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
