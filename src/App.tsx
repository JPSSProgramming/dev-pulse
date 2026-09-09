import { useState } from 'react';

import {
    AppBar,
    Avatar,
    Box,
    Checkbox,
    Chip,
    CssBaseline,
    Drawer,
    Grid,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Toolbar,
    Typography,
    ThemeProvider,
    createTheme,
} from '@mui/material';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import FlareRoundedIcon from '@mui/icons-material/FlareRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';

import type { Task } from './types/task';

const theme = createTheme({
    palette: {
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        primary: {
            main: '#6366f1',
        },
        text: {
            primary: '#0f172a',
            secondary: '#64748b',
        },
    },
    shape: {
        borderRadius: 20,
    },
    typography: {
        fontFamily:
            '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: { fontWeight: 800 },
        h2: { fontWeight: 800 },
        h3: { fontWeight: 800 },
        h6: { fontWeight: 700 },
    },
});

function App() {
    const drawerWidth = 260;

    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: 'Finish React component',
            priority: 'high',
            category: 'code',
            completed: false,
        },
        {
            id: 2,
            title: 'Study TypeScript generics',
            priority: 'medium',
            category: 'study',
            completed: false,
        },
        {
            id: 3,
            title: 'Take a short break',
            priority: 'low',
            category: 'rest',
            completed: true,
        },
    ]);

    const toggleTask = (id: number) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return { bg: '#fef2f2', color: '#ef4444' };
            case 'medium':
                return { bg: '#fff7ed', color: '#d97706' };
            case 'low':
                return { bg: '#f0fdf4', color: '#16a34a' };
            default:
                return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const navItems = [
        { text: 'Dashboard', icon: <DashboardRoundedIcon /> },
        { text: 'Daily Goals', icon: <TrackChangesRoundedIcon /> },
        { text: 'Focus Pulse', icon: <FlareRoundedIcon /> },
        { text: 'Snippets Vault', icon: <CodeRoundedIcon /> },
    ];

    const cardSx = {
        bgcolor: '#ffffff',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        borderRadius: '24px',
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc', width: '100%', overflowX: 'hidden' }}>
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        bgcolor: '#0f172a',
                        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
                    }}
                >
                    <Toolbar
                        sx={{
                            minHeight: '64px !important',
                            px: { xs: 2, sm: 3, md: 4 },
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: 0.5,
                                background:
                                    'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            DevPulse
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />

                        <Typography
                            variant="body2"
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                color: '#94a3b8',
                                mr: 3,
                                fontWeight: 500,
                            }}
                        >
                            {today}
                        </Typography>

                        <Chip
                            avatar={
                                <Avatar
                                    sx={{
                                        bgcolor: '#6366f1',
                                        color: '#fff',
                                        fontWeight: 700,
                                        width: 30,
                                        height: 30,
                                    }}
                                >
                                    D
                                </Avatar>
                            }
                            label="Developer"
                            sx={{
                                bgcolor: '#1e293b',
                                color: '#ffffff',
                                fontWeight: 600,
                                '& .MuiChip-label': { px: 1.5 },
                            }}
                        />
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: '#ffffff',
                            borderRight: '1px solid #f1f5f9',
                        },
                    }}
                >
                    <Toolbar />

                    <List sx={{ px: 2, pt: 3 }}>
                        {navItems.map((item, index) => {
                            const isSelected = index === 0;

                            return (
                                <ListItemButton
                                    key={item.text}
                                    selected={isSelected}
                                    sx={{
                                        minHeight: 48,
                                        mb: 1,
                                        px: 2,
                                        borderRadius: '14px',
                                        transition: 'all 0.2s ease',
                                        '&.Mui-selected': {
                                            bgcolor: '#6366f1',
                                            color: '#ffffff',
                                            boxShadow: '0 6px 16px rgba(99, 102, 241, 0.25)',
                                            '&:hover': { bgcolor: '#5558e8' },
                                        },
                                        '&:hover': { bgcolor: '#f1f5f9' },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 40,
                                            color: isSelected ? '#ffffff' : '#64748b',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={item.text}
                                        slotProps={{
                                            primary: {
                                                sx: {
                                                    fontWeight: isSelected ? 700 : 500,
                                                    color: isSelected ? '#ffffff' : '#334155',
                                                    fontSize: '0.95rem',
                                                },
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Drawer>

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3, md: 4 },
                        minWidth: 0,
                    }}
                >
                    <Toolbar />

                    <Stack spacing={3} sx={{ width: '100%', maxWidth: '1400px', mx: 'auto' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                ...cardSx,
                                p: { xs: 3, sm: 4 },
                                background:
                                    'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        letterSpacing: '-0.5px',
                                        color: '#0f172a',
                                        mb: 0.5,
                                    }}
                                >
                                    Good day, Developer 👋
                                </Typography>

                                <Typography variant="body1" sx={{ color: '#64748b' }}>
                                    DevPulse helps you organize development work, track daily
                                    focus, and keep useful coding materials in one clean
                                    dashboard.
                                </Typography>
                            </Box>
                        </Paper>

                        <Grid container spacing={3} sx={{ width: '100%' }}>
                            <Grid size={{ xs: 12 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        ...cardSx,
                                        p: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 2.5,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                sx={{ color: '#0f172a', mb: 0.2 }}
                                            >
                                                Daily Dev Goals
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                Your tasks for today
                                            </Typography>
                                        </Box>

                                        <Chip
                                            label={`${
                                                tasks.filter((task) => task.completed).length
                                            }/${tasks.length}`}
                                            size="small"
                                            sx={{
                                                bgcolor: '#eef2ff',
                                                color: '#4f46e5',
                                                fontWeight: 700,
                                            }}
                                        />
                                    </Box>

                                    <Stack spacing={1.5}>
                                        {tasks.map((task) => {
                                            const priorityStyle = getPriorityColor(task.priority);

                                            return (
                                                <Box
                                                    key={task.id}
                                                    onClick={() => toggleTask(task.id)}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.5,
                                                        p: 1.5,
                                                        borderRadius: '14px',
                                                        bgcolor: task.completed ? '#f8fafc' : '#ffffff',
                                                        border: '1px solid #f1f5f9',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            bgcolor: '#f8fafc',
                                                            borderColor: '#cbd5e1',
                                                        },
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={task.completed}
                                                        onChange={() => toggleTask(task.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        icon={
                                                            <RadioButtonUncheckedRoundedIcon
                                                                sx={{ color: '#cbd5e1' }}
                                                            />
                                                        }
                                                        checkedIcon={
                                                            <CheckCircleRoundedIcon
                                                                sx={{ color: '#6366f1' }}
                                                            />
                                                        }
                                                        sx={{ p: 0 }}
                                                    />

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            flex: 1,
                                                            fontWeight: 600,
                                                            color: task.completed ? '#94a3b8' : '#1e293b',
                                                            textDecoration: task.completed
                                                                ? 'line-through'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {task.title}
                                                    </Typography>

                                                    <Stack direction="row" spacing={0.7}>
                                                        <Chip
                                                            label={task.priority}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                bgcolor: priorityStyle.bg,
                                                                color: priorityStyle.color,
                                                                fontSize: '0.68rem',
                                                                fontWeight: 700,
                                                            }}
                                                        />
                                                        <Chip
                                                            label={task.category}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                bgcolor: '#eef2ff',
                                                                color: '#4338ca',
                                                                fontSize: '0.68rem',
                                                                fontWeight: 700,
                                                            }}
                                                        />
                                                    </Stack>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        ...cardSx,
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: '16px',
                                            bgcolor: '#eef2ff',
                                            color: '#6366f1',
                                            mb: 2,
                                        }}
                                    >
                                        <FlareRoundedIcon />
                                    </Box>

                                    <Typography variant="h6" sx={{ color: '#0f172a', mb: 1 }}>
                                        Focus Pulse
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#64748b', mb: 3 }}
                                    >
                                        Track focused coding sessions and build your daily
                                        momentum.
                                    </Typography>

                                    <Box
                                        sx={{
                                            width: '100%',
                                            p: 2,
                                            borderRadius: '16px',
                                            bgcolor: '#f8fafc',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#94a3b8',
                                                fontWeight: 700,
                                                display: 'block',
                                                mb: 0.5,
                                            }}
                                        >
                                            TODAY
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            sx={{ fontWeight: 800, color: '#0f172a' }}
                                        >
                                            0 min
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        ...cardSx,
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: '16px',
                                            bgcolor: '#f0fdf4',
                                            color: '#16a34a',
                                            mb: 2,
                                        }}
                                    >
                                        <CodeRoundedIcon />
                                    </Box>

                                    <Typography variant="h6" sx={{ color: '#0f172a', mb: 1 }}>
                                        Snippets Vault
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#64748b', mb: 3 }}
                                    >
                                        Save and organize reusable code snippets and useful
                                        references.
                                    </Typography>

                                    <Box
                                        sx={{
                                            width: '100%',
                                            p: 2,
                                            borderRadius: '16px',
                                            bgcolor: '#f8fafc',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#94a3b8',
                                                fontWeight: 700,
                                                display: 'block',
                                                mb: 0.5,
                                            }}
                                        >
                                            SAVED SNIPPETS
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            sx={{ fontWeight: 800, color: '#0f172a' }}
                                        >
                                            0
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;