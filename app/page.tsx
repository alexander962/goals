'use client';

import { motion } from 'framer-motion';
import type { ElementType } from 'react';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  Download,
  Flame,
  Gauge,
  Home,
  PartyPopper,
  Plus,
  Repeat2,
  RotateCcw,
  Save,
  Scale,
  Sparkles,
  Timer,
  Trophy,
  Upload,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProgressRing } from './components/ProgressRing';
import { SectionHeader } from './components/SectionHeader';
import { SegmentedControl } from './components/SegmentedControl';
import {
  courseModules,
  taskStages,
  theoryStages,
} from './data/progress';
import {
  AppState,
  Confidence,
  CounterValue,
  TaskStatus,
  average,
  confidenceScore,
  courseModulePercent,
  courseTotalPercent,
  emptyState,
  lastEntryByDay,
  taskStagePercent,
  taskTotalPercent,
  theoryItemPercent,
  theoryStagePercent,
  theoryTotalPercent,
  weightProgressPercent,
} from './lib/progress';
import styles from './page.module.scss';

type DashboardStats = {
  theory: number;
  tasks: number;
  interview: number;
  course: number;
  vue: number;
  weight: number;
  habits: number;
  total: number;
};

type Page = 'dashboard' | 'interview' | 'course' | 'vue' | 'weight' | 'habits';

const storageKey = 'goals-progress-state-v1';
const backupStorageKey = `${storageKey}-backup`;

const navItems: { id: Page; label: string; icon: ElementType }[] = [
  { id: 'dashboard', label: 'Главная', icon: Home },
  { id: 'interview', label: 'Собеседование', icon: Brain },
  { id: 'course', label: 'Курс фронтенд', icon: BookOpen },
  // { id: 'vue', label: 'Курс по Vue', icon: Code2 }, // временно скрыто
  { id: 'weight', label: 'Контроль веса', icon: Scale },
  { id: 'habits', label: 'Привычки', icon: Repeat2 },
];

const habits = [
  { id: 'abstinence', title: 'Воздержание', accent: '#6d7dfc' },
  { id: 'safe-content', title: 'Нет просмотру вредного контента самому', accent: '#df5b7d' },
  { id: 'no-sweets-flour', title: 'Нет сладкому и мучному', accent: '#18a999' },
  { id: 'one-meal-a-day', title: 'Питание 1 раз в день + кефир вечером', accent: '#c99a43' },
] as const;
const habitDays = Array.from({ length: 100 }, (_, index) => index + 1);

const vueModules = [
  'Введение',
  'Настройка окружения',
  'Основы',
  'Компоненты',
  'Свойства и события',
  'Реактивность',
  'Шаблоны и модели',
  'Жизненный цикл',
  'Custom directive, Provide / Inject',
  'Переход на TypeScript',
  'Pinia',
  'Vue Router',
  'Авторизация',
  'Встроенные компоненты',
  'Заключение',
].map((title, index) => ({ id: `vue:${index + 1}`, index: index + 1, title }));

const weightTarget = 80;

const confidenceOptions = [
  { value: 'sure', label: 'Уверенно' },
  { value: 'medium', label: 'Средне' },
  { value: 'none', label: 'Никак' },
] satisfies { value: Confidence; label: string }[];

const taskOptions = [
  { value: 'solving', label: 'Решаю' },
  { value: 'errors', label: 'С ошибками' },
  { value: 'cannot', label: 'Не могу' },
] satisfies { value: TaskStatus; label: string }[];

const dashboardGoals = [
  { id: 'interview-200', title: 'Получить желаемую работу', source: 'interview' },
  { id: 'senior-course', title: 'Пройти курс продвинутый фронтенд и вырасти до уверенного Senior', source: 'course' },
  // { id: 'vue-course', title: 'Пройти курс по Vue', source: 'vue' }, // временно скрыто
  { id: 'weight-80', title: 'Скинуть вес до 80 кг', source: 'weight' },
  { id: 'root-four-habits', title: 'Усвоить и укоренить четыре полезные привычки', source: 'habits' },
] as const;

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hasProgress(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.values(value).some(hasProgress);
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  return typeof value === 'string' && value.length > 0 && value !== 'none' && value !== 'cannot';
}

