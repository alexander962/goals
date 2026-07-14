import { CourseModule, TaskStage, TheoryStage } from '../data/progress';

export type Confidence = 'none' | 'medium' | 'sure';
export type TaskStatus = 'cannot' | 'errors' | 'solving';

export type CounterValue = {
  sure: number;
  medium: number;
  none: number;
};

export type AppState = {
  theoryCounters: Record<string, CounterValue>;
  theoryStatus: Record<string, Confidence>;
  taskStatus: Record<string, TaskStatus>;
  courseCompleted: Record<string, boolean>;
  englishCompleted: Record<string, boolean>;
  nextPizzaCompleted: Record<string, boolean>;
  weightEntries: { date: string; value: number }[];
  sportEntries: Record<string, { date: string; value: number }[]>;
  completedGoals: Record<string, boolean>;
};

export const emptyState: AppState = {
  theoryCounters: {},
  theoryStatus: {},
  taskStatus: {},
  courseCompleted: {},
  englishCompleted: {},
  nextPizzaCompleted: {},
  weightEntries: [],
  sportEntries: {},
  completedGoals: {},
};

export const confidenceScore: Record<Confidence, number> = {
  none: 0,
  medium: 60,
  sure: 100,
};

export const taskScore: Record<TaskStatus, number> = {
  cannot: 0,
  errors: 60,
  solving: 100,
};

export function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function counterPercent(value?: CounterValue) {
  if (!value) return 0;
  const total = value.sure + value.medium + value.none;
  if (!total) return 0;
  return clampPercent(((value.sure * 100 + value.medium * 60) / (total * 100)) * 100);
}

export function average(values: number[]) {
  const filled = values.filter((value) => Number.isFinite(value));
  if (!filled.length) return 0;
  return clampPercent(filled.reduce((sum, value) => sum + value, 0) / filled.length);
}

export function theoryItemPercent(stageItemId: string, mode: 'counter' | 'status', state: AppState) {
  if (mode === 'counter') return counterPercent(state.theoryCounters[stageItemId]);
  return confidenceScore[state.theoryStatus[stageItemId] ?? 'none'];
}

export function theoryStagePercent(stage: TheoryStage, state: AppState) {
  return average(stage.items.map((item) => theoryItemPercent(item.id, item.mode, state)));
}

export function theoryTotalPercent(stages: TheoryStage[], state: AppState) {
  return average(stages.map((stage) => theoryStagePercent(stage, state)));
}

export function taskStagePercent(stage: TaskStage, state: AppState) {
  return average(stage.tasks.map((task) => taskScore[state.taskStatus[`${stage.id}:${task}`] ?? 'cannot']));
}

export function taskTotalPercent(stages: TaskStage[], state: AppState) {
  return average(stages.map((stage) => taskStagePercent(stage, state)));
}

export function courseModulePercent(module: CourseModule, state: AppState) {
  const completed = module.sections.filter((section) => state.courseCompleted[`${module.id}:${section}`]).length;
  return clampPercent((completed / module.sections.length) * 100);
}

export function courseTotalPercent(modules: CourseModule[], state: AppState) {
  const allSections = modules.flatMap((module) => module.sections.map((section) => `${module.id}:${section}`));
  const completed = allSections.filter((id) => state.courseCompleted[id]).length;
  return clampPercent((completed / allSections.length) * 100);
}

export function lastEntryByDay(entries: { date: string; value: number }[] = []) {
  return entries.reduce<Record<string, number>>((acc, entry) => {
    if (!entry.date || !Number.isFinite(entry.value)) return acc;
    acc[entry.date] = entry.value;
    return acc;
  }, {});
}

export function weightProgressPercent(entries: { date: string; value: number }[] = [], target: number) {
  const days = Object.entries(lastEntryByDay(entries)).sort(([a], [b]) => a.localeCompare(b));
  if (!days.length) return 0;
  const start = days[0][1];
  const current = days.at(-1)?.[1] ?? start;
  if (start <= target) return current <= target ? 100 : 0;
  return clampPercent(((start - current) / (start - target)) * 100);
}
