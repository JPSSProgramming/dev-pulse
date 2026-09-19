import { useMemo, useState } from 'react';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { Snippet, SnippetLanguage } from '../../types/snippet';

interface SnippetsVaultProps {
  snippets: Snippet[];
  onSnippetsChange: (snippets: Snippet[]) => void;
}

const languages: SnippetLanguage[] = ['typescript', 'javascript', 'python', 'go', 'java', 'css', 'html', 'other'];

export const SnippetsVault = ({ snippets, onSnippetsChange }: SnippetsVaultProps) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<SnippetLanguage>('typescript');
  const [code, setCode] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const requiredTag = tagFilter.trim().toLowerCase();

    return snippets.filter((snippet) => {
      const tagsJoined = snippet.tags.join(' ').toLowerCase();
      const searchMatch = !searchText || snippet.title.toLowerCase().includes(searchText) || snippet.language.toLowerCase().includes(searchText) || tagsJoined.includes(searchText);
      const tagMatch = !requiredTag || snippet.tags.some((tag) => tag.toLowerCase().includes(requiredTag));
      return searchMatch && tagMatch;
    });
  }, [snippets, search, tagFilter]);

  const addSnippet = () => {
    const trimmedTitle = title.trim();
    const trimmedCode = code.trim();

    if (!trimmedTitle || !trimmedCode) {
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const next: Snippet = {
      id: Date.now(),
      title: trimmedTitle,
      language,
      code: trimmedCode,
      tags,
    };

    onSnippetsChange([next, ...snippets]);
    setTitle('');
    setLanguage('typescript');
    setCode('');
    setTagsInput('');
  };

  const deleteSnippet = (id: number) => {
    onSnippetsChange(snippets.filter((snippet) => snippet.id !== id));
  };

  const copyCode = async (id: number, snippetCode: string) => {
    await navigator.clipboard.writeText(snippetCode);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1200);
  };

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Snippets Vault</Typography>
          <Stack spacing={1.2}>
            <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} fullWidth />
            <TextField select label="Language" value={language} onChange={(event) => setLanguage(event.target.value as SnippetLanguage)} fullWidth>
              {languages.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </TextField>
            <TextField label="Code" value={code} onChange={(event) => setCode(event.target.value)} multiline minRows={6} fullWidth />
            <TextField label="Tags (comma separated)" value={tagsInput} onChange={(event) => setTagsInput(event.target.value)} fullWidth />
            <Button variant="contained" onClick={addSnippet} disabled={!title.trim() || !code.trim()}>Save snippet</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
            <TextField label="Search snippets" value={search} onChange={(event) => setSearch(event.target.value)} fullWidth />
            <TextField label="Filter by tag" value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} fullWidth />
          </Stack>
        </CardContent>
      </Card>

      {snippets.length === 0 ? (
        <Card><CardContent><Typography color="text.secondary">No snippets yet. Save your first useful piece of code.</Typography></CardContent></Card>
      ) : filtered.length === 0 ? (
        <Alert severity="info">No snippets match your search.</Alert>
      ) : (
        <Stack spacing={1.2}>
          {filtered.map((snippet) => (
            <Card key={snippet.id}>
              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between' }} spacing={1}>
                  <Box>
                    <Typography variant="h6">{snippet.title}</Typography>
                    <Stack direction="row" spacing={0.8} sx={{ mt: 0.8, flexWrap: 'wrap' }}>
                      <Chip label={snippet.language} size="small" color="primary" variant="outlined" />
                      {snippet.tags.map((tag) => <Chip key={`${snippet.id}-${tag}`} label={tag} size="small" />)}
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={0.8}>
                    <Button size="small" startIcon={<ContentCopyRoundedIcon />} onClick={() => copyCode(snippet.id, snippet.code)}>
                      {copiedId === snippet.id ? 'Copied' : 'Copy code'}
                    </Button>
                    <IconButton color="error" onClick={() => deleteSnippet(snippet.id)}>
                      <DeleteRoundedIcon />
                    </IconButton>
                  </Stack>
                </Stack>
                <Box component="pre" sx={{ mt: 1.2, p: 1.5, borderRadius: 1.5, bgcolor: 'action.hover', overflowX: 'auto', fontSize: 13, whiteSpace: 'pre-wrap' }}>
                  {snippet.code}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
