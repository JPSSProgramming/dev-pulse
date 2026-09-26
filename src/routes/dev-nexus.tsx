import { createFileRoute } from '@tanstack/react-router';
import { DevNexusPage } from '../pages/DevNexusPage';

export const Route = createFileRoute('/dev-nexus')({
  component: DevNexusPage,
});
