import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';

function App() {
  const drawerWidth = 220;
  const navItems = ['Dashboard', 'Goals', 'Settings'];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="h1" noWrap>
            MicroStep
          </Typography>
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
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h4" component="h2">
                Welcome to MicroStep
              </Typography>
              <Typography variant="body1" color="text.secondary">
                MicroStep helps you break large goals into small 5-10 minute
                tasks so progress feels simple and consistent.
              </Typography>
              <Box>
                <Button variant="contained" size="large">
                  Create Goal
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default App;