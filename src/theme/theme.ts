import { createTheme, type PaletteMode } from '@mui/material';

export const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#4f46e5' : '#818cf8',
      },
      secondary: {
        main: mode === 'light' ? '#0ea5e9' : '#38bdf8',
      },
      divider: mode === 'light' ? 'rgba(15, 23, 42, 0.08)' : 'rgba(148, 163, 184, 0.16)',
      background: {
        default: mode === 'light' ? '#f4f6fb' : '#0b1220',
        paper: mode === 'light' ? '#ffffff' : '#111827',
      },
      text: {
        primary: mode === 'light' ? '#0f172a' : '#e5e7eb',
        secondary: mode === 'light' ? '#64748b' : '#94a3b8',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily:
        '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h4: { fontWeight: 800, letterSpacing: '-0.03em' },
      h5: { fontWeight: 700, letterSpacing: '-0.02em' },
      h6: { fontWeight: 700, letterSpacing: '-0.02em' },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage:
              mode === 'light'
                ? 'radial-gradient(circle at 0% 0%, rgba(79, 70, 229, 0.08), transparent 42%), radial-gradient(circle at 100% 0%, rgba(14, 165, 233, 0.07), transparent 36%)'
                : 'radial-gradient(circle at 0% 0%, rgba(129, 140, 248, 0.14), transparent 42%), radial-gradient(circle at 100% 0%, rgba(56, 189, 248, 0.08), transparent 38%)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${mode === 'light' ? 'rgba(15, 23, 42, 0.08)' : 'rgba(148, 163, 184, 0.14)'}`,
            boxShadow:
              mode === 'light'
                ? '0 10px 28px rgba(15, 23, 42, 0.045)'
                : '0 12px 28px rgba(0, 0, 0, 0.22)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.82)' : 'rgba(17, 24, 39, 0.82)',
            backdropFilter: 'blur(14px)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${mode === 'light' ? 'rgba(15, 23, 42, 0.08)' : 'rgba(148, 163, 184, 0.14)'}`,
            backgroundColor: mode === 'light' ? '#ffffff' : '#0f172a',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: mode === 'light' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(129, 140, 248, 0.16)',
              '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: mode === 'light' ? '#4f46e5' : '#c7d2fe',
                fontWeight: 700,
              },
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? 'rgba(79, 70, 229, 0.12)' : 'rgba(129, 140, 248, 0.18)',
          },
        },
      },
    },
  });
