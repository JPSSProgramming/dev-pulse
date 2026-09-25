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
import { useTranslation } from '../i18n/I18nProvider';

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
  const { t } = useTranslation();
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t('dashboard.greeting')}
          </Typography>
          <Typography color="text.secondary">
            {t('dashboard.description')}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.2}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{t('dashboard.dailyProgress')}</Typography>
              <Chip label={`${completedTasks}/${totalTasks}`} color="primary" variant="outlined" />
            </Stack>
            <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4 }} />
            <Typography variant="body2" color="text.secondary">
              {progressPercent}% {t('dashboard.completed')}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">{t('navigation.dailyGoals')}</Typography>
              <Typography color="text.secondary">{totalTasks} {t('dashboard.totalTasks')}, {completedTasks} {t('dashboard.completedTasks')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">{t('navigation.focusPulse')}</Typography>
              <Typography color="text.secondary">
                {timerSnapshot.mode === 'focus' ? t('common.focus') : t('common.break')} • {Math.floor(timerSnapshot.remainingSeconds / 60)}:{String(timerSnapshot.remainingSeconds % 60).padStart(2, '0')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">{t('navigation.snippetsVault')}</Typography>
              <Typography color="text.secondary">{snippetCount} {t('dashboard.savedSnippets')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>{t('dashboard.quickActions')}</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
            <Button startIcon={<AddTaskRoundedIcon />} variant="contained" onClick={onGoToGoals}>{t('dashboard.addTask')}</Button>
            <Button startIcon={<FlareRoundedIcon />} variant="outlined" onClick={onGoToFocus}>{t('dashboard.startFocus')}</Button>
            <Button startIcon={<CodeRoundedIcon />} variant="outlined" onClick={onGoToSnippets}>{t('dashboard.addSnippet')}</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
