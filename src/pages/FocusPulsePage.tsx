import { useEffect } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import type { TimerSnapshot } from '../context/AppStateContext';
import { useTranslation } from '../i18n/I18nProvider';

interface FocusPulsePageProps {
  snapshot: TimerSnapshot;
  onSnapshotChange: (snapshot: TimerSnapshot) => void;
}

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const getDefaultsForMode = (mode: TimerSnapshot['mode']) => {
  const total = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
  return { totalSeconds: total, remainingSeconds: total };
};

export const FocusPulsePage = ({ snapshot, onSnapshotChange }: FocusPulsePageProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!snapshot.isRunning || !snapshot.startedAt) return undefined;

    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - snapshot.startedAt!) / 1000);
      const remaining = Math.max(0, snapshot.remainingSeconds - elapsed);
      if (remaining <= 0) {
        const nextMode: TimerSnapshot['mode'] = snapshot.mode === 'focus' ? 'break' : 'focus';
        onSnapshotChange({ mode: nextMode, ...getDefaultsForMode(nextMode), isRunning: false });
        return;
      }
      onSnapshotChange({ ...snapshot, remainingSeconds: remaining, startedAt: Date.now() });
    }, 1000);

    return () => window.clearInterval(id);
  }, [onSnapshotChange, snapshot]);

  const minutes = Math.floor(snapshot.remainingSeconds / 60);
  const seconds = snapshot.remainingSeconds % 60;
  const progress = snapshot.totalSeconds > 0
    ? Math.min(100, Math.max(0, ((snapshot.totalSeconds - snapshot.remainingSeconds) / snapshot.totalSeconds) * 100))
    : 0;
  const start = () => onSnapshotChange({ ...snapshot, isRunning: true, startedAt: Date.now() });
  const pause = () => {
    if (!snapshot.startedAt) return;
    const elapsed = Math.floor((Date.now() - snapshot.startedAt) / 1000);
    onSnapshotChange({ ...snapshot, remainingSeconds: Math.max(0, snapshot.remainingSeconds - elapsed), isRunning: false, startedAt: undefined });
  };
  const reset = () => onSnapshotChange({ ...getDefaultsForMode(snapshot.mode), mode: snapshot.mode, isRunning: false });

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="h5">{t('timer.title')}</Typography>
          <Typography color="text.secondary">{t('timer.mode')}: {snapshot.mode === 'focus' ? t('timer.focus') : t('timer.break')}</Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={100} size={180} thickness={4} color="inherit" sx={{ color: 'action.hover' }} />
            <CircularProgress variant="determinate" value={progress} size={180} thickness={4} sx={{ position: 'absolute', left: 0 }} />
            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4">{minutes}:{String(seconds).padStart(2, '0')}</Typography>
            </Box>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ width: '100%', justifyContent: 'center' }}>
            <Button variant="contained" onClick={start} disabled={snapshot.isRunning} fullWidth>{t('timer.start')}</Button>
            <Button variant="outlined" onClick={pause} disabled={!snapshot.isRunning} fullWidth>{t('timer.pause')}</Button>
            <Button variant="text" onClick={reset} fullWidth>{t('timer.reset')}</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
