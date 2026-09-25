import { createFileRoute } from '@tanstack/react-router';
import { MicroStepPage } from '../pages/MicroStepPage';

export const Route = createFileRoute('/micro-step')({
  component: MicroStepPage,
});
