import { Badge, CourseModule, GtoNorm, MetricKind, TaskStage, TheoryStage } from '../data/progress';

export type Confidence = 'none' | 'medium' | 'sure';
export type TaskStatus = 'cannot' | 'errors' | 'solving';

export type CounterValue = {
  sure: number;
  medium: number;
  none: number;
};

export type AppState = {
  gto: Record<string, string>;
  marathon: Record<string, { km: string; time: string }>;
  theoryCounters: Record<string, CounterValue>;
  theoryStatus: Record<string, Confidence>;
  taskStatus: Record<string, TaskStatus>;
  courseCompleted: Record<string, boolean>;
};

export const emptyState: AppState = {
  gto: {},
  marathon: {},
  theoryCounters: {},
  theoryStatus: {},
  taskStatus: {},
  courseCompleted: {},
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

export function parseMetric(value: string, kind?: MetricKind) {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return 0;
  if (kind === 'lowerTime' && normalized.includes(':')) {
    const [minutes, seconds = '0'] = normalized.split(':');
    return Number(minutes) * 60 + Number(seconds);
  }
  return Number(normalized) || 0;
}

export function formatNorm(value: number, kind: MetricKind) {
  if (kind !== 'lowerTime' || value < 60) return kind === 'higherSigned' ? `+${value}` : String(value);
  const minutes = Math.floor(value / 60);
  const seconds = String(value % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function gtoBadgePercent(norm: GtoNorm, badge: Badge, value: string) {
  const current = parseMetric(value, norm.kind);
  if (!current) return 0;
  const target = norm.norms[badge];
  if (norm.kind === 'lowerTime') return clampPercent((target / current) * 100);
  return clampPercent((current / target) * 100);
}

export function gtoNormPercent(norm: GtoNorm, value: string) {
  return Math.max(...(['gold', 'silver', 'bronze'] as Badge[]).map((badge) => gtoBadgePercent(norm, badge, value)));
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