function parseSavedState(raw: string | null): AppState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || typeof parsed !== 'object') return null;
    return { ...emptyState, ...parsed };
  } catch {
    return null;
  }
}

function vuePercent(state: AppState) {
  const completed = vueModules.filter((module) => state.vueCompleted[module.id]).length;
  return Math.round((completed / vueModules.length) * 100);
}

function habitsTotalPercent(state: AppState) {
  return average(habits.map((habit) => Math.min(100, state.habitProgress[habit.id] ?? 0)));
}

export default function HomePage() {
  const [page, setPage] = useState<Page>('dashboard');
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = parseSavedState(window.localStorage.getItem(storageKey));
    const backup = parseSavedState(window.localStorage.getItem(backupStorageKey));
    if (saved && hasProgress(saved)) setState(saved);
    else if (backup && hasProgress(backup)) setState(backup);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const nextRaw = JSON.stringify(state);
    const currentRaw = window.localStorage.getItem(storageKey);
    const current = parseSavedState(currentRaw);

    // Never let an empty render erase real progress. Keep the last good value as a second line of defence.
    if (!hasProgress(state) && current && hasProgress(current)) return;
    if (currentRaw && current && hasProgress(current) && currentRaw !== nextRaw) {
      window.localStorage.setItem(backupStorageKey, currentRaw);
    }
    window.localStorage.setItem(storageKey, nextRaw);
  }, [hydrated, state]);

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goals-backup-${getLocalDateKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importProgress = async (file?: File) => {
    if (!file) return;
    const restored = parseSavedState(await file.text());
    if (!restored || !hasProgress(restored)) {
      window.alert('В файле не найден сохранённый прогресс.');
      return;
    }
    setState(restored);
  };

  const stats = useMemo(() => {
    const theory = theoryTotalPercent(theoryStages, state);
    const tasks = taskTotalPercent(taskStages, state);
    const interview = average([theory, tasks]);
    const course = courseTotalPercent(courseModules, state);
    const vue = vuePercent(state);
    const weight = weightProgressPercent(state.weightEntries, weightTarget);
    const habits = habitsTotalPercent(state);
    return { theory, tasks, interview, course, vue, weight, habits, total: average([interview, course, weight, habits]) };
  }, [state]);

  const setCounter = (id: string, field: keyof CounterValue, value: string) => {
    const numberValue = Math.max(0, Number(value) || 0);
    setState((current) => ({
      ...current,
      theoryCounters: {
        ...current.theoryCounters,
        [id]: { ...({ sure: 0, medium: 0, none: 0 } satisfies CounterValue), ...current.theoryCounters[id], [field]: numberValue },
      },
    }));
  };

  const setConfidence = (id: string, value: Confidence) => {
    setState((current) => ({ ...current, theoryStatus: { ...current.theoryStatus, [id]: value } }));
  };

  const setTask = (id: string, value: TaskStatus) => {
    setState((current) => ({ ...current, taskStatus: { ...current.taskStatus, [id]: value } }));
  };

  const setCourseSection = (id: string, checked: boolean) => {
    setState((current) => ({ ...current, courseCompleted: { ...current.courseCompleted, [id]: checked } }));
  };

  const setVueModule = (id: string, checked: boolean) => {
    setState((current) => ({ ...current, vueCompleted: { ...current.vueCompleted, [id]: checked } }));
  };

  const addWeightEntry = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return;
    setState((current) => ({
      ...current,
      weightEntries: [...current.weightEntries, { date: getLocalDateKey(), value: Number(value.toFixed(1)) }],
    }));
  };

  const setHabitProgress = (id: string, day: number) => {
    setState((current) => ({
      ...current,
      habitProgress: {
        ...current.habitProgress,
        [id]: Math.max(current.habitProgress[id] ?? 0, Math.min(100, day)),
      },
    }));
  };

  const resetHabitProgress = (id: string) => {
    setState((current) => ({
      ...current,
      habitProgress: { ...current.habitProgress, [id]: 0 },
    }));
  };

  const setDashboardGoal = (id: string, checked: boolean) => {
    setState((current) => ({ ...current, completedGoals: { ...current.completedGoals, [id]: checked } }));
  };

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Trophy size={28} />
          <div>
            <strong>Progress Control</strong>
            <span>личная система целей</span>
          </div>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                className={page === item.id ? styles.activeNav : ''}
                onClick={() => setPage(item.id)}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className={styles.saveBadge}>
          <Save size={18} />
          <span>Автосохранение включено</span>
        </div>
        <div className={styles.backupActions}>
          <button type="button" onClick={exportProgress}>
            <Download size={17} />
            Скачать копию
          </button>
          <button type="button" onClick={() => importInputRef.current?.click()}>
            <Upload size={17} />
            Восстановить
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              void importProgress(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </div>
      </aside>

      <section className={styles.content}>
        {page === 'dashboard' && <Dashboard stats={stats} state={state} setDashboardGoal={setDashboardGoal} />}
        {page === 'course' && <CoursePage state={state} stats={stats} setCourseSection={setCourseSection} />}
        {page === 'vue' && <VuePage state={state} stats={stats} setVueModule={setVueModule} />}
        {page === 'weight' && <WeightPage state={state} stats={stats} addWeightEntry={addWeightEntry} />}
        {page === 'habits' && (
          <HabitsPage
            state={state}
            stats={stats}
            setHabitProgress={setHabitProgress}
            resetHabitProgress={resetHabitProgress}
          />
        )}
        {page === 'interview' && (
          <InterviewPage
            state={state}
            stats={stats}
            setCounter={setCounter}
            setConfidence={setConfidence}
            setTask={setTask}
          />
        )}
      </section>
    </main>
  );
}

