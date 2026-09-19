import { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';

import type { TimerSnapshot } from '../../App';

interface FocusTimerProps {
  snapshot: TimerSnapshot;
  onSnapshotChange: (snapshot: TimerSnapshot) => void;
}

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const getDefaultsForMode = (mode: TimerSnapshot['mode']) => {
  const total = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
  return { totalSeconds: total, remainingSeconds: total };
};

export const FocusTimer = ({ snapshot, onSnapshotChange }: FocusTimerProps) => {
  useEffect(() => {
    if (!snapshot.isRunning) {
      return;
    }

    const id = window.setInterval(() => {
      if (snapshot.remainingSeconds <= 1) {
        const nextMode: TimerSnapshot['mode'] = snapshot.mode === 'focus' ? 'break' : 'focus';
        const next = getDefaultsForMode(nextMode);
        onSnapshotChange({ mode: nextMode, ...next, isRunning: false });
        return;
      }

      onSnapshotChange({ ...snapshot, remainingSeconds: snapshot.remainingSeconds - 1 });
    }, 1000);

    return () => window.clearInterval(id);
  }, [snapshot, onSnapshotChange]);

  const minutes = Math.floor(snapshot.remainingSeconds / 60);
  const seconds = snapshot.remainingSeconds % 60;
  const progress = ((snapshot.totalSeconds - snapshot.remainingSeconds) / snapshot.totalSeconds) * 100;

  const reset = () => {
    const defaults = getDefaultsForMode(snapshot.mode);
    onSnapshotChange({ ...defaults, mode: snapshot.mode, isRunning: false });
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="h5">Focus Pulse</Typography>
          <Typography color="text.secondary">Mode: {snapshot.mode === 'focus' ? 'Focus' : 'Break'}</Typography>

          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={100} size={180} thickness={4} color="inherit" sx={{ color: 'action.hover' }} />
            <CircularProgress variant="determinate" value={progress} size={180} thickness={4} sx={{ position: 'absolute', left: 0 }} />
            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4">{minutes}:{String(seconds).padStart(2, '0')}</Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.2}>
            <Button variant="contained" onClick={() => onSnapshotChange({ ...snapshot, isRunning: true })} disabled={snapshot.isRunning}>Start</Button>
            <Button variant="outlined" onClick={() => onSnapshotChange({ ...snapshot, isRunning: false })} disabled={!snapshot.isRunning}>Pause</Button>
            <Button variant="text" onClick={reset}>Reset</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
