/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router';
import { FocusPulsePage } from '../pages/FocusPulsePage';
import { useAppState } from '../context/AppStateContext';

export const Route = createFileRoute('/focus-pulse')({
  component: FocusPulseRoute,
});

function FocusPulseRoute() {
  const { timerSnapshot, setTimerSnapshot } = useAppState();
  return <FocusPulsePage snapshot={timerSnapshot} onSnapshotChange={setTimerSnapshot} />;
}
