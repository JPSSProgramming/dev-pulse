/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router';
import { MicroStepGoalDetailsPage } from '../pages/MicroStepGoalDetailsPage.tsx';

export const Route = createFileRoute('/micro-step/$goalId')({
  component: MicroStepGoalDetailsRoute,
});

function MicroStepGoalDetailsRoute() {
  return <MicroStepGoalDetailsPage />;
}
