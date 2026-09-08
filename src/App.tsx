import { Box, Button, Container, Paper, Typography } from '@mui/material';

function App() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography
              variant="h3"
              component="h1"
              sx={{
                bgcolor: 'lightgray',
                color: 'blue',
                p: 2,
              }}
          >
            MicroStep
          </Typography>
          <Typography variant="body1" color="text.secondary">
            MicroStep helps you break large goals into small 5-10 minute tasks
            so progress feels simple and consistent.
          </Typography>
          <Button variant="contained" size="large">
            Create Goal
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;