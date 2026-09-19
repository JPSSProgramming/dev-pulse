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
import type { Task, TaskCategory, TaskPriority } from '../../types/task';

interface DailyGoalsProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

type StatusFilter = 'all' | 'active' | 'completed';
type PriorityFilter = 'all' | TaskPriority;

const priorities: TaskPriority[] = ['low', 'medium', 'high'];
const categories: TaskCategory[] = ['code', 'study', 'rest'];

export const DailyGoals = ({ tasks, onTasksChange }: DailyGoalsProps) => {
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
    if (!trimmed) {
      return;
    }

    const nextTask: Task = {
      id: Date.now(),
      title: trimmed,
      priority,
      category,
      completed: false,
    };

    onTasksChange([nextTask, ...tasks]);
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
          <Typography variant="h5" gutterBottom>Daily Dev Goals</Typography>
          <Stack spacing={1.2}>
            <Typography variant="body2" color="text.secondary">Progress: {completedCount}/{tasks.length} ({progressPercent}%)</Typography>
            <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4 }} />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.2}>
            <Typography variant="h6">Add task</Typography>
            <TextField label="Task title" value={title} onChange={(event) => setTitle(event.target.value)} fullWidth required />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
              <TextField select label="Priority" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)} fullWidth>
                {priorities.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
              </TextField>
              <TextField select label="Category" value={category} onChange={(event) => setCategory(event.target.value as TaskCategory)} fullWidth>
                {categories.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
              </TextField>
            </Stack>
            <Button variant="contained" onClick={addTask} disabled={!title.trim()}>Create task</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.2}>
            <Typography variant="h6">Filters</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
              <TextField select label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} fullWidth>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
              <TextField select label="Priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as PriorityFilter)} fullWidth>
                <MenuItem value="all">All priorities</MenuItem>
                {priorities.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
              </TextField>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1.2}>
        {filteredTasks.length === 0 ? (
          <Card><CardContent><Typography color="text.secondary">No tasks yet. Create your first goal.</Typography></CardContent></Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardContent>
                <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
                  <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.6 }}>
                      <Chip label={task.priority} size="small" color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'} />
                      <Chip label={task.category} size="small" variant="outlined" />
                      <Chip label={task.completed ? 'Completed' : 'Active'} size="small" />
                    </Stack>
                  </Box>
                  <IconButton color="error" onClick={() => deleteTask(task.id)} aria-label="delete task">
                    <DeleteRoundedIcon />
                  </IconButton>
                </Stack>
                <Divider sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  );
};
