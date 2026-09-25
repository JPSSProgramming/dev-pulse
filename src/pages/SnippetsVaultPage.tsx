import { useMemo, useState } from 'react';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Alert, Box, Button, Card, CardContent, Chip, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import type { Snippet, SnippetLanguage } from '../types/snippet';
import { useTranslation } from '../i18n/I18nProvider';

interface SnippetsVaultPageProps {
  snippets: Snippet[];
  onSnippetsChange: (snippets: Snippet[]) => void;
}

const languages: SnippetLanguage[] = ['typescript', 'javascript', 'python', 'go', 'java', 'css', 'html', 'other'];

export const SnippetsVaultPage = ({ snippets, onSnippetsChange }: SnippetsVaultPageProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<SnippetLanguage>('typescript');
  const [code, setCode] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copyError, setCopyError] = useState(false);

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
    if (!trimmedTitle || !trimmedCode) return;

    onSnippetsChange([{
      id: snippets.reduce((highest, snippet) => Math.max(highest, snippet.id), 0) + 1,
      title: trimmedTitle,
      language,
      code: trimmedCode,
      tags: tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean),
    }, ...snippets]);
    setTitle('');
    setLanguage('typescript');
    setCode('');
    setTagsInput('');
  };

  const copyCode = async (id: number, snippetCode: string) => {
    try {
      await navigator.clipboard.writeText(snippetCode);
      setCopyError(false);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1200);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>{t('snippets.title')}</Typography>
          <Stack spacing={1.2}>
            <TextField label={t('snippets.snippetTitle')} value={title} onChange={(event) => setTitle(event.target.value)} fullWidth />
            <TextField select label={t('snippets.language')} value={language} onChange={(event) => setLanguage(event.target.value as SnippetLanguage)} fullWidth>
              {languages.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </TextField>
            <TextField label={t('snippets.code')} value={code} onChange={(event) => setCode(event.target.value)} multiline minRows={6} fullWidth />
            <TextField label={t('snippets.tags')} value={tagsInput} onChange={(event) => setTagsInput(event.target.value)} fullWidth />
            <Button variant="contained" onClick={addSnippet} disabled={!title.trim() || !code.trim()}>{t('snippets.save')}</Button>
          </Stack>
        </CardContent>
      </Card>
      {copyError && <Alert severity="warning">{t('snippets.copyError')}</Alert>}
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
            <TextField label={t('snippets.search')} value={search} onChange={(event) => setSearch(event.target.value)} fullWidth />
            <TextField label={t('snippets.filterTag')} value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} fullWidth />
          </Stack>
        </CardContent>
      </Card>
      {snippets.length === 0 ? (
        <Card><CardContent><Typography color="text.secondary">{t('snippets.empty')}</Typography></CardContent></Card>
      ) : filtered.length === 0 ? (
        <Alert severity="info">{t('snippets.noMatches')}</Alert>
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
                    <Button size="small" startIcon={<ContentCopyRoundedIcon />} onClick={() => void copyCode(snippet.id, snippet.code)}>
                      {copiedId === snippet.id ? t('snippets.copied') : t('snippets.copy')}
                    </Button>
                    <IconButton color="error" aria-label={t('snippets.delete')} onClick={() => onSnippetsChange(snippets.filter((item) => item.id !== snippet.id))}>
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