function getGoalReadiness(source: (typeof dashboardGoals)[number]['source'], stats: DashboardStats) {
  if (source === 'interview') return stats.interview;
  if (source === 'course') return stats.course;
  if (source === 'weight') return stats.weight;
  if (source === 'habits') return stats.habits;
  return 0;
}

function getReadinessMeta(value: number) {
  if (value < 50) return { className: styles.goalCold, label: 'рано', Icon: Gauge };
  if (value < 80) return { className: styles.goalWarm, label: 'близко', Icon: Flame };
  return { className: styles.goalHot, label: 'можно пробовать', Icon: Sparkles };
}

function Dashboard({
  stats,
  state,
  setDashboardGoal,
}: {
  stats: DashboardStats;
  state: AppState;
  setDashboardGoal: (id: string, checked: boolean) => void;
}) {
  const cards = [
    // { label: 'Теория', value: stats.theory, color: '#6d7dfc', icon: Brain },
    // { label: 'Задачи', value: stats.tasks, color: '#f28c38', icon: Gauge },
    { label: 'Собеседование', value: stats.interview, color: '#6d7dfc', icon: Brain },
    { label: 'Курс', value: stats.course, color: '#df5b7d', icon: BookOpen },
    // { label: 'Курс по Vue', value: stats.vue, color: '#42b883', icon: Code2 }, // временно скрыто
    { label: 'Вес', value: stats.weight, color: '#18a999', icon: Scale },
    { label: 'Привычки', value: stats.habits, color: '#6d7dfc', icon: Repeat2 },
  ].sort((a, b) => Number(a.value >= 100) - Number(b.value >= 100));
  const goals = dashboardGoals
    .map((goal) => ({
      ...goal,
      completed: Boolean(state.completedGoals[goal.id]),
      readiness: getGoalReadiness(goal.source, stats),
    }))
    .sort((a, b) => {
      const aRank = a.completed ? 1 : 0;
      const bRank = b.completed ? 1 : 0;
      return aRank - bRank || b.readiness - a.readiness;
    });

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="Общий контроль"
        title="Все цели на одном экране"
        description="Сводка собирает прогресс по подготовке к собеседованию, курсу, весу и привычкам. Любой ввод на внутренних страницах сразу меняет общий процент."
      >
        <ProgressRing value={stats.total} size={154} color="#121c27" label="всего" />
      </SectionHeader>
      <div className={styles.dashboardGrid}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.article
              className={`${styles.statCard} ${card.value >= 100 ? styles.statComplete : ''}`}
              key={card.label}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <Icon size={24} style={{ color: card.color }} />
              <h2>{card.label}</h2>
              <ProgressRing value={card.value} color={card.color} />
            </motion.article>
          );
        })}
      </div>
      <section className={styles.goalsPanel}>
        <div className={styles.panelTitle}>
          <h2>Цели</h2>
          <span>{goals.filter((goal) => goal.completed).length} / {goals.length}</span>
        </div>
        <div className={styles.goalsList}>
          {goals.map((goal) => {
            const meta = getReadinessMeta(goal.readiness);
            const Icon = meta.Icon;
            return (
              <motion.article
                layout
                className={`${styles.goalRow} ${meta.className} ${goal.completed ? styles.goalDone : ''}`}
                key={goal.id}
              >
                <label className={styles.goalCheck}>
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={(event) => setDashboardGoal(goal.id, event.target.checked)}
                  />
                  <span>
                    <CheckCircle2 size={20} />
                  </span>
                </label>
                <div className={styles.goalText}>
                  <strong>{goal.title}</strong>
                  {!goal.completed ? (
                    <small>
                      <Icon size={15} />
                      {meta.label}
                    </small>
                  ) : null}
                </div>
                {goal.completed ? (
                  <div className={styles.goalTrophy} aria-label="Цель закрыта">
                    <Sparkles size={18} />
                    <Trophy size={34} />
                    <PartyPopper size={18} />
                  </div>
                ) : (
                  <div className={styles.goalProgress}>
                    <ProgressRing value={goal.readiness} size={72} stroke={7} color="#18a999" />
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}

function CoursePage({
  state,
  stats,
  setCourseSection,
}: {
  state: AppState;
  stats: DashboardStats;
  setCourseSection: (id: string, checked: boolean) => void;
}) {
  const completedSections = courseModules.reduce(
    (sum, module) => sum + module.sections.filter((section) => state.courseCompleted[`${module.id}:${section}`]).length,
    0,
  );
  const totalSections = courseModules.reduce((sum, module) => sum + module.sections.length, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="Advanced frontend"
        title="Прохождение курса"
        description="16 модулей продвинутого фронтенда: отмечай пройденные разделы, а общий и модульный прогресс пересчитываются автоматически."
      >
        <ProgressRing value={stats.course} size={154} color="#df5b7d" label="курс" />
      </SectionHeader>
      <div className={styles.courseSummary}>
        <div>
          <strong>{completedSections}</strong>
          <span>разделов пройдено</span>
        </div>
        <div>
          <strong>{totalSections}</strong>
          <span>разделов всего</span>
        </div>
        <div>
          <strong>{courseModules.filter((module) => courseModulePercent(module, state) === 100).length}</strong>
          <span>модулей закрыто</span>
        </div>
      </div>
      <div className={styles.courseGrid}>
        {courseModules.map((module, index) => {
          const percent = courseModulePercent(module, state);
          return (
            <motion.article
              className={styles.courseCard}
              key={module.id}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <div className={styles.courseTop}>
                <div className={styles.moduleNumber}>{String(index + 1).padStart(2, '0')}</div>
                <ProgressRing value={percent} size={84} stroke={8} color="#df5b7d" />
              </div>
              <h2>{module.title}</h2>
              <div className={styles.lessonList}>
                {module.sections.map((section) => {
                  const id = `${module.id}:${section}`;
                  const checked = Boolean(state.courseCompleted[id]);
                  return (
                    <label className={styles.lessonRow} key={id}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => setCourseSection(id, event.target.checked)}
                      />
                      <span className={checked ? styles.lessonDone : ''}>
                        <CheckCircle2 size={18} />
                        {section}
                      </span>
                    </label>
                  );
                })}
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}

function VuePage({
  state,
  stats,
  setVueModule,
}: {
  state: AppState;
  stats: DashboardStats;
  setVueModule: (id: string, checked: boolean) => void;
}) {
  const completedModules = vueModules.filter((module) => state.vueCompleted[module.id]).length;

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="Vue.js"
        title="Курс по Vue"
        description="Отмечай пройденные модули курса. Общий прогресс автоматически рассчитывается по 15 модулям."
      >
        <ProgressRing value={stats.vue} size={154} color="#42b883" label="vue" />
      </SectionHeader>
      <div className={styles.courseSummary}>
        <div>
          <strong>{completedModules}</strong>
          <span>модулей пройдено</span>
        </div>
        <div>
          <strong>{vueModules.length}</strong>
          <span>модулей всего</span>
        </div>
        <div>
          <strong>{vueModules.length - completedModules}</strong>
          <span>модулей осталось</span>
        </div>
      </div>
      <div className={styles.vueGrid}>
        {vueModules.map((module) => {
          const checked = Boolean(state.vueCompleted[module.id]);
          return (
            <motion.label
              className={styles.vueModule}
              key={module.id}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => setVueModule(module.id, event.target.checked)}
              />
              <span className={checked ? styles.vueModuleDone : ''}>
                <div className={styles.vueModuleNumber}>{String(module.index).padStart(2, '0')}</div>
                <strong>{module.title}</strong>
                <CheckCircle2 size={21} />
              </span>
            </motion.label>
          );
        })}
      </div>
    </motion.div>
  );
}

function WeightPage({
  state,
  stats,
  addWeightEntry,
}: {
  state: AppState;
  stats: DashboardStats;
  addWeightEntry: (value: number) => void;
}) {
  const [draft, setDraft] = useState('');
  const days = Object.entries(lastEntryByDay(state.weightEntries)).sort(([a], [b]) => a.localeCompare(b));
  const current = days.at(-1)?.[1] ?? 0;
  const previous = days.at(-2)?.[1];
  const delta = previous === undefined ? 0 : current - previous;
  const start = days[0]?.[1] ?? 0;
  const chartWidth = Math.max(420, days.length * 88);
  const chartHeight = 240;
  const chartTop = 28;
  const chartBottom = 48;
  const chartLeft = 38;
  const chartRight = 28;
  const values = days.map(([, value]) => value);
  const minValue = Math.min(weightTarget, ...values);
  const maxValue = Math.max(weightTarget, ...values);
  const chartMin = Math.max(0, minValue - 2);
  const chartMax = maxValue + 2;
  const chartRange = Math.max(1, chartMax - chartMin);
  const points = days.map(([date, value], index) => {
    const x =
      days.length === 1
        ? chartWidth / 2
        : chartLeft + (index / (days.length - 1)) * (chartWidth - chartLeft - chartRight);
    const y = chartTop + ((chartMax - value) / chartRange) * (chartHeight - chartTop - chartBottom);
    return { date, value, x, y };
  });
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(' ');
  const targetY = chartTop + ((chartMax - weightTarget) / chartRange) * (chartHeight - chartTop - chartBottom);

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="Цель 80 кг"
        title="Контроль веса"
        description="Вноси замеры веса. Если в один день есть несколько значений, в график и расчет попадет последний замер дня."
      >
        <ProgressRing value={stats.weight} size={154} color="#18a999" label="вес" />
      </SectionHeader>
      <div className={styles.weightLayout}>
        <section className={styles.panel}>
          <div className={styles.panelTitle}>
            <h2>Замер</h2>
            <span>{stats.weight}%</span>
          </div>
          <form
            className={styles.weightForm}
            onSubmit={(event) => {
              event.preventDefault();
              addWeightEntry(Number(draft.replace(',', '.')));
              setDraft('');
            }}
          >
            <label>
              Вес, кг
              <input
                type="number"
                min="1"
                step="0.1"
                inputMode="decimal"
                placeholder="например 92.4"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
            </label>
            <button type="submit" aria-label="Добавить вес">
              <Plus size={18} />
            </button>
          </form>
          <div className={styles.weightSummary}>
            <div>
              <strong>{current ? current.toFixed(1) : '-'}</strong>
              <span>текущий вес</span>
            </div>
            <div>
              <strong className={delta > 0 ? styles.weightRegression : delta < 0 ? styles.weightProgress : ''}>
                {previous === undefined ? '-' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}`}
              </strong>
              <span>к прошлому</span>
            </div>
            <div>
              <strong>{start ? start.toFixed(1) : '-'}</strong>
              <span>старт</span>
            </div>
            <div>
              <strong>{weightTarget}</strong>
              <span>цель</span>
            </div>
          </div>
        </section>
        <section className={styles.panel}>
          <div className={styles.panelTitle}>
            <h2>Динамика</h2>
            <span>{days.length} дн.</span>
          </div>
          <div className={styles.weightChart} aria-label="График веса">
            {days.length ? (
              <svg
                className={styles.weightLineChart}
                style={{ width: `${chartWidth}px`, minWidth: '100%' }}
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                role="img"
              >
                {points.map((point) => (
                  <line
                    className={styles.weightGridLine}
                    key={`grid-${point.date}`}
                    x1={point.x}
                    x2={point.x}
                    y1={16}
                    y2={chartHeight - 28}
                  />
                ))}
                <line
                  className={styles.weightTargetLine}
                  x1={chartLeft}
                  x2={chartWidth - chartRight}
                  y1={targetY}
                  y2={targetY}
                />
                <text className={styles.weightTargetText} x={chartLeft} y={targetY - 6}>
                  цель {weightTarget} кг
                </text>
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="#18a999"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
                {points.map((point) => (
                  <g key={point.date}>
                    <circle cx={point.x} cy={point.y} r="14" fill="#18a999" />
                    <text className={styles.weightPointValue} x={point.x} y={point.y + 3}>
                      {point.value}
                    </text>
                    <text className={styles.weightPointDate} x={point.x} y={chartHeight - 10}>
                      {new Date(`${point.date}T00:00:00`).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className={styles.emptyChart}>
                <Scale size={24} />
                <span>Нет замеров</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function HabitsPage({
  state,
  stats,
  setHabitProgress,
  resetHabitProgress,
}: {
  state: AppState;
  stats: DashboardStats;
  setHabitProgress: (id: string, day: number) => void;
  resetHabitProgress: (id: string) => void;
}) {
  const completedHabits = habits.filter((habit) => (state.habitProgress[habit.id] ?? 0) >= 100).length;

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="100 дней"
        title="Трекер привычек"
        description="Каждый успешный день отмечай на шкале. Если сорвался или пропустил день — сбрось только нужную привычку и начни её серию заново."
      >
        <ProgressRing value={stats.habits} size={154} color="#6d7dfc" label="привычки" />
      </SectionHeader>
      <div className={styles.courseSummary}>
        <div>
          <strong>{completedHabits}</strong>
          <span>привычек укоренено</span>
        </div>
        <div>
          <strong>{habits.length}</strong>
          <span>привычек всего</span>
        </div>
        <div>
          <strong>{stats.habits}%</strong>
          <span>общий прогресс</span>
        </div>
      </div>
      <div className={styles.habitsGrid}>
        {habits.map((habit, index) => {
          const currentDay = Math.min(100, state.habitProgress[habit.id] ?? 0);
          return (
            <motion.article className={styles.habitCard} key={habit.id} whileHover={{ y: -3 }}>
              <div className={styles.habitHead}>
                <div className={styles.habitIndex} style={{ color: habit.accent, backgroundColor: `${habit.accent}18` }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <small>Текущая серия: {currentDay} дней</small>
                  <h2>{habit.title}</h2>
                </div>
                <ProgressRing value={currentDay} size={76} stroke={7} color={habit.accent} />
              </div>
              <div className={styles.habitDays} aria-label={`Прогресс привычки: ${habit.title}`}>
                {habitDays.map((day) => (
                  <button
                    type="button"
                    key={day}
                    className={day <= currentDay ? styles.habitDayDone : ''}
                    style={day <= currentDay ? { backgroundColor: habit.accent, borderColor: habit.accent } : undefined}
                    aria-pressed={day <= currentDay}
                    aria-label={`Отметить ${day} день`}
                    onClick={() => setHabitProgress(habit.id, day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className={styles.habitFooter}>
                <span>{currentDay >= 100 ? 'Привычка укоренилась' : `До цели осталось ${100 - currentDay} дней`}</span>
                <button
                  type="button"
                  className={styles.habitReset}
                  disabled={currentDay === 0}
                  onClick={() => {
                    if (window.confirm(`Сбросить прогресс привычки «${habit.title}»?`)) resetHabitProgress(habit.id);
                  }}
                >
                  <RotateCcw size={17} />
                  Сбросить
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}

function InterviewPage({
  state,
  stats,
  setCounter,
  setConfidence,
  setTask,
}: {
  state: AppState;
  stats: DashboardStats;
  setCounter: (id: string, field: keyof CounterValue, value: string) => void;
  setConfidence: (id: string, value: Confidence) => void;
  setTask: (id: string, value: TaskStatus) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="Frontend interview"
        title="Подготовка к собеседованию"
        description="Теория поддерживает и общие статусы, и счетчики вопросов. Задачи отмечаются по фактическому уровню решения."
      >
        <ProgressRing value={stats.interview} size={154} color="#6d7dfc" label="интервью" />
      </SectionHeader>
      <div className={styles.interviewLayout}>
        <section className={styles.panel}>
          <div className={styles.panelTitle}>
            <h2>Теория</h2>
            <span>{stats.theory}%</span>
          </div>
          <div className={styles.stack}>
            {theoryStages.map((stage) => (
              <article className={styles.stage} key={stage.id}>
                <div className={styles.stageHead}>
                  <h3>{stage.title}</h3>
                  <ProgressRing value={theoryStagePercent(stage, state)} size={78} stroke={8} color="#6d7dfc" />
                </div>
                {stage.items.map((item) => (
                  <div className={styles.theoryRow} key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{theoryItemPercent(item.id, item.mode, state)}%</span>
                    </div>
                    {item.mode === 'counter' ? (
                      <div className={styles.counters}>
                        {(['sure', 'medium', 'none'] as (keyof CounterValue)[]).map((field) => (
                          <label key={field}>
                            {field === 'sure' ? 'Уверенно' : field === 'medium' ? 'Средне' : 'Никак'}
                            <input
                              type="number"
                              min="0"
                              value={state.theoryCounters[item.id]?.[field] ?? 0}
                              onChange={(event) => setCounter(item.id, field, event.target.value)}
                            />
                          </label>
                        ))}
                      </div>
                    ) : (
                      <SegmentedControl
                        value={state.theoryStatus[item.id] ?? 'none'}
                        options={confidenceOptions}
                        onChange={(value) => setConfidence(item.id, value)}
                        tone="focus"
                      />
                    )}
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
        <section className={styles.panel}>
          <div className={styles.panelTitle}>
            <h2>Задачи</h2>
            <span>{stats.tasks}%</span>
          </div>
          <div className={styles.stack}>
            {taskStages.map((stage) => (
              <article className={styles.stage} key={stage.id}>
                <div className={styles.stageHead}>
                  <h3>{stage.title}</h3>
                  <ProgressRing value={taskStagePercent(stage, state)} size={78} stroke={8} color="#f28c38" />
                </div>
                <div className={styles.taskList}>
                  {stage.tasks.map((task) => {
                    const id = `${stage.id}:${task}`;
                    return (
                      <div className={styles.taskRow} key={id}>
                        <strong>{task}</strong>
                        <SegmentedControl
                          value={state.taskStatus[id] ?? 'cannot'}
                          options={taskOptions}
                          onChange={(value) => setTask(id, value)}
                          tone="task"
                        />
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
