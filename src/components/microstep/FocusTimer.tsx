import { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import type { MicroStep } from '../../types/microStep';
import { useTranslation } from '../../i18n/I18nProvider';

interface FocusTimerProps {
  step: MicroStep;
  onComplete: () => void;
}

const notifyCompletion = (title: string, body: string) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  try {
    if (window.Notification.permission === 'granted') {
      new window.Notification(title, { body });
    } else if (window.Notification.permission === 'default') {
      void window.Notification.requestPermission()
        .then((permission) => {
          if (permission === 'granted') {
            new window.Notification(title, { body });
          }
        })
        .catch(() => undefined);
    }
  } catch {
    // Browser notifications are optional and can be unavailable in some environments.
  }
};

export const FocusTimer = ({ step, onComplete }: FocusTimerProps) => {
  const { t } = useTranslation();
  const totalSeconds = Math.max(1, Number.isFinite(step.durationSeconds) ? step.durationSeconds : 300);
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!isRunning || startedAt === null || completed) return undefined;

    const timerId = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, remainingSeconds - elapsed);
      if (remaining <= 0) {
        setRemainingSeconds(0);
        setIsRunning(false);
        setStartedAt(null);
        setCompleted(true);
        onComplete();
        notifyCompletion(t('microStep.notificationTitle'), t('microStep.notificationBody'));
      } else {
        setRemainingSeconds(remaining);
        setStartedAt(Date.now());
      }
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [completed, isRunning, onComplete, remainingSeconds, startedAt, t]);

  const reset = () => {
    setRemainingSeconds(totalSeconds);
    setIsRunning(false);
    setStartedAt(null);
    setCompleted(false);
  };

  const start = () => {
    setStartedAt(Date.now());
    setIsRunning(true);
  };
  const pause = () => {
    if (startedAt !== null) {
      setRemainingSeconds((current) => Math.max(0, current - Math.floor((Date.now() - startedAt) / 1000)));
    }
    setStartedAt(null);
    setIsRunning(false);
  };

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progress = Math.min(100, Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100));

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="h6">{t('microStep.timerTitle')}</Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={100} size={176} thickness={4} sx={{ color: 'action.hover' }} />
            <CircularProgress variant="determinate" value={progress} size={176} thickness={4} sx={{ position: 'absolute', left: 0 }} />
            <Box sx={{ inset: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4" component="span">
                {minutes}:{String(seconds).padStart(2, '0')}
              </Typography>
            </Box>
          </Box>
          {completed && <Alert severity="success" sx={{ width: '100%' }}>{t('microStep.timerComplete')}</Alert>}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="contained" onClick={start} disabled={isRunning || completed}>
              {t('microStep.start')}
            </Button>
            <Button variant="outlined" onClick={pause} disabled={!isRunning}>
              {t('microStep.pause')}
            </Button>
            <Button variant="text" onClick={reset}>{t('microStep.reset')}</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
