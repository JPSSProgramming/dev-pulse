import { useCallback, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useGoals } from '../context/GoalContext';
import { useTranslation } from '../i18n/I18nProvider';
import { FocusTimer } from '../components/microstep/FocusTimer';

export const MicroStepGoalDetailsPage = () => {
  const { t } = useTranslation();
  const { goalId } = useParams({ from: '/micro-step/$goalId' });
  const { goals, addStep, toggleStep, getGoalProgress } = useGoals();
  const goal = goals.find((item) => item.id === goalId);
  const [stepTitle, setStepTitle] = useState('');
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const onTimerComplete = useCallback((stepId: string) => {
    toggleStep(goalId, stepId);
  }, [goalId, toggleStep]);

  if (!goal) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Alert severity="warning">{t('microStep.goalNotFound')}</Alert>
            <Link to="/micro-step" style={{ textDecoration: 'none' }}>
              <Button startIcon={<ArrowBackRoundedIcon />}>{t('microStep.backToGoals')}</Button>
            </Link>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const addNewStep = () => {
    if (!stepTitle.trim()) return;
    addStep(goal.id, stepTitle);
    setStepTitle('');
  };

  const progress = getGoalProgress(goal);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Link to="/micro-step" style={{ alignSelf: 'flex-start', textDecoration: 'none' }}>
            <Button startIcon={<ArrowBackRoundedIcon />}>{t('microStep.backToGoals')}</Button>
          </Link>
          <BoxHeading title={goal.title} description={goal.description} />
          <Stack spacing={1}>
            <Typography variant="body2">{t('microStep.progress')}: {progress}%</Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 9, borderRadius: 5 }} />
          </Stack>
          <Divider />
          <Typography variant="h6">{t('microStep.stepsTitle')}</Typography>
          <Stack spacing={1}>
            {goal.steps.map((step) => (
              <Stack key={step.id} spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Checkbox
                    checked={step.completed}
                    onChange={() => toggleStep(goal.id, step.id)}
                    slotProps={{ input: { 'aria-label': step.title } }}
                  />
                  <Typography sx={{ flexGrow: 1, textDecoration: step.completed ? 'line-through' : 'none', overflowWrap: 'anywhere' }}>
                    {step.title}
                  </Typography>
                  {!step.completed && (
                    <Button
                      size="small"
                      startIcon={<PlayArrowRoundedIcon />}
                      onClick={() => setActiveStepId(activeStepId === step.id ? null : step.id)}
                    >
                      {t('microStep.focus')}
                    </Button>
                  )}
                </Stack>
                {activeStepId === step.id && (
                  <FocusTimer step={step} onComplete={() => onTimerComplete(step.id)} />
                )}
              </Stack>
            ))}
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              label={t('microStep.stepTitle')}
              value={stepTitle}
              onChange={(event) => setStepTitle(event.target.value)}
              fullWidth
              onKeyDown={(event) => {
                if (event.key === 'Enter') addNewStep();
              }}
            />
            <Button variant="outlined" onClick={addNewStep} disabled={!stepTitle.trim()} startIcon={<AddRoundedIcon />}>
              {t('microStep.addStep')}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const BoxHeading = ({ title, description }: { title: string; description: string }) => (
  <Stack spacing={0.5}>
    <Typography variant="h5" sx={{ overflowWrap: 'anywhere' }}>{title}</Typography>
    {description && <Typography color="text.secondary">{description}</Typography>}
  </Stack>
);
