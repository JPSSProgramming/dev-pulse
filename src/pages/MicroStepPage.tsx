import { useState } from 'react';
import { Link, Outlet, useLocation } from '@tanstack/react-router';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useGoals } from '../context/GoalContext';
import { useTranslation } from '../i18n/I18nProvider';

export const MicroStepPage = () => {
  const { t } = useTranslation();
  const { goals, addGoal, deleteGoal, getGoalProgress } = useGoals();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createGoal = () => {
    const goal = addGoal(title, description);
    if (!goal) return;
    setTitle('');
    setDescription('');
  };

  if (location.pathname !== '/micro-step') {
    return <Outlet />;
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h4" gutterBottom>{t('microStep.title')}</Typography>
        <Typography color="text.secondary">{t('microStep.description')}</Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">{t('microStep.createGoal')}</Typography>
            <TextField
              label={t('microStep.goalTitle')}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
              required
            />
            <TextField
              label={t('microStep.goalDescription')}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
            <Button variant="contained" onClick={createGoal} disabled={!title.trim()} startIcon={<TrackChangesRoundedIcon />}>
              {t('microStep.create')}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {goals.length === 0 ? (
        <Card><CardContent><Typography color="text.secondary">{t('microStep.empty')}</Typography></CardContent></Card>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 2,
        }}>
          {goals.map((goal) => {
            const progress = getGoalProgress(goal);
            return (
              <Card key={goal.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={1.2}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" sx={{ overflowWrap: 'anywhere' }}>{goal.title}</Typography>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label={t('microStep.deleteGoal')}
                        onClick={() => deleteGoal(goal.id)}
                      >
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    {goal.description && <Typography variant="body2" color="text.secondary">{goal.description}</Typography>}
                    <Typography variant="body2">{t('microStep.progress')}: {progress}%</Typography>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                    <Typography variant="body2" color="text.secondary">
                      {goal.steps.filter((step) => step.completed).length}/{goal.steps.length} {t('microStep.steps')}
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Link to="/micro-step/$goalId" params={{ goalId: goal.id }} style={{ width: '100%', textDecoration: 'none' }}>
                    <Button fullWidth>{t('microStep.openGoal')}</Button>
                  </Link>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}
      <Outlet />
    </Stack>
  );
};
