'use client';

import { motion } from 'framer-motion';
import type { ElementType } from 'react';
import { Activity, BookOpen, Brain, CheckCircle2, Dumbbell, Gauge, Home, Medal, Route, Save, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ProgressRing } from './components/ProgressRing';
import { SectionHeader } from './components/SectionHeader';
import { SegmentedControl } from './components/SegmentedControl';
import {
  Badge,
  badgeLabels,
  courseModules,
  gtoNorms,
  marathonDistances,
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
  formatNorm,
  gtoBadgePercent,
  gtoCategoryPercent,
  gtoMedalReadiness,
  gtoTotalPercent,
  groupGtoNorms,
  parseMetric,
  taskStagePercent,
  taskTotalPercent,
  theoryItemPercent,
  theoryStagePercent,
  theoryTotalPercent,
} from './lib/progress';
import styles from './page.module.scss';

type DashboardStats = {
  gto: number;
  marathon: number;
  theory: number;
  tasks: number;
  interview: number;
  course: number;
  total: number;
};

type Page = 'dashboard' | 'gto' | 'marathon' | 'interview' | 'course';

const storageKey = 'goals-progress-state-v1';

const navItems: { id: Page; label: string; icon: ElementType }[] = [
  { id: 'dashboard', label: 'Главная', icon: Home },
  { id: 'gto', label: 'ГТО', icon: Medal },
  { id: 'marathon', label: 'Марафон', icon: Route },
  { id: 'interview', label: 'Собеседование', icon: Brain },
  { id: 'course', label: 'Курс фронтенд', icon: BookOpen },
];

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

export default function HomePage() {
  const [page, setPage] = useState<Page>('dashboard');
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) setState({ ...emptyState, ...JSON.parse(raw) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hydrated, state]);

  const stats = useMemo(() => {
    const gto = gtoTotalPercent(gtoNorms, state.gto);
    const marathon = average(
      marathonDistances.map((distance) => {
        const km = Number((state.marathon[distance.id]?.km ?? '').replace(',', '.')) || 0;
        return Math.min(100, Math.round((km / distance.distance) * 100));
      }),
    );
    const theory = theoryTotalPercent(theoryStages, state);
    const tasks = taskTotalPercent(taskStages, state);
    const interview = average([theory, tasks]);
    const course = courseTotalPercent(courseModules, state);
    return { gto, marathon, theory, tasks, interview, course, total: average([gto, marathon, interview, course]) };
  }, [state]);

  const setGto = (id: string, value: string) => {
    setState((current) => ({ ...current, gto: { ...current.gto, [id]: value } }));
  };

  const setMarathon = (id: string, field: 'km' | 'time', value: string) => {
    setState((current) => ({
      ...current,
      marathon: { ...current.marathon, [id]: { ...current.marathon[id], [field]: value } },
    }));
  };

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
        {page === 'dashboard' && <Dashboard stats={stats} />}
        {page === 'gto' && <GtoPage state={state} setGto={setGto} />}
        {page === 'marathon' && <MarathonPage state={state} setMarathon={setMarathon} />}
        {page === 'course' && <CoursePage state={state} stats={stats} setCourseSection={setCourseSection} />}
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

function Dashboard({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: 'ГТО', value: stats.gto, color: '#c99a43', icon: Dumbbell },
    { label: 'Марафон', value: stats.marathon, color: '#18a999', icon: Activity },
    { label: 'Теория', value: stats.theory, color: '#6d7dfc', icon: Brain },
    { label: 'Задачи', value: stats.tasks, color: '#f28c38', icon: Gauge },
    { label: 'Курс', value: stats.course, color: '#df5b7d', icon: BookOpen },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="Общий контроль"
        title="Все цели на одном экране"
        description="Сводка собирает прогресс по ГТО, бегу и подготовке к интервью. Любой ввод на внутренних страницах сразу меняет общий процент."
      >
        <ProgressRing value={stats.total} size={154} color="#121c27" label="всего" />
      </SectionHeader>
      <div className={styles.dashboardGrid}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.article
              className={styles.statCard}
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
    </motion.div>
  );
}

