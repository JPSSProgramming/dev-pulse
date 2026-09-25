/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Goal, MicroStep } from '../types/microStep';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';
import { useTranslation } from '../i18n/I18nProvider';

const GOALS_KEY = 'devpulse-microstep-goals';
const STEP_DURATION_SECONDS = 5 * 60;

const isGoal = (value: unknown): value is Goal => {
  if (!value || typeof value !== 'object') return false;
  const goal = value as Partial<Goal>;
  return typeof goal.id === 'string'
    && typeof goal.title === 'string'
    && typeof goal.description === 'string'
    && typeof goal.createdAt === 'string'
    && Array.isArray(goal.steps)
    && goal.steps.every((step) => (
      !!step
      && typeof step === 'object'
      && typeof step.id === 'string'
      && typeof step.title === 'string'
      && typeof step.completed === 'boolean'
      && typeof step.durationSeconds === 'number'
      && step.durationSeconds > 0
    ));
};

interface GoalContextValue {
  goals: Goal[];
  addGoal: (title: string, description?: string) => Goal | null;
  deleteGoal: (goalId: string) => void;
  addStep: (goalId: string, title: string, durationSeconds?: number) => void;
  toggleStep: (goalId: string, stepId: string) => void;
  getGoalProgress: (goal: Goal) => number;
}

const GoalContext = createContext<GoalContextValue | null>(null);

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = loadFromStorage<unknown>(GOALS_KEY, null);
    return Array.isArray(stored) && stored.every(isGoal) ? stored : [];
  });

  useEffect(() => {
    saveToStorage(GOALS_KEY, goals);
  }, [goals]);

  const addGoal = useCallback((title: string, description = ''): Goal | null => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return null;

    const goal: Goal = {
      id: createId(),
      title: trimmedTitle,
      description: description.trim(),
      createdAt: new Date().toISOString(),
      steps: [{
        id: createId(),
        title: t('microStep.firstStep'),
        completed: false,
        durationSeconds: STEP_DURATION_SECONDS,
      }],
    };
    setGoals((current) => [goal, ...current]);
    return goal;
  }, [t]);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals((current) => current.filter((goal) => goal.id !== goalId));
  }, []);

  const addStep = useCallback((goalId: string, title: string, durationSeconds = STEP_DURATION_SECONDS) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    setGoals((current) => current.map((goal) => (
      goal.id === goalId
        ? {
            ...goal,
            steps: [...goal.steps, {
              id: createId(),
              title: trimmedTitle,
              completed: false,
              durationSeconds,
            }],
          }
        : goal
    )));
  }, []);

  const toggleStep = useCallback((goalId: string, stepId: string) => {
    setGoals((current) => current.map((goal) => (
      goal.id === goalId
        ? { ...goal, steps: goal.steps.map((step) => step.id === stepId ? { ...step, completed: !step.completed } : step) }
        : goal
    )));
  }, []);

  const getGoalProgress = useCallback((goal: Goal) => {
    if (goal.steps.length === 0) return 0;
    return Math.round((goal.steps.filter((step: MicroStep) => step.completed).length / goal.steps.length) * 100);
  }, []);

  const value = useMemo(() => ({
    goals,
    addGoal,
    deleteGoal,
    addStep,
    toggleStep,
    getGoalProgress,
  }), [addGoal, addStep, deleteGoal, getGoalProgress, goals, toggleStep]);

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used inside GoalProvider');
  }
  return context;
};
