import { useMemo, useState } from 'react';
import { basicSetup } from 'codemirror';
import type { Extension } from '@codemirror/state';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { useAppState } from '../context/AppStateContext';
import type { DevNexusEditorSettings, DevNexusFile, ReviewFinding, ReviewSeverity } from '../types/devNexus';

const severityColor: Record<ReviewSeverity, 'error' | 'warning' | 'info'> = {
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const reviewFile = (fileId: string, code: string): ReviewFinding[] => {
  const findings: ReviewFinding[] = [];
  if (code.includes('console.log')) {
    findings.push({ id: `${fileId}-console-log`, severity: 'info', title: 'Знайдено console.log', description: 'Перед production-збіркою перевірте, чи потрібен цей лог.' });
  }
  if (code.includes('any')) {
    findings.push({ id: `${fileId}-explicit-any`, severity: 'warning', title: 'Уникайте explicit any', description: 'Спробуйте описати точніший тип для покращення type safety.' });
  }
  if (fileId === 'api') {
    findings.push(
      { id: 'api-security', severity: 'warning', title: 'Перевіряйте HTTP-відповідь', description: 'Виклик fetch має перевіряти response.ok перед читанням JSON.', line: 3 },
      { id: 'api-input', severity: 'error', title: 'Безпечне формування URL', description: 'Використовуйте URLSearchParams або encodeURIComponent для значень, що приходять від користувача.', line: 2 },
    );
  }
  if (fileId === 'utils') {
    findings.push(
      { id: 'date-invalid', severity: 'warning', title: 'Обробіть некоректну дату', description: 'Invalid Date може потрапити до форматера. Додайте guard перед форматуванням.', line: 2 },
      { id: 'date-clarity', severity: 'info', title: 'Задайте локаль явно', description: 'Явна локаль робить результат стабільним між середовищами.', line: 2 },
    );
  }
  if (fileId === 'app') {
    findings.push(
      { id: 'app-memo', severity: 'info', title: 'Мемоізація може бути зайвою', description: 'Для простого виклику loadItems useMemo не обов’язковий. Залишайте його, якщо обчислення справді важке.', line: 4 },
      { id: 'app-error', severity: 'warning', title: 'Додайте стан помилки', description: 'Покажіть користувачу зрозумілий стан, якщо завантаження елементів завершиться помилкою.', line: 4 },
    );
  }
  return findings;
};

const extensionFor = (language: DevNexusFile['language']) => {
  if (language === 'python') return python();
  if (language === 'css') return css();
  return javascript({ typescript: language === 'typescript' });
};

const getExtension = (language: DevNexusFile['language']) => {
  if (language === 'python') return '.py';
  if (language === 'css') return '.css';
  return language === 'typescript' ? '.ts' : '.js';
};

const createFileId = () => `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const DevNexusPage = () => {
  const {
    devNexusFiles,
    setDevNexusFiles,
    openFileIds,
    setOpenFileIds,
    editorSettings,
    setEditorSettings,
    activeFile,
    setActiveFile,
    isSidebarOpen,
    setIsSidebarOpen,
    reviewResults,
    setReviewResults,
  } = useAppState();
  const [reviewTab, setReviewTab] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<'create' | 'rename' | 'settings' | 'delete' | null>(null);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState<DevNexusFile['language']>('typescript');
  const [settingsDraft, setSettingsDraft] = useState(editorSettings);
  const file = useMemo(
    () => devNexusFiles.find((item) => item.id === activeFile) ?? devNexusFiles[0],
    [activeFile, devNexusFiles],
  );
  const openFiles = useMemo(
    () => openFileIds.map((id) => devNexusFiles.find((item) => item.id === id)).filter((item): item is DevNexusFile => Boolean(item)),
    [devNexusFiles, openFileIds],
  );
  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? devNexusFiles.filter((item) => `${item.name} ${item.path}`.toLowerCase().includes(query))
      : devNexusFiles;
  }, [devNexusFiles, search]);
  const extensions = useMemo(() => {
    const result: Extension[] = [
      basicSetup,
      extensionFor(file?.language ?? 'typescript'),
      EditorState.tabSize.of(editorSettings.tabSize),
    ];
    if (editorSettings.showLineNumbers) result.push(lineNumbers());
    if (editorSettings.wordWrap === 'on') result.push(EditorView.lineWrapping);
    return result;
  }, [editorSettings, file?.language]);
  const findings = file ? reviewResults[file.id] ?? [] : [];

  const selectFile = (fileId: string) => {
    setActiveFile(fileId);
    if (!openFileIds.includes(fileId)) setOpenFileIds([...openFileIds, fileId]);
  };

  const updateCode = (code: string) => {
    if (!file) return;
    setDevNexusFiles(devNexusFiles.map((item) => item.id === file.id ? { ...item, code } : item));
  };

  const createFile = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const fileName = trimmedName.includes('.') ? trimmedName : `${trimmedName}${getExtension(language)}`;
    const newFile: DevNexusFile = {
      id: createFileId(),
      name: fileName,
      language,
      path: `src/${fileName}`,
      code: '',
    };
    setDevNexusFiles([...devNexusFiles, newFile]);
    setOpenFileIds([...openFileIds, newFile.id]);
    setActiveFile(newFile.id);
    setName('');
    setDialog(null);
  };

  const renameFile = () => {
    if (!file || !name.trim()) return;
    const nextName = name.trim();
    setDevNexusFiles(devNexusFiles.map((item) => item.id === file.id
      ? { ...item, name: nextName, path: item.path.slice(0, item.path.lastIndexOf('/') + 1) + nextName }
      : item));
    setName('');
    setDialog(null);
  };

  const deleteFile = () => {
    if (!file) return;
    const remaining = devNexusFiles.filter((item) => item.id !== file.id);
    const nextId = remaining[0]?.id ?? '';
    setDevNexusFiles(remaining);
    setOpenFileIds(openFileIds.filter((id) => id !== file.id));
    setReviewResults(Object.fromEntries(Object.entries(reviewResults).filter(([id]) => id !== file.id)));
    setActiveFile(nextId);
    setDialog(null);
  };

  const runReview = () => {
    if (file) setReviewResults({ ...reviewResults, [file.id]: reviewFile(file.id, file.code) });
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setComments([...comments, comment.trim()]);
    setComment('');
  };

  const openSettings = () => {
    setSettingsDraft(editorSettings);
    setDialog('settings');
  };

  const saveSettings = () => {
    setEditorSettings(settingsDraft);
    setDialog(null);
  };

  if (!file) return <Alert severity="info">У workspace ще немає файлів.</Alert>;

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }} spacing={1}>
        <Box>
          <Typography variant="h4">DevNexus Workspace</Typography>
          <Typography color="text.secondary">Редагуйте файли, перемикайте вкладки та зберігайте workspace локально.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<SettingsRoundedIcon />} onClick={openSettings}>Налаштування</Button>
          <Button variant="contained" startIcon={<AutoAwesomeRoundedIcon />} onClick={runReview}>Запустити Review</Button>
        </Stack>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: `${isSidebarOpen ? '250px ' : ''}minmax(0, 1fr) 360px` }, gap: 1.5 }}>
        {isSidebarOpen && (
          <Card sx={{ minWidth: 0 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Файли проєкту</Typography>
                <IconButton size="small" onClick={() => setIsSidebarOpen(false)} aria-label="Згорнути файли"><CloseRoundedIcon fontSize="small" /></IconButton>
              </Stack>
              <TextField
                size="small"
                fullWidth
                placeholder="Пошук файлів..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                slotProps={{ input: { startAdornment: <SearchRoundedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> } }}
              />
              <Button fullWidth size="small" startIcon={<AddRoundedIcon />} onClick={() => { setName(''); setDialog('create'); }} sx={{ my: 1 }}>Новий файл</Button>
              <Divider />
              <List dense>
                {filteredFiles.map((item) => (
                  <ListItemButton key={item.id} selected={item.id === file.id} onClick={() => selectFile(item.id)} sx={{ borderRadius: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 34 }}><CodeRoundedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary={item.name} secondary={item.path} />
                    <IconButton size="small" onClick={(event) => { event.stopPropagation(); setName(item.name); setActiveFile(item.id); setDialog('rename'); }} aria-label={`Перейменувати ${item.name}`}><EditRoundedIcon fontSize="small" /></IconButton>
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        <Card sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Stack direction="row" spacing={0.5} sx={{ overflowX: 'auto', mb: 1 }}>
              {!isSidebarOpen && <Button size="small" onClick={() => setIsSidebarOpen(true)}>Файли</Button>}
              {openFiles.map((item) => (
                <Button
                  key={item.id}
                  size="small"
                  variant={item.id === file.id ? 'contained' : 'text'}
                  onClick={() => setActiveFile(item.id)}
                  endIcon={<CloseRoundedIcon fontSize="small" onClick={(event) => {
                    event.stopPropagation();
                    const nextOpen = openFileIds.filter((id) => id !== item.id);
                    setOpenFileIds(nextOpen);
                    if (item.id === file.id) setActiveFile(nextOpen[nextOpen.length - 1] ?? devNexusFiles[0]?.id ?? '');
                  }} />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {item.name}
                </Button>
              ))}
            </Stack>
            <Divider sx={{ mb: 1.5 }} />
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="h6">{file.name}</Typography>
                <Typography variant="caption" color="text.secondary">{file.path} · {file.language}</Typography>
              </Box>
              <Stack direction="row">
                <IconButton color="primary" aria-label="Перейменувати файл" onClick={() => { setName(file.name); setDialog('rename'); }}><EditRoundedIcon /></IconButton>
                <IconButton color="error" aria-label="Видалити файл" onClick={() => setDialog('delete')}><DeleteRoundedIcon /></IconButton>
              </Stack>
            </Stack>
            <Paper variant="outlined" sx={{ overflow: 'hidden', bgcolor: editorSettings.theme === 'dark' ? '#282c34' : '#fff' }}>
              <CodeMirror
                value={file.code}
                height="480px"
                theme={editorSettings.theme === 'dark' ? oneDark : undefined}
                extensions={extensions}
                onChange={updateCode}
                basicSetup={false}
                style={{ fontSize: editorSettings.fontSize }}
                indentWithTab
              />
            </Paper>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 0 }}>
          <CardContent>
            <Tabs value={reviewTab} onChange={(_, value: number) => setReviewTab(value)} variant="fullWidth">
              <Tab icon={<BugReportRoundedIcon />} iconPosition="start" label="Аналіз" />
              <Tab icon={<ChatBubbleOutlineRoundedIcon />} iconPosition="start" label="Коментарі" />
            </Tabs>
            {reviewTab === 0 ? (
              <Stack spacing={1.2} sx={{ mt: 2 }}>
                {findings.length === 0 ? <Alert severity="info">Натисніть «Запустити Review», щоб проаналізувати файл.</Alert> : findings.map((finding) => (
                  <Alert key={finding.id} severity={severityColor[finding.severity]} icon={false}>
                    <Stack spacing={0.5}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 700 }}>{finding.title}</Typography>
                        {finding.line && <Chip label={`рядок ${finding.line}`} size="small" />}
                      </Stack>
                      <Typography variant="body2">{finding.description}</Typography>
                    </Stack>
                  </Alert>
                ))}
              </Stack>
            ) : (
              <Stack spacing={1.2} sx={{ mt: 2 }}>
                <TextField multiline minRows={3} placeholder="Залиште коментар до коду..." value={comment} onChange={(event) => setComment(event.target.value)} />
                <Button variant="outlined" onClick={addComment} disabled={!comment.trim()}>Додати коментар</Button>
                {comments.map((item, index) => <Card variant="outlined" key={`${item}-${index}`}><CardContent sx={{ p: 1.5 }}>{item}</CardContent></Card>)}
                {comments.length === 0 && <Typography variant="body2" color="text.secondary">Коментарів ще немає.</Typography>}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>

      <Dialog open={dialog === 'create'} onClose={() => setDialog(null)} fullWidth maxWidth="xs">
        <DialogTitle>Створити файл</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField autoFocus label="Назва файлу" value={name} onChange={(event) => setName(event.target.value)} placeholder="наприклад, helpers" />
            <TextField select label="Мова" value={language} onChange={(event) => setLanguage(event.target.value as DevNexusFile['language'])}>
              <MenuItem value="typescript">TypeScript</MenuItem><MenuItem value="javascript">JavaScript</MenuItem><MenuItem value="python">Python</MenuItem><MenuItem value="css">CSS</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setDialog(null)}>Скасувати</Button><Button onClick={createFile} variant="contained" disabled={!name.trim()}>Створити</Button></DialogActions>
      </Dialog>
      <Dialog open={dialog === 'rename'} onClose={() => setDialog(null)} fullWidth maxWidth="xs">
        <DialogTitle>Перейменувати файл</DialogTitle>
        <DialogContent><TextField autoFocus fullWidth label="Нова назва" value={name} onChange={(event) => setName(event.target.value)} sx={{ mt: 1 }} /></DialogContent>
        <DialogActions><Button onClick={() => setDialog(null)}>Скасувати</Button><Button onClick={renameFile} variant="contained" disabled={!name.trim()}>Зберегти</Button></DialogActions>
      </Dialog>
      <Dialog open={dialog === 'delete'} onClose={() => setDialog(null)} fullWidth maxWidth="xs">
        <DialogTitle>Видалити файл?</DialogTitle>
        <DialogContent><Typography>Файл «{file.name}» і його review-результати будуть видалені з workspace.</Typography></DialogContent>
        <DialogActions><Button onClick={() => setDialog(null)}>Скасувати</Button><Button onClick={deleteFile} color="error" variant="contained">Видалити</Button></DialogActions>
      </Dialog>
      <Dialog open={dialog === 'settings'} onClose={() => setDialog(null)} fullWidth maxWidth="xs">
        <DialogTitle>Налаштування редактора</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField select label="Розмір шрифту" value={settingsDraft.fontSize} onChange={(event) => setSettingsDraft({ ...settingsDraft, fontSize: Number(event.target.value) })}>
              {[12, 14, 16, 18, 20].map((size) => <MenuItem key={size} value={size}>{size}px</MenuItem>)}
            </TextField>
            <TextField select label="Розмір tab" value={settingsDraft.tabSize} onChange={(event) => setSettingsDraft({ ...settingsDraft, tabSize: Number(event.target.value) as 2 | 4 })}>
              <MenuItem value={2}>2 пробіли</MenuItem><MenuItem value={4}>4 пробіли</MenuItem>
            </TextField>
            <TextField select label="Тема" value={settingsDraft.theme} onChange={(event) => setSettingsDraft({ ...settingsDraft, theme: event.target.value as DevNexusEditorSettings['theme'] })}>
              <MenuItem value="dark">Темна</MenuItem><MenuItem value="light">Світла</MenuItem>
            </TextField>
            <FormControlLabel control={<Switch checked={settingsDraft.wordWrap === 'on'} onChange={(event) => setSettingsDraft({ ...settingsDraft, wordWrap: event.target.checked ? 'on' : 'off' })} />} label="Перенесення довгих рядків" />
            <FormControlLabel control={<Switch checked={settingsDraft.showLineNumbers} onChange={(event) => setSettingsDraft({ ...settingsDraft, showLineNumbers: event.target.checked })} />} label="Показувати номери рядків" />
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setDialog(null)}>Скасувати</Button><Button onClick={saveSettings} variant="contained">Зберегти</Button></DialogActions>
      </Dialog>
    </Stack>
  );
};
