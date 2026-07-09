'use client';

import { motion } from 'framer-motion';
import type { ElementType } from 'react';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Dumbbell,
  Flame,
  Gauge,
  Home,
  PartyPopper,
  Pizza,
  Plus,
  Save,
  Scale,
  Sparkles,
  Timer,
  Trophy,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
  nextPizza: number;
  weight: number;
  sport: number;
  total: number;
};

type Page = 'dashboard' | 'interview' | 'course' | 'nextPizza' | 'weight' | 'sport';

const storageKey = 'goals-progress-state-v1';

const navItems: { id: Page; label: string; icon: ElementType }[] = [
  { id: 'dashboard', label: 'Главная', icon: Home },
  { id: 'interview', label: 'Собеседование', icon: Brain },
  { id: 'course', label: 'Курс фронтенд', icon: BookOpen },
  { id: 'nextPizza', label: 'Next Pizza', icon: Pizza },
  { id: 'weight', label: 'Контроль веса', icon: Scale },
  { id: 'sport', label: 'Спорт', icon: Dumbbell },
];

const nextPizzaVideoMinutes = 22 * 60 + 56 + 40 / 60;
const nextPizzaStepMinutes = 30;
const nextPizzaSteps = Array.from({ length: Math.ceil(nextPizzaVideoMinutes / nextPizzaStepMinutes) }, (_, index) => {
  const start = index * nextPizzaStepMinutes;
  const end = Math.min(start + nextPizzaStepMinutes, nextPizzaVideoMinutes);
  return { id: `next-pizza:${index + 1}`, index: index + 1, start, end };
});
const weightTarget = 80;
const sportNorms = [
  // { id: 'pullups', title: 'Подтягивания', target: 40, unit: 'раз', kind: 'higher', accent: '#18a999' },
  // { id: 'dips', title: 'Брусья', target: 60, unit: 'раз', kind: 'higher', accent: '#f28c38' },
  // { id: 'pushups', title: 'Отжимания', target: 80, unit: 'раз', kind: 'higher', accent: '#6d7dfc' },
  // { id: 'abs', title: 'Пресс', target: 60, unit: 'раз', kind: 'higher', accent: '#df5b7d' },
  { id: 'run-10-laps', title: 'Бег 12 кругов', target: 26, unit: 'мин', kind: 'lower', accent: '#121c27' },
] as const;

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
  { id: 'next-pizza-app', title: 'Написать приложение Next Pizza', source: 'nextPizza' },
  { id: 'weight-80', title: 'Скинуть вес до 80 кг', source: 'weight' },
  { id: 'sport-norms', title: 'Выполнить все запланированные спортивные нормативы', source: 'sport' },
] as const;

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatVideoTime(minutesValue: number) {
  const totalSeconds = Math.round(minutesValue * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function nextPizzaPercent(state: AppState) {
  const completed = nextPizzaSteps.filter((step) => state.nextPizzaCompleted[step.id]).length;
  return Math.round((completed / nextPizzaSteps.length) * 100);
}

function parseSportInput(value: string, kind: (typeof sportNorms)[number]['kind']) {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return 0;
  if (kind === 'lower' && normalized.includes(':')) {
    const [minutes, seconds = '0'] = normalized.split(':');
    return Number(minutes) + Number(seconds) / 60;
  }
  return Number(normalized) || 0;
}

function formatSportValue(value: number, norm: (typeof sportNorms)[number]) {
  if (!value) return '-';
  if (norm.kind === 'lower') {
    const totalSeconds = Math.round(value * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  return String(Math.round(value));
}

function sportMetricPercent(entries: { date: string; value: number }[] = [], norm: (typeof sportNorms)[number]) {
  const values = Object.values(lastEntryByDay(entries)).filter((value) => value > 0);
  if (!values.length) return 0;
  // @ts-ignore
  const best = norm.kind === 'higher' ? Math.max(...values) : Math.min(...values);
  // @ts-ignore
  return norm.kind === 'higher'
    ? Math.min(100, Math.round((best / norm.target) * 100))
    : Math.min(100, Math.round((norm.target / best) * 100));
}

function sportTotalPercent(state: AppState) {
  return average(sportNorms.map((norm) => sportMetricPercent(state.sportEntries[norm.id], norm)));
}

export default function HomePage() {
  const [page, setPage] = useState<Page>('dashboard');
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      setState({ ...emptyState, ...parsed });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hydrated, state]);

  const stats = useMemo(() => {
    const theory = theoryTotalPercent(theoryStages, state);
    const tasks = taskTotalPercent(taskStages, state);
    const interview = average([theory, tasks]);
    const course = courseTotalPercent(courseModules, state);
    const nextPizza = nextPizzaPercent(state);
    const weight = weightProgressPercent(state.weightEntries, weightTarget);
    const sport = sportTotalPercent(state);
    return { theory, tasks, interview, course, nextPizza, weight, sport, total: average([interview, course, nextPizza, weight, sport]) };
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

  const setNextPizzaStep = (id: string, checked: boolean) => {
    setState((current) => ({ ...current, nextPizzaCompleted: { ...current.nextPizzaCompleted, [id]: checked } }));
  };

  const addWeightEntry = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return;
    setState((current) => ({
      ...current,
      weightEntries: [...current.weightEntries, { date: getLocalDateKey(), value: Number(value.toFixed(1)) }],
    }));
  };

  const addSportEntry = (id: string, value: number) => {
    if (!Number.isFinite(value) || value <= 0) return;
    setState((current) => ({
      ...current,
      sportEntries: {
        ...current.sportEntries,
        [id]: [...(current.sportEntries[id] ?? []), { date: getLocalDateKey(), value: Number(value.toFixed(2)) }],
      },
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
      </aside>

      <section className={styles.content}>
        {page === 'dashboard' && <Dashboard stats={stats} state={state} setDashboardGoal={setDashboardGoal} />}
        {page === 'course' && <CoursePage state={state} stats={stats} setCourseSection={setCourseSection} />}
        {page === 'nextPizza' && <NextPizzaPage state={state} stats={stats} setNextPizzaStep={setNextPizzaStep} />}
        {page === 'weight' && <WeightPage state={state} stats={stats} addWeightEntry={addWeightEntry} />}
        {page === 'sport' && <SportPage state={state} stats={stats} addSportEntry={addSportEntry} />}
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
  if (source === 'nextPizza') return stats.nextPizza;
  if (source === 'weight') return stats.weight;
  if (source === 'sport') return stats.sport;
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
    { label: 'Теория', value: stats.theory, color: '#6d7dfc', icon: Brain },
    { label: 'Задачи', value: stats.tasks, color: '#f28c38', icon: Gauge },
    { label: 'Курс', value: stats.course, color: '#df5b7d', icon: BookOpen },
    { label: 'Next Pizza', value: stats.nextPizza, color: '#f28c38', icon: Pizza },
    { label: 'Вес', value: stats.weight, color: '#18a999', icon: Scale },
    { label: 'Спорт', value: stats.sport, color: '#121c27', icon: Dumbbell },
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
        description="Сводка собирает прогресс по подготовке к собеседованию и прохождению курса. Любой ввод на внутренних страницах сразу меняет общий процент."
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

function NextPizzaPage({
  state,
  stats,
  setNextPizzaStep,
}: {
  state: AppState;
  stats: DashboardStats;
  setNextPizzaStep: (id: string, checked: boolean) => void;
}) {
  const completedSteps = nextPizzaSteps.filter((step) => state.nextPizzaCompleted[step.id]).length;
  const completedMinutes = Math.min(completedSteps * nextPizzaStepMinutes, nextPizzaVideoMinutes);

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="Fullstack clone"
        title="Приложение Next Pizza"
        description="Отмечай каждый закрытый получасовой отрезок видео. Один шаг равен 30 минутам работы над клоном Додо Пиццы."
      >
        <ProgressRing value={stats.nextPizza} size={154} color="#f28c38" label="pizza" />
      </SectionHeader>
      <div className={styles.courseSummary}>
        <div>
          <strong>{completedSteps}</strong>
          <span>этапов закрыто</span>
        </div>
        <div>
          <strong>{nextPizzaSteps.length}</strong>
          <span>этапов всего</span>
        </div>
        <div>
          <strong>{formatVideoTime(completedMinutes)}</strong>
          <span>видео разобрано</span>
        </div>
      </div>
      <section className={styles.panel}>
        <div className={styles.panelTitle}>
          <h2>Этапы видео</h2>
          <span>{stats.nextPizza}%</span>
        </div>
        <div className={styles.pizzaGrid}>
          {nextPizzaSteps.map((step) => {
            const checked = Boolean(state.nextPizzaCompleted[step.id]);
            return (
              <label className={styles.pizzaStep} key={step.id}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => setNextPizzaStep(step.id, event.target.checked)}
                />
                <span className={checked ? styles.pizzaStepDone : ''}>
                  <CheckCircle2 size={18} />
                  <strong>{String(step.index).padStart(2, '0')}</strong>
                  <small>
                    {formatVideoTime(step.start)} - {formatVideoTime(step.end)}
                  </small>
                </span>
              </label>
            );
          })}
        </div>
      </section>
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
                    <circle cx={point.x} cy={point.y} r="12" fill="#18a999" />
                    <text className={styles.weightPointValue} x={point.x} y={point.y + 4}>
                      {point.value.toFixed(0)}
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

function SportPage({
  state,
  stats,
  addSportEntry,
}: {
  state: AppState;
  stats: DashboardStats;
  addSportEntry: (id: string, value: number) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const completedNorms = sportNorms.filter((norm) => sportMetricPercent(state.sportEntries[norm.id], norm) >= 100).length;

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="Нормативы"
        title="Спорт"
        description="Вноси общий результат сразу за 4 подхода. Для бега указывай время 10 кругов в минутах или формате 26:00."
      >
        <ProgressRing value={stats.sport} size={154} color="#121c27" label="спорт" />
      </SectionHeader>
      <div className={styles.courseSummary}>
        <div>
          <strong>{completedNorms}</strong>
          <span>нормативов закрыто</span>
        </div>
        <div>
          <strong>{sportNorms.length}</strong>
          <span>нормативов всего</span>
        </div>
        <div>
          <strong>{stats.sport}%</strong>
          <span>общая готовность</span>
        </div>
      </div>
      <div className={styles.sportGrid}>
        {sportNorms.map((norm) => {
          const entries = state.sportEntries[norm.id] ?? [];
          const days = Object.entries(lastEntryByDay(entries)).sort(([a], [b]) => a.localeCompare(b));
          const current = days.at(-1)?.[1] ?? 0;
          const previous = days.at(-2)?.[1];
          const best =
            days.length === 0
              ? 0
              // @ts-ignore
              : norm?.kind === 'higher'
                ? Math.max(...days.map(([, value]) => value))
                : Math.min(...days.map(([, value]) => value));
          const rawDelta = previous === undefined ? 0 : current - previous;
          // @ts-ignore
          const improved = previous !== undefined && (norm?.kind === 'higher' ? rawDelta > 0 : rawDelta < 0);
          // @ts-ignore
          const regressed = previous !== undefined && (norm?.kind === 'higher' ? rawDelta < 0 : rawDelta > 0);
          const percent = sportMetricPercent(entries, norm);
          const draft = drafts[norm.id] ?? '';
          const deltaText =
            previous === undefined
              ? '-'
              // @ts-ignore
              : norm?.kind === 'higher'
                ? `${rawDelta > 0 ? '+' : ''}${Math.round(rawDelta)}`
                : `${rawDelta > 0 ? '+' : rawDelta < 0 ? '-' : ''}${formatSportValue(Math.abs(rawDelta), norm)}`;

          return (
            <motion.article className={styles.sportCard} key={norm.id} whileHover={{ y: -4 }}>
              <div className={styles.sportTop}>
                <div>
                  <span>
                    Норма {formatSportValue(norm.target, norm)} {norm.unit}
                  </span>
                  <h2>{norm.title}</h2>
                </div>
                <ProgressRing value={percent} size={88} stroke={8} color={norm.accent} />
              </div>
              <form
                className={styles.sportForm}
                onSubmit={(event) => {
                  event.preventDefault();
                  addSportEntry(norm.id, parseSportInput(draft, norm.kind));
                  setDrafts((currentDrafts) => ({ ...currentDrafts, [norm.id]: '' }));
                }}
              >
                <label>
                  Результат
                  <input
                    type="text"
                    // @ts-ignore
                    inputMode={norm.kind === 'higher' ? 'numeric' : 'decimal'}
                    // @ts-ignore
                    placeholder={norm.kind === 'higher' ? '0' : '26:00'}
                    value={draft}
                    onChange={(event) => setDrafts((currentDrafts) => ({ ...currentDrafts, [norm.id]: event.target.value }))}
                  />
                </label>
                <button type="submit" aria-label={`Добавить ${norm.title}`}>
                  <Plus size={18} />
                </button>
              </form>
              <div className={styles.sportSummary}>
                <div>
                  <strong>{formatSportValue(current, norm)}</strong>
                  <span>текущий</span>
                </div>
                <div>
                  <strong>{formatSportValue(best, norm)}</strong>
                  <span>лучший</span>
                </div>
                <div>
                  <strong className={improved ? styles.weightProgress : regressed ? styles.weightRegression : ''}>
                    {deltaText}
                  </strong>
                  <span>к прошлому</span>
                </div>
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
                          tone="sport"
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
