
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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import FlareIcon from '@mui/icons-material/Flare';
import CodeIcon from '@mui/icons-material/Code';
import type { Task } from './types/task';

function App() {
    const drawerWidth = 240;
    const [tasks] = useState<Task[]>([
        { id: 1, title: 'Finish React component', priority: 'high', category: 'code', completed: false },
        { id: 2, title: 'Study TypeScript generics', priority: 'medium', category: 'study', completed: false },
        { id: 3, title: 'Take a short break', priority: 'low', category: 'rest', completed: false },
    ]);
    const taskCount = tasks.length;

    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon /> },
        { text: 'Daily Goals', icon: <TrackChangesIcon /> },
        { text: 'Focus Pulse', icon: <FlareIcon /> },
        { text: 'Snippets Vault', icon: <CodeIcon /> },
    ];

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: '#1e293b',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <Toolbar sx={{ gap: 2 }}>
                    <Typography
                        variant="h6"
                        component="h1"
                        noWrap
                        sx={{
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            color: '#ffffff',
                            pl: { xs: 1, sm: 2 }
                        }}
                    >
                        DevPulse
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'rgba(255, 255, 255, 0.7)' }}>
                        {today}
                    </Typography>

                    <Chip
                        label="Developer"
                        size="small"
                        variant="outlined"
                        sx={{
                            color: '#ffffff',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            bgcolor: 'rgba(255, 255, 255, 0.05)'
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
                        borderRight: '1px solid #e2e8f0',
                    },
                }}
            >
                <Toolbar />
                <List sx={{ pt: 2 }}>
                    {navItems.map((item, index) => (
                        <ListItemButton
                            key={item.text}
                            selected={index === 0}
                            sx={{
                                px: { xs: 2, sm: 3 },
                                py: 1.5,
                                '&.Mui-selected': {
                                    bgcolor: 'action.selected',
                                    borderRight: '4px solid #1976d2',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: index === 0 ? 'primary.main' : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                slotProps={{
                                    primary: {
                                        sx: {
                                            display: { xs: 'none', sm: 'block' },
                                            fontWeight: index === 0 ? 600 : 400,
                                            textAlign: 'left',
                                        },
                                    },
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box component="main" data-task-count={taskCount} sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, textAlign: 'left' }}>
                <Toolbar />
                <Container maxWidth="lg" disableGutters>
                    <Stack spacing={3}>

                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                borderRadius: 3,
                                border: '1px solid #e2e8f0',
                                bgcolor: '#ffffff',
                                textAlign: 'left'
                            }}
                        >
                            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                                Good day, Developer
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, lineHeight: 1.6 }}>
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
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textAlign: 'left'
                                    }}
                                >
                                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                                        Daily Dev Goals
                                    </Typography>
                                    <Stack spacing={2}>
                                        {tasks.map((task) => (
                                            <Box
                                                key={task.id}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 2,
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: 2,
                                                    px: 1.5,
                                                    py: 1,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                                                    <Checkbox checked={task.completed} disabled sx={{ p: 0.5 }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>
                                                        {task.title}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                    <Typography variant="caption" sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: '#e2e8f0', color: '#334155' }}>
                                                        {task.priority}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: '#dbeafe', color: '#1d4ed8' }}>
                                                        {task.category}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textAlign: 'left'
                                    }}
                                >
                                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                                        Focus Pulse
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
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
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textAlign: 'left'
                                    }}
                                >
                                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                                        Code Snippets Vault
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                        Placeholder for saving and organizing reusable snippets and helpful references.
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}

export default App;
