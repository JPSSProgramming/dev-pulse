import { useState } from 'react';
import {
    AppBar,
    Box,
    Checkbox,
    Chip,
    Container,
    CssBaseline,
    Drawer,
    Grid,
    List,
    ListItemIcon,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    Toolbar,
    Typography,
    ThemeProvider,
    createTheme,
    Avatar,
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
            default: '#f1f5f9',
            paper: '#ffffff',
        },
        primary: {
            main: '#6366f1',
        },
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
});

function App() {
    const drawerWidth = 260;
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, title: 'Finish React component', priority: 'high', category: 'code', completed: false },
        { id: 2, title: 'Study TypeScript generics', priority: 'medium', category: 'study', completed: false },
        { id: 3, title: 'Take a short break', priority: 'low', category: 'rest', completed: true },
    ]);

    const toggleTask = (id: number) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
        );
    };

    const navItems = [
        { text: 'Dashboard', icon: <DashboardRoundedIcon /> },
        { text: 'Daily Goals', icon: <TrackChangesRoundedIcon /> },
        { text: 'Focus Pulse', icon: <FlareRoundedIcon /> },
        { text: 'Snippets Vault', icon: <CodeRoundedIcon /> },
    ];

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return { bg: '#fef2f2', color: '#ef4444' };
            case 'medium':
                return { bg: '#fffbe3', color: '#d97706' };
            case 'low':
                return { bg: '#f0fdf4', color: '#16a34a' };
            default:
                return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
                <CssBaseline />

                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        bgcolor: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    }}
                >
                    <Toolbar sx={{ gap: 2, px: { xs: 2, sm: 4 } }}>
                        <Typography
                            variant="h6"
                            component="h1"
                            noWrap
                            sx={{
                                fontWeight: 800,
                                letterSpacing: 0.8,
                                background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            DevPulse
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />

                        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500 }}>
                            {today}
                        </Typography>

                        <Chip
                            avatar={<Avatar sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700 }}>D</Avatar>}
                            label="Developer"
                            size="medium"
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.08)',
                                color: '#ffffff',
                                fontWeight: 600,
                                px: 0.5,
                                '& .MuiChip-label': { color: '#ffffff' },
                            }}
                        />
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{
                        width: { xs: 72, sm: drawerWidth },
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: { xs: 72, sm: drawerWidth },
                            boxSizing: 'border-box',
                            borderRight: 'none',
                            bgcolor: '#ffffff',
                            boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
                        },
                    }}
                >
                    <Toolbar />
                    <List sx={{ pt: 3, px: 2 }}>
                        {navItems.map((item, index) => {
                            const isSelected = index === 0;
                            return (
                                <ListItemButton
                                    key={item.text}
                                    selected={isSelected}
                                    sx={{
                                        borderRadius: 3,
                                        mb: 1,
                                        px: { xs: 1.5, sm: 2.5 },
                                        py: 1.2,
                                        transition: 'all 0.2s ease-in-out',
                                        '&.Mui-selected': {
                                            bgcolor: '#6366f1',
                                            color: '#ffffff',
                                            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                                            '&:hover': {
                                                bgcolor: '#4f46e5',
                                            },
                                        },
                                        '&:hover': {
                                            bgcolor: '#f8fafc',
                                        },
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
                                                    display: { xs: 'none', sm: 'block' },
                                                    fontWeight: isSelected ? 700 : 500,
                                                    color: isSelected ? '#ffffff' : '#334155',
                                                },
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, textAlign: 'left', minWidth: 0 }}>
                    <Toolbar />
                    <Container maxWidth="xl" disableGutters>
                        <Stack spacing={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 3, sm: 5 },
                                    borderRadius: 4,
                                    bgcolor: '#ffffff',
                                    boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                }}
                            >
                                <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5, letterSpacing: '-0.5px' }}>
                                    Good day, Developer 👋
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 650, lineHeight: 1.7, fontSize: '1.05rem' }}>
                                    DevPulse helps you organize development work, track daily focus,
                                    and keep useful coding materials in one clean dashboard.
                                </Typography>
                            </Paper>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            borderRadius: 4,
                                            bgcolor: '#ffffff',
                                            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 2.5, color: '#0f172a' }}>
                                            Daily Dev Goals
                                        </Typography>
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
                                                            justifyContent: 'space-between',
                                                            p: 2,
                                                            borderRadius: 3,
                                                            bgcolor: task.completed ? '#f8fafc' : '#ffffff',
                                                            boxShadow: task.completed ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            border: '1px solid',
                                                            borderColor: task.completed ? '#f1f5f9' : '#f1f5f9',
                                                            '&:hover': {
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                                                transform: 'translateY(-1px)',
                                                            },
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                                                            <Checkbox
                                                                checked={task.completed}
                                                                icon={<RadioButtonUncheckedRoundedIcon sx={{ color: '#cbd5e1' }} />}
                                                                checkedIcon={<CheckCircleRoundedIcon sx={{ color: '#6366f1' }} />}
                                                                sx={{ p: 0 }}
                                                            />
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: task.completed ? '#94a3b8' : '#1e293b',
                                                                    textDecoration: task.completed ? 'line-through' : 'none',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                {task.title}
                                                            </Typography>
                                                        </Box>

                                                        <Stack direction="row" spacing={1} sx={{ ml: 1, flexShrink: 0 }}>
                                                            <Chip
                                                                label={task.priority}
                                                                size="small"
                                                                sx={{
                                                                    height: 24,
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 700,
                                                                    bgcolor: priorityStyle.bg,
                                                                    color: priorityStyle.color,
                                                                    borderRadius: 1.5,
                                                                }}
                                                            />
                                                            <Chip
                                                                label={task.category}
                                                                size="small"
                                                                sx={{
                                                                    height: 24,
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 700,
                                                                    bgcolor: '#e0e7ff',
                                                                    color: '#4338ca',
                                                                    borderRadius: 1.5,
                                                                }}
                                                            />
                                                        </Stack>
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    </Paper>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            borderRadius: 4,
                                            bgcolor: '#ffffff',
                                            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>
                                            Focus Pulse
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                                            Placeholder for tracking focused coding sessions and daily momentum.
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            borderRadius: 4,
                                            bgcolor: '#ffffff',
                                            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>
                                            Code Snippets Vault
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                                            Placeholder for saving and organizing reusable snippets and helpful references.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;