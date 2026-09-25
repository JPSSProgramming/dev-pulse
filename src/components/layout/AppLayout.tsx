import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from '@tanstack/react-router';
import type { PaletteMode } from '@mui/material';
import { Box, CssBaseline, ThemeProvider, Toolbar } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import FlareRoundedIcon from '@mui/icons-material/FlareRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { createAppTheme } from '../../theme/theme';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage';
import { useTranslation } from '../../i18n/I18nProvider';

const THEME_KEY = 'devpulse-theme-mode';
const drawerWidth = 260;

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mode, setMode] = useState<PaletteMode>(() => {
    const stored = loadFromStorage<PaletteMode | null>(THEME_KEY, null);
    return stored === 'dark' ? 'dark' : 'light';
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => saveToStorage(THEME_KEY, mode), [mode]);

  const navigationItems = [
    { key: 'dashboard' as const, path: '/', label: t('navigation.dashboard'), icon: <DashboardRoundedIcon /> },
    { key: 'daily-goals' as const, path: '/daily-goals', label: t('navigation.dailyGoals'), icon: <TrackChangesRoundedIcon /> },
    { key: 'focus-pulse' as const, path: '/focus-pulse', label: t('navigation.focusPulse'), icon: <FlareRoundedIcon /> },
    { key: 'snippets-vault' as const, path: '/snippets-vault', label: t('navigation.snippetsVault'), icon: <CodeRoundedIcon /> },
    { key: 'micro-step' as const, path: '/micro-step', label: t('navigation.microStep'), icon: <AutoAwesomeRoundedIcon /> },
  ] as const;

  return (
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
          activePath={location.pathname}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>
          <Toolbar />
          <Box sx={{ width: '100%', maxWidth: 1280, mx: 'auto' }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
