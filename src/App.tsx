import {
  AppBar,
  Box,
  Chip,
  Container,
  CssBaseline,
  Drawer,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';


function App() {
  const drawerWidth = 220;
  const navItems = ['Dashboard', 'Daily Goals', 'Focus Pulse', 'Snippets Vault'];
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="h1" noWrap sx={{ flexGrow: 1 }}>
            DevPulse
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {today}
            </Typography>
            <Chip label="Developer" size="small" color="primary" variant="outlined" />
          </Box>
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
          },
        }}
      >
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item} sx={{ px: { xs: 1, sm: 2 } }}>
              <ListItemText
                primary={item}
                slotProps={{
                  primary: {
                    sx: {
                      display: { xs: 'none', sm: 'block' },
                    },
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Good day, Developer
              </Typography>
              <Typography variant="body1" color="text.secondary">
                DevPulse helps you organize development work, track daily focus,
                and keep useful coding materials in one clean dashboard.
              </Typography>
            </Paper>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Daily Dev Goals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placeholder for planning and reviewing today&apos;s key
                    development tasks.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Focus Pulse
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placeholder for tracking focused coding sessions and daily
                    momentum.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Code Snippets Vault
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placeholder for saving and organizing reusable snippets and
                    helpful references.
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