function GtoPage({ state, setGto }: { state: AppState; setGto: (id: string, value: string) => void }) {
  const grouped = groupGtoNorms(gtoNorms);
  const badges: Badge[] = ['gold', 'silver', 'bronze'];
  const readiness = gtoMedalReadiness(gtoNorms, state.gto);
  const total = gtoTotalPercent(gtoNorms, state.gto);

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="10 ступень, 30-34 года"
        title="Подготовка к ГТО"
        description="Вводи текущий результат напротив норматива. Для времени можно писать 13:20, для остальных дисциплин обычное число."
      >
        <ProgressRing value={total} size={154} color="#c99a43" label="ГТО" />
      </SectionHeader>
      <div className={styles.stack}>
        {Object.entries(grouped).map(([category, norms]) => (
          <section className={styles.panel} key={category}>
            <div className={styles.panelTitle}>
              <h2>{category}</h2>
              <span>{gtoCategoryPercent(norms ?? [], state.gto)}%</span>
            </div>
            <div className={styles.normList}>
              {(norms ?? []).map((norm) => (
                <article className={styles.normRow} key={norm.id}>
                  <div>
                    <h3>{norm.title}</h3>
                    <span>{norm.unit}</span>
                  </div>
                  <input
                    aria-label={norm.title}
                    placeholder={norm.kind === 'lowerTime' ? 'например 12:30' : '0'}
                    value={state.gto[norm.id] ?? ''}
                    onChange={(event) => setGto(norm.id, event.target.value)}
                  />
                  <div className={styles.badges}>
                    {badges.map((badge) => (
                      <div className={styles.badge} key={badge}>
                        <ProgressRing
                          value={gtoBadgePercent(norm, badge, state.gto[norm.id] ?? '')}
                          size={82}
                          stroke={8}
                          color={badge === 'gold' ? '#c99a43' : badge === 'silver' ? '#8c99a8' : '#b8755c'}
                        />
                        <span>
                          {badgeLabels[badge]}: {formatNorm(norm.norms[badge], norm.kind)}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
        <section className={styles.panel}>
          <div className={styles.panelTitle}>
            <h2>Готовность к знакам</h2>
            <span>{total}%</span>
          </div>
          <div className={styles.medalGrid}>
            {readiness.map((item) => (
              <article className={`${styles.medalCard} ${item.ready ? styles.medalReady : ''}`} key={item.badge}>
                <div className={styles.medalHead}>
                  <ProgressRing
                    value={item.percent}
                    size={104}
                    stroke={10}
                    color={item.badge === 'gold' ? '#c99a43' : item.badge === 'silver' ? '#8c99a8' : '#b8755c'}
                  />
                  <div>
                    <span>{badgeLabels[item.badge]}</span>
                    <strong>{item.ready ? 'Готов' : 'В процессе'}</strong>
                  </div>
                </div>
                <div className={styles.requirements}>
                  <div>
                    <span>Физические качества, способности, прикладные навыки</span>
                    <strong>
                      {item.completedQualities} / {item.requirements.qualities}
                    </strong>
                  </div>
                  <div>
                    <span>Испытания, которые нужно выполнить</span>
                    <strong>
                      {item.completedTests} / {item.requirements.tests}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function MarathonPage({
  state,
  setMarathon,
}: {
  state: AppState;
  setMarathon: (id: string, field: 'km' | 'time', value: string) => void;
}) {
  const total = average(
    marathonDistances.map((distance) => {
      const km = Number((state.marathon[distance.id]?.km ?? '').replace(',', '.')) || 0;
      return Math.min(100, Math.round((km / distance.distance) * 100));
    }),
  );

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        eyebrow="Беговая форма"
        title="Подготовка к марафону"
        description="Отмечай максимальную дистанцию без остановки и время тренировки. Готовность считается от целевой дистанции."
      >
        <ProgressRing value={total} size={154} color="#18a999" label="бег" />
      </SectionHeader>
      <div className={styles.distanceGrid}>
        {marathonDistances.map((distance) => {
          const value = state.marathon[distance.id] ?? { km: '', time: '' };
          const km = Number(value.km.replace(',', '.')) || 0;
          const percent = Math.min(100, Math.round((km / distance.distance) * 100));
          const pace = value.time && km ? `${(parseMetric(value.time, 'lowerTime') / 60 / km).toFixed(2)} мин/км` : 'нет темпа';
          return (
            <motion.article className={styles.distanceCard} key={distance.id} whileHover={{ y: -5 }}>
              <div className={styles.distanceTop}>
                <div>
                  <span>Дистанция</span>
                  <h2>{distance.title}</h2>
                </div>
                <ProgressRing value={percent} color={distance.accent} />
              </div>
              <label>
                Км без остановки
                <input value={value.km} onChange={(event) => setMarathon(distance.id, 'km', event.target.value)} />
              </label>
              <label>
                Время тренировки
                <input
                  placeholder="например 54:30"
                  value={value.time}
                  onChange={(event) => setMarathon(distance.id, 'time', event.target.value)}
                />
              </label>
              <div className={styles.paceLine}>
                <span>{Math.min(km, distance.distance).toFixed(1)} / {distance.distance} км</span>
                <strong>{pace}</strong>
              </div>
            </motion.article>
          );
        })}
      </div>
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
                <div className={styles.moduleNumber}>{String(index).padStart(2, '0')}</div>
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
