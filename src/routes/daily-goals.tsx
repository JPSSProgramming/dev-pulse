/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router';
import { DailyGoalsPage } from '../pages/DailyGoalsPage';
import { useAppState } from '../context/AppStateContext';

export const Route = createFileRoute('/daily-goals')({
  component: DailyGoalsRoute,
});

function DailyGoalsRoute() {
  const { tasks, setTasks } = useAppState();
  return <DailyGoalsPage tasks={tasks} onTasksChange={setTasks} />;
}
