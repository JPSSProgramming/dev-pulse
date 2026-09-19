import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import FlareRoundedIcon from '@mui/icons-material/FlareRounded';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import type { TimerSnapshot } from '../App';

interface DashboardProps {
  totalTasks: number;
  completedTasks: number;
  snippetCount: number;
  timerSnapshot: TimerSnapshot;
  onGoToGoals: () => void;
  onGoToFocus: () => void;
  onGoToSnippets: () => void;
}

export const Dashboard = ({
  totalTasks,
  completedTasks,
  snippetCount,
  timerSnapshot,
  onGoToGoals,
  onGoToFocus,
  onGoToSnippets,
}: DashboardProps) => {
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Good day, Developer
          </Typography>
          <Typography color="text.secondary">
            Keep momentum across daily goals, focus sessions, and reusable snippets.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.2}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Daily progress</Typography>
              <Chip label={`${completedTasks}/${totalTasks}`} color="primary" variant="outlined" />
            </Stack>
            <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4 }} />
            <Typography variant="body2" color="text.secondary">
              {progressPercent}% completed
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">Daily Goals</Typography>
              <Typography color="text.secondary">{totalTasks} total tasks, {completedTasks} completed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">Focus Pulse</Typography>
              <Typography color="text.secondary">
                {timerSnapshot.mode === 'focus' ? 'Focus' : 'Break'} • {Math.floor(timerSnapshot.remainingSeconds / 60)}:{String(timerSnapshot.remainingSeconds % 60).padStart(2, '0')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">Snippets Vault</Typography>
              <Typography color="text.secondary">{snippetCount} snippets saved</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Quick actions</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
            <Button startIcon={<AddTaskRoundedIcon />} variant="contained" onClick={onGoToGoals}>Add Task</Button>
            <Button startIcon={<FlareRoundedIcon />} variant="outlined" onClick={onGoToFocus}>Start Focus</Button>
            <Button startIcon={<CodeRoundedIcon />} variant="outlined" onClick={onGoToSnippets}>Add Snippet</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
