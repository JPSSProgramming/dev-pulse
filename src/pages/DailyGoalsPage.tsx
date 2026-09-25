import { useState } from 'react';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Task, TaskCategory, TaskPriority } from '../types/task';
import { useTranslation } from '../i18n/I18nProvider';

interface DailyGoalsPageProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

type StatusFilter = 'all' | 'active' | 'completed';
type PriorityFilter = 'all' | TaskPriority;

const priorities: TaskPriority[] = ['low', 'medium', 'high'];
const categories: TaskCategory[] = ['code', 'study', 'rest'];

export const DailyGoalsPage = ({ tasks, onTasksChange }: DailyGoalsPageProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('code');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  const completedCount = tasks.filter((task) => task.completed).length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !task.completed) ||
      (statusFilter === 'completed' && task.completed);
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const addTask = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    onTasksChange([
      { id: Date.now(), title: trimmed, priority, category, completed: false },
      ...tasks,
    ]);
    setTitle('');
    setPriority('medium');
    setCategory('code');
  };

  const toggleTask = (id: number) => {
    onTasksChange(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id: number) => {
    onTasksChange(tasks.filter((task) => task.id !== id));
  };

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>{t('tasks.title')}</Typography>
          <Stack spacing={1.2}>
            <Typography variant="body2" color="text.secondary">
              {t('tasks.progress')}: {completedCount}/{tasks.length} ({progressPercent}%)
            </Typography>
            <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4 }} />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.2}>
            <Typography variant="h6">{t('tasks.addTask')}</Typography>
            <TextField label={t('tasks.taskTitle')} value={title} onChange={(event) => setTitle(event.target.value)} fullWidth required />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
              <TextField select label={t('tasks.priority')} value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)} fullWidth>
                {priorities.map((item) => <MenuItem key={item} value={item}>{t(`tasks.priorityValues.${item}`)}</MenuItem>)}
              </TextField>
              <TextField select label={t('tasks.category')} value={category} onChange={(event) => setCategory(event.target.value as TaskCategory)} fullWidth>
                {categories.map((item) => <MenuItem key={item} value={item}>{t(`tasks.categoryValues.${item}`)}</MenuItem>)}
              </TextField>
            </Stack>
            <Button variant="contained" onClick={addTask} disabled={!title.trim()}>{t('tasks.create')}</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.2}>
            <Typography variant="h6">{t('tasks.filters')}</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
              <TextField select label={t('tasks.status')} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} fullWidth>
                <MenuItem value="all">{t('tasks.all')}</MenuItem>
                <MenuItem value="active">{t('tasks.active')}</MenuItem>
                <MenuItem value="completed">{t('tasks.completed')}</MenuItem>
              </TextField>
              <TextField select label={t('tasks.priority')} value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as PriorityFilter)} fullWidth>
                <MenuItem value="all">{t('tasks.allPriorities')}</MenuItem>
                {priorities.map((item) => <MenuItem key={item} value={item}>{t(`tasks.priorityValues.${item}`)}</MenuItem>)}
              </TextField>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1.2}>
        {filteredTasks.length === 0 ? (
          <Card><CardContent><Typography color="text.secondary">{t('tasks.empty')}</Typography></CardContent></Card>
        ) : filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent>
              <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
                <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.6 }}>
                    <Chip label={t(`tasks.priorityValues.${task.priority}`)} size="small" color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'} />
                    <Chip label={t(`tasks.categoryValues.${task.category}`)} size="small" variant="outlined" />
                    <Chip label={task.completed ? t('tasks.completed') : t('tasks.active')} size="small" />
                  </Stack>
                </Box>
                <IconButton color="error" onClick={() => deleteTask(task.id)} aria-label={t('tasks.delete')}>
                  <DeleteRoundedIcon />
                </IconButton>
              </Stack>
              <Divider sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};
