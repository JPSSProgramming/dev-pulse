/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router';
import { SnippetsVaultPage } from '../pages/SnippetsVaultPage';
import { useAppState } from '../context/AppStateContext';

export const Route = createFileRoute('/snippets-vault')({
  component: SnippetsVaultRoute,
});

function SnippetsVaultRoute() {
  const { snippets, setSnippets } = useAppState();
  return <SnippetsVaultPage snippets={snippets} onSnippetsChange={setSnippets} />;
}
