import { useMemo, useState } from 'react';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { devNexusFiles, useAppState } from '../context/AppStateContext';
import type { ReviewFinding, ReviewSeverity } from '../types/devNexus';

const severityColor: Record<ReviewSeverity, 'error' | 'warning' | 'info'> = {
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const reviewFile = (fileId: string): ReviewFinding[] => {
  if (fileId === 'api') {
    return [
      { id: 'api-security', severity: 'warning', title: 'Перевіряйте HTTP-відповідь', description: 'Виклик fetch має перевіряти response.ok перед читанням JSON.', line: 3 },
      { id: 'api-input', severity: 'error', title: 'Безпечне формування URL', description: 'Використовуйте URLSearchParams або encodeURIComponent для значень, що приходять від користувача.', line: 2 },
    ];
  }
  if (fileId === 'utils') {
    return [
      { id: 'date-invalid', severity: 'warning', title: 'Обробіть некоректну дату', description: 'Invalid Date може потрапити до форматера. Додайте guard перед форматуванням.', line: 2 },
      { id: 'date-clarity', severity: 'info', title: 'Задайте локаль явно', description: 'Явна локаль робить результат стабільним між середовищами.', line: 2 },
    ];
  }
  return [
    { id: 'app-memo', severity: 'info', title: 'Мемоізація може бути зайвою', description: 'Для простого виклику loadItems useMemo не обов’язковий. Залишайте його, якщо обчислення справді важке.', line: 4 },
    { id: 'app-error', severity: 'warning', title: 'Додайте стан помилки', description: 'Покажіть користувачу зрозумілий стан, якщо завантаження елементів завершиться помилкою.', line: 4 },
  ];
};

export const DevNexusPage = () => {
  const {
    activeFile, setActiveFile, isSidebarOpen, setIsSidebarOpen,
    reviewResults, setReviewResults,
  } = useAppState();
  const [reviewTab, setReviewTab] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const file = useMemo(
    () => devNexusFiles.find((item) => item.id === activeFile) ?? devNexusFiles[0],
    [activeFile],
  );
  const findings = reviewResults[file.id] ?? [];

  const runReview = () => {
    setReviewResults({ ...reviewResults, [file.id]: reviewFile(file.id) });
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setComments([...comments, comment.trim()]);
    setComment('');
  };

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }} spacing={1}>
        <Box>
          <Typography variant="h4">DevNexus Workspace</Typography>
          <Typography color="text.secondary">Інтерактивний перегляд коду та AI Code Review</Typography>
        </Box>
        <Button variant="contained" startIcon={<AutoAwesomeRoundedIcon />} onClick={runReview}>
          Запустити AI Review
        </Button>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: `${isSidebarOpen ? '230px ' : ''}minmax(0, 1fr) 360px` }, gap: 1.5 }}>
        {isSidebarOpen && (
          <Card sx={{ minWidth: 0 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Файли проєкту</Typography>
                <IconButton size="small" onClick={() => setIsSidebarOpen(false)} aria-label="Згорнути файли">×</IconButton>
              </Stack>
              <Divider />
              <List dense>
                {devNexusFiles.map((item) => (
                  <ListItemButton key={item.id} selected={item.id === file.id} onClick={() => setActiveFile(item.id)} sx={{ borderRadius: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 34 }}><CodeRoundedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary={item.name} secondary={item.path} />
                  </ListItemButton>
                ))}
              </List>
              <Divider />
              <Button fullWidth size="small" startIcon={<SettingsRoundedIcon />} sx={{ mt: 1 }}>Налаштування</Button>
            </CardContent>
          </Card>
        )}

        <Card sx={{ minWidth: 0 }}>
          <CardContent>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Box>
                {!isSidebarOpen && <Button size="small" onClick={() => setIsSidebarOpen(true)}>Показати файли</Button>}
                <Typography variant="h6">{file.name}</Typography>
                <Typography variant="caption" color="text.secondary">{file.path} · {file.language}</Typography>
              </Box>
              <Stack direction="row">
                <IconButton color="primary" aria-label="Запустити код"><PlayArrowRoundedIcon /></IconButton>
                <IconButton aria-label="Оновити"><RefreshRoundedIcon /></IconButton>
              </Stack>
            </Stack>
            <Paper variant="outlined" sx={{ bgcolor: 'grey.950', color: 'grey.100', overflow: 'auto', p: 2, minHeight: 360 }}>
              <Box component="pre" sx={{ m: 0, fontFamily: 'monospace', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {file.code.split('\n').map((line, index) => (
                  <Box component="div" key={`${file.id}-${index}`} sx={{ display: 'grid', gridTemplateColumns: '36px 1fr' }}>
                    <Box component="span" sx={{ color: 'grey.600', userSelect: 'none' }}>{index + 1}</Box>
                    <Box component="span">{line || ' '}</Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 0 }}>
          <CardContent>
            <Tabs value={reviewTab} onChange={(_, value: number) => setReviewTab(value)} variant="fullWidth">
              <Tab icon={<BugReportRoundedIcon />} iconPosition="start" label="AI Аналіз" />
              <Tab icon={<ChatBubbleOutlineRoundedIcon />} iconPosition="start" label="Коментарі" />
            </Tabs>
            {reviewTab === 0 ? (
              <Stack spacing={1.2} sx={{ mt: 2 }}>
                {findings.length === 0 ? (
                  <Alert severity="info">Натисніть «Запустити AI Review», щоб проаналізувати файл.</Alert>
                ) : findings.map((finding) => (
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
    </Stack>
  );
};
