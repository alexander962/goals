export type GoalStage = {
  id: string;
  title: string;
  startDate: string;
  durationDays: number;
  goals: { id: string; title: string }[];
};

// Новые этапы добавляются в начало массива: свежий этап всегда показывается выше старых.
// Каждый этап рассчитан на 30 дней.
export const goalStages: GoalStage[] = [
  {
    id: 'stage-1',
    title: 'Этап 1',
    startDate: '2026-10-24',
    durationDays: 30,
    goals: [
      { id: 'three-habits', title: '3 закрытые привычки' },
      { id: 'interview-70', title: 'Собеседование — готовность 70% и выше' },
      { id: 'interview-2-70', title: 'Собеседование 2.0 — готовность 70% и выше' },
      { id: 'mini-project', title: 'Мини-проект полностью готов и изучен' },
      { id: 'weight-99', title: 'Контроль веса — 99 кг и ниже' },
      { id: 'one-c-50', title: '1С — готовность 50% и выше' },
    ],
  },
];
