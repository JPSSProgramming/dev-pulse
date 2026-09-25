/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Dashboard } from '../pages/Dashboard';
import { useAppState } from '../context/AppStateContext';

export const Route = createFileRoute('/')({
  component: DashboardRoute,
});

function DashboardRoute() {
  const navigate = useNavigate();
  const { tasks, snippets, timerSnapshot } = useAppState();

  return (
    <Dashboard
      totalTasks={tasks.length}
      completedTasks={tasks.filter((task) => task.completed).length}
      snippetCount={snippets.length}
      timerSnapshot={timerSnapshot}
      onGoToGoals={() => void navigate({ to: '/daily-goals' })}
      onGoToFocus={() => void navigate({ to: '/focus-pulse' })}
      onGoToSnippets={() => void navigate({ to: '/snippets-vault' })}
    />
  );
}
