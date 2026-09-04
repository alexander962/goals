export type Badge = 'gold' | 'silver' | 'bronze';
export type MetricKind = 'higher' | 'lowerTime' | 'higherSigned';

export type GtoNorm = {
  id: string;
  title: string;
  category: string;
  kind: MetricKind;
  unit: string;
  norms: Record<Badge, number>;
};

export type TheoryItem =
  | {
      id: string;
      title: string;
      mode: 'counter';
      target?: number;
    }
  | {
      id: string;
      title: string;
      mode: 'status';
    };

export type TheoryStage = {
  id: string;
  title: string;
  items: TheoryItem[];
};

export type TaskStage = {
  id: string;
  title: string;
  tasks: string[];
};

export type CourseModule = {
  id: string;
  title: string;
  sections: string[];
};

export const badgeLabels: Record<Badge, string> = {
  gold: 'Золото',
  silver: 'Серебро',
  bronze: 'Бронза',
};

export const gtoNorms: GtoNorm[] = [
  {
    id: 'run-60',
    title: 'Бег на 60 м',
    category: 'Скорость',
    kind: 'lowerTime',
    unit: 'сек',
    norms: { gold: 8.8, silver: 10.9, bronze: 12.3 },
  },
  {
    id: 'run-3000',
    title: 'Бег на 3000 м',
    category: 'Выносливость',
    kind: 'lowerTime',
    unit: 'мин:сек',
    norms: { gold: 780, silver: 870, bronze: 930 },
  },
  {
    id: 'cross-5k',
    title: 'Кросс на 5 км',
    category: 'Выносливость',
    kind: 'lowerTime',
    unit: 'мин:сек',
    norms: { gold: 1350, silver: 1560, bronze: 1710 },
  },
  {
    id: 'run-1000',
    title: 'Бег на 1000 м',
    category: 'Выносливость',
    kind: 'lowerTime',
    unit: 'мин:сек',
    norms: { gold: 225, silver: 246, bronze: 302 },
  },
  {
    id: 'ski-5k',
    title: 'Бег на лыжах на 5 км',
    category: 'Выносливость',
    kind: 'lowerTime',
    unit: 'мин:сек',
    norms: { gold: 1380, silver: 1590, bronze: 1770 },
  },
  {
    id: 'bend',
    title: 'Наклон вперед на гимнастической скамье',
    category: 'Гибкость',
    kind: 'higherSigned',
    unit: 'см',
    norms: { gold: 11, silver: 5, bronze: 3 },
  },
  {
    id: 'pullups',
    title: 'Подтягивания из виса на высокой перекладине',
    category: 'Сила',
    kind: 'higher',
    unit: 'раз',
    norms: { gold: 13, silver: 8, bronze: 4 },
  },
  {
    id: 'pushups',
    title: 'Сгибание и разгибание рук в упоре лежа',
    category: 'Сила',
    kind: 'higher',
    unit: 'раз',
    norms: { gold: 33, silver: 19, bronze: 15 },
  },
  {
    id: 'kettlebell',
    title: 'Рывок гири 16 кг',
    category: 'Сила',
    kind: 'higher',
    unit: 'раз',
    norms: { gold: 40, silver: 22, bronze: 18 },
  },
  {
    id: 'low-pullups',
    title: 'Подтягивания из виса лежа на низкой перекладине 90 см',
    category: 'Сила',
    kind: 'higher',
    unit: 'раз',
    norms: { gold: 23, silver: 15, bronze: 10 },
  },
  {
    id: 'long-jump',
    title: 'Прыжок в длину с места',
    category: 'Скоростно-силовые',
    kind: 'higher',
    unit: 'см',
    norms: { gold: 234, silver: 213, bronze: 197 },
  },
  {
    id: 'situps',
    title: 'Поднимание туловища за 1 мин',
    category: 'Скоростно-силовые',
    kind: 'higher',
    unit: 'раз',
    norms: { gold: 42, silver: 32, bronze: 25 },
  },
  {
    id: 'throw',
    title: 'Метание спортивного снаряда 700 г',
    category: 'Прикладные навыки',
    kind: 'higher',
    unit: 'м',
    norms: { gold: 35, silver: 30, bronze: 26 },
  },
  {
    id: 'swim',
    title: 'Плавание на 50 м',
    category: 'Прикладные навыки',
    kind: 'lowerTime',
    unit: 'мин:сек',
    norms: { gold: 55, silver: 65, bronze: 82 },
  },
  {
    id: 'shoot-sit',
    title: 'Стрельба из винтовки с открытым прицелом',
    category: 'Прикладные навыки',
    kind: 'higher',
    unit: 'очки',
    norms: { gold: 25, silver: 20, bronze: 15 },
  },
  {
    id: 'shoot-optic',
    title: 'Стрельба из винтовки с диоптрическим прицелом',
    category: 'Прикладные навыки',
    kind: 'higher',
    unit: 'очки',
    norms: { gold: 30, silver: 25, bronze: 18 },
  },
  {
    id: 'hike',
    title: 'Туристский поход с проверкой навыков',
    category: 'Прикладные навыки',
    kind: 'higher',
    unit: 'навыков',
    norms: { gold: 7, silver: 5, bronze: 3 },
  },
];

export const marathonDistances = [
  { id: 'run-10', title: '10 км', distance: 10, accent: '#18a999' },
  { id: 'run-21', title: '21 км', distance: 21.1, accent: '#f28c38' },
  { id: 'run-42', title: '42 км', distance: 42.2, accent: '#6d7dfc' },
];

export const theoryStages: TheoryStage[] = [
  {
    id: 'theory-1',
    title: '1 этап',
    items: [
      { id: 'js-advanced', title: 'JS продвинутый', mode: 'counter' },
      { id: 'react-answers', title: 'React вопросы с ответами', mode: 'counter' },
      { id: 'react-hooks', title: 'Хуки React', mode: 'counter' },
      { id: 'common-interview', title: 'Вопросы с собеседований', mode: 'counter' },
      { id: 'ts-answers', title: 'TS - вопросы и ответы', mode: 'status' },
    ],
  },
  {
    id: 'theory-2',
    title: '2 этап',
    items: [
      { id: 'git', title: 'Git', mode: 'status' },
      { id: 'next', title: 'Next.js', mode: 'status' },
      { id: 'architecture', title: 'Архитектура', mode: 'status' },
      { id: 'state-managers', title: 'Redux Toolkit, MobX, Zustand, React Query', mode: 'status' },
      { id: 'devops', title: 'Nginx, Docker, CI/CD, Babel', mode: 'status' },
    ],
  },
  // Временно скрыто. Вернуть вместе с подготовкой по Vue.
  // {
  //   id: 'theory-3',
  //   title: '3 этап',
  //   items: [{ id: 'vue-basic', title: 'Vue основы', mode: 'status' }],
  // },
];

export const taskStages: TaskStage[] = [
  {
    id: 'js-tasks',
    title: 'Задачи interviews - js',
    tasks: [
      'test-tasks',
      'task1',
      'task2',
      'task3',
      'task4',
      'task 5',
      'factorial',
      'fibonacci',
      'copyObj',
      'deepEqual',
      'myBind',
      'myBind2',
      'myMap',
      'promise',
      'merge-sorted-arrays',
      'sorted-squares',
      'two-sum',
      'task 6',
      'task7',
      'task 8',
      'task9',
      'task10',
      'task11',
      'task12',
      'task13',
      'task14',
      'task15',
      'task 16',
      'task17',
    ],
  },
  {
    id: 'methods',
    title: 'Methods',
    tasks: ['array', 'math', 'objects', 'strings', 'date'],
  },
  {
    id: 'react-tasks',
    title: 'Задачи react-tasks',
    tasks: [
      'task0',
      'task1',
      'task2',
      'task3',
      'task4',
      'task5',
      'task6',
      'task7',
      'task8',
      'task9',
      'task10',
      'task11',
      'task12',
      'task13',
    ],
  },
  {
    id: 'new-task',
    title: 'Задачи new-task',
    tasks: [
      'debounce',
      'throttle',
      'task18',
      'task19',
      'task20',
      'task21',
      'task22',
      'task23',
      'task24',
      'task25',
      'task26',
      'task27',
      'task28',
      'task29',
      'task30',
      'task31',
      'task32',
      'task33',
      'task34',
      'task35',
      'task36',
      'task37',
      'task38',
      'task39',
      'task40',
    ],
  },
  {
    id: 'ts-tasks',
    title: 'Задачи ts-tasks',
    tasks: [
      '1-coordinate-tuple.ts',
      '1-first-element-generic.ts',
      '1-format-user.ts',
      '1-object-keyof.ts',
      '1-order-status.ts',
      '1-products-total.ts',
      '1-shape-union.ts',
      '1-type-guard.ts',
      '1-update-settings.ts',
      '1-user-role-enum.ts',
    ],
  },
  // Временно скрыто. Вернуть вместе с подготовкой по Vue.
  // {
  //   id: 'vue-tasks',
  //   title: 'Задачи vue-tasks',
  //   tasks: ['task0', 'task1', 'task2', 'task3', 'task4', 'task5', 'task6'],
  // },
];

export const interview2TheoryStages: TheoryStage[] = [
  {
    id: 'interview-2-theory-1',
    title: '1 этап',
    items: [
      {
        id: 'interview-2-important-questions',
        title: 'Важные вопросы с собеседований (25 вопросов)',
        mode: 'counter',
        target: 25,
      },
    ],
  },
  {
    id: 'interview-2-theory-2',
    title: '2 этап',
    items: [
      {
        id: 'interview-2-familiar-questions',
        title: 'Вопросы с собеседований, частично знакомые мне (109 вопросов)',
        mode: 'counter',
        target: 109,
      },
      {
        id: 'interview-2-new-questions',
        title: 'Вопросы с собеседований, новые для меня (31 вопрос)',
        mode: 'counter',
        target: 31,
      },
    ],
  },
];

const interview2JsTasks = `tasks-with-oral-answers.js
1-array-to-object-1.js
1-binary-tree-value-sum-1.js
1-closure-loop-2.js
1-count-with-delay-1.js
1-descending-order-coercion-sum-1.js
1-expression-json-1.js
1-fibonacci-1.js
1-find-unique-number-times-1.js
1-fizzbuzz-dry-1.js
1-ide-search-1.js
1-monotonic-array-1.js
1-palindrome-anagram-1.js
1-pangram-duplicates-1.js
1-phone-mask-path-parser-1.js
1-reverse-number-1.js
1-sleep-delay-1.js
1-squares-reduce-number-times-1.js
1-string-case-1.js
1-string-counting-1.js
1-valid-brackets-1.js
1-yes-then-no-1.js
2-antimeridian-typewriter-1.js
2-array-polyfills-1.js
2-array-special-1.js
2-auth-promises-2.js
2-booking-calculate-1.js
2-custom-array-methods-1.js
2-digit-sort-counting-1.js
2-event-loop-2.js
2-fetch-debounce-throttle-2.js
2-fetch-with-retry-2.js
2-fibonacci-max-stack-1.js
2-flat-1.js
2-function-utils-1.js
2-group-by-1.js
2-longest-substring-1.js
2-math-stack-1.js
2-matrix-algorithms-1.js
2-mixed-algorithms-1.js
2-most-repeated-nested-1.js
2-number-chain-named-arithmetic-1.js
2-object-helpers-1.js
2-promise-combinators-2.js
2-range-extraction-1.js
2-recursive-sum-1.js
2-reorder-quicksort-1.js
2-replace-quotes-1.js
2-request-queue-2.js
2-roman-list-1.js
2-route-booking-1.js
2-run-sequence-2.js
2-set-and-pairs-1.js
2-sort-evens-only-1.js
2-sorted-intersection-merge-1.js
2-stack-queue-pagination-1.js
2-sum-promises-1.js
2-sum-search-1.js
2-time-limit-2.js
2-top-users-bounding-box-1.js
2-tree-iterative-directory-1.js
2-tree-scanner-duplicates-1.js
2-unique-random-array-1.js
2-unix-path-time-1.js
3-all-sequences-city-combinations-1.js
3-atm-1.js
3-check-result-2.js
3-coins-digits-unsorted-subarray-1.js
3-copy-equal-dictionary-1.js
3-currency-converter-2.js
3-events-and-spy-1.js
3-fetch-partial-parallelize-2.js
3-grid-string-1.js
3-median-two-sorted-1.js
3-message-buffer-connect-render-1.js
3-parallel-limit-memo-2.js
3-run-with-concurrency-2.js
3-viewers-strokes-1.js`.split('\n');

const interview2TsTasks = `1-get-property.ts
1-number-sign-enum.ts
1-optional-interface.ts
1-point-omit.ts
1-type-guards.ts
2-custom-utility-types.ts
2-filtered-object-keys-value.ts
2-form-fields-global.ts
2-functionify-and-constraint.ts
2-generic-hoc.ts
2-intersections-teacher-virus.ts
2-mapping-array-element.ts
2-recursive-json.ts
3-container-includes-equal-append.ts
3-generic-object-fetch-query.ts
3-resolvable-keys-paths.ts`.split('\n');

export const interview2TaskStages: TaskStage[] = [
  { id: 'interview-2-js-tasks', title: 'Задачи JS', tasks: interview2JsTasks },
  { id: 'interview-2-ts-tasks', title: 'Задачи TypeScript', tasks: interview2TsTasks },
  {
    id: 'interview-2-react-tasks',
    title: 'Задачи React',
    tasks: ['task0.md', 'task1.md', 'task2.md', 'task3.md'],
  },
];

export const courseModules: CourseModule[] = [
  {
    id: 'course-1',
    title: '1. Webpack. Введение в архитектуру',
    sections: [
      'Начало разработки. Метка',
      'Декомпозиция конфигурации',
      'Webpack-dev-server и env',
      'Подключаем React и метка',
      'Настраиваем CSS modules',
      'Роутинг. Code splitting',
      'Организация стилей и темы',
      'classNames. Создаем утилиту',
      'Архитектура. Введение',
      'Архитектура. Начальная метка',
    ],
  },
  {
    id: 'course-2',
    title: '2. Router, App Layout, i18n, eslint, jest',
    sections: [
      'AppRouter. Конфигурация роутера',
      'Navbar. Шаблон компонента',
      'SVG loader и Button UI kit',
      'Sidebar. Layout и метка',
      'i18n. Интернационализация',
      'Webpack hot module replacement',
      'Babel extract plugin',
      'Настраиваем ESLint',
      'Stylelint plugin for i18next',
      'Тестовая среда и метка',
      'Несущие страницы',
      'Дополнение к модулю',
    ],
  },
  {
    id: 'course-3',
    title: '3. Тесты и качество',
    sections: [
      'ErrorBoundary. Обработка ошибок',
      'Анализ размера bundle analyzer',
      'React Testing Library. Метка',
      'Настраиваем Storybook',
      'Скриншотные тесты',
      'CI pipeline. Автоматизация',
      'Сайдбар. Состояние и report',
      'Дополнение к модулю',
    ],
  },
  {
    id: 'course-4',
    title: '4. Работа с данными',
    sections: [
      'Модальное окно. Portal',
      'Redux Toolkit Entity',
      'Исправляем глобальную Modal',
      'JSON server. Имитация бэкенда',
      'Кастомный Input',
      'Husky. Pre commit хуки',
      'Авторизация. Reducer',
    ],
  },
  {
    id: 'course-5',
    title: '5. Асинк редюсеры',
    sections: [
      'Оптимизация асинхронного бандла',
      'Тестирование фичи asyncThunk',
      'Страница профиля и memo',
      'Инстанс API. ApiUrl',
      'Модуль профиля strict mode',
      'Чиним типы и project config',
      'Дополнение к модулю',
    ],
  },
  {
    id: 'course-6',
    title: '6. Модуль профиля',
    sections: [
      'Большой урок. Роуты профиля',
      'Валидация профиля и ошибок',
      'Переменная __PROJECT__ профиля',
      'Color palette. Внедряем тему',
      'npm concurrent templates',
      'React refresh plugin и babel loader',
    ],
  },
  {
    id: 'course-7',
    title: '7. Статьи, комментарии',
    sections: [
      'Router v6 private маршруты',
      'ArticlesPage и ArticleDetails',
      'Entity article. Async thunk loader',
      'Страница статьи и метка',
      'Модуль комментариев и метка',
    ],
  },
  {
    id: 'course-8',
    title: '8. Профили',
    sections: [
      'Профили пользователя. Entity form',
      'Апгрейд сайдбара и селекторы',
      'Список статей. Состояние вида',
      'Статья. EntityAdapter selector',
      'Пагинация. InfiniteScroll',
    ],
  },
  {
    id: 'course-9',
    title: '9. Троттлинг',
    sections: [
      'Инициализация reducers',
      'Троттлинг useThrottle',
      'Большой урок. Debounce',
      'Список рекомендаций',
      'Создание и редактирование pages',
      'CopyPlugin. Подготовка метки',
    ],
  },
  {
    id: 'course-10',
    title: '10. Виртуализация',
    sections: [
      'Оптимизация большой виртуализации',
      'ESLint. Пишем свой plugin',
      'Позиционирование в системе',
      'Семантика. Метка',
      'Headless UI. React aria Listbox',
      'Dropdown. User avatar',
    ],
  },
  {
    id: 'course-11',
    title: '11. Генератор слоев',
    sections: [
      'Генератор фичей на Node.js',
      'RTK Query. Начало и метка',
      'HTML report для тестов',
      'Исправляем баг с профилем',
      'Роли пользователей. Open page',
      'Исправляем проблемы',
      'Миграция на React 18 addon',
      'TS isolated modules',
      'Circular dependencies',
      'Миграция на Babel loader',
      'Дополнение к модулю',
    ],
  },
  {
    id: 'course-12',
    title: '12. Popover',
    sections: [
      'Popover notifications. Polling',
      'Drawer overlay. Метка',
      'useModal. Рефакторинг Drawer',
      'Динамические модули',
      'Алиасы TypeScript',
      'BrowserList. Размер и метка',
      'Настраиваем Vite для dev',
      'StarRating. Модуль профиля',
      'Имплементация метки',
    ],
  },
  {
    id: 'course-13',
    title: '13. Архитектурные правила ESLint',
    sections: [
      'Алиасы в Storybook. Порядок',
      'Опции в линтере. Метка',
      'Ограничения imports',
      'Testing public api plugin',
      'Рефакторинг конфига',
      'Layer imports. Улучшаем слои',
      'Shared UI public api',
      'ESLint plugin. Метка',
      'Делаем autofix линтера',
      'Документация проекта',
      'Алиасы в Jest fullscreen',
      'Storybook addon theme',
      'Generic components. Метка',
      'Однозначное сопоставление selectorsList',
      'Улучшаем стандарт роутером',
      'Рефакторинг entities',
      'Улучшаем сборку. Метка',
      'BuildSlice и BuildSelector',
    ],
  },
  {
    id: 'course-14',
    title: '14. E2E Cypress тесты',
    sections: [
      'Работа с изображениями. Метка',
      'Тесты на роутер',
      'Lint staged и pre commit',
      'Генерация отчета',
      'Отчет для unit tests',
      'Autofix для ESLint путей',
      'Исправляем проблемы Storybook',
      'Введение в e2e тесты',
      'E2E тесты. Запросы и оценку',
      'Моки. Стабильность фикстур',
      'Изолированные тесты. Метка',
      'Prettier для форматирования ESLint',
      'Облачный сервер. Метка',
      'Nginx. Конфиг сервером',
      'Nginx gzip. Сжатие',
      'SSL. Сертификат HTTPS',
      'Проксирование params',
      'Скрипт для деплоя. Метка',
    ],
  },
  {
    id: 'course-15',
    title: '15. Модели ветвления GIT',
    sections: [
      'Селекторы с аргументами',
      'Модели ветвления. Git Flow',
      'Концепция Feature sliced',
      'Унификация работы',
      'JSON Settings. Метка',
      'Запрос на получение',
      'Практика. Метка',
      'ToggleFeature. Метка',
    ],
  },
  {
    id: 'course-16',
    title: '16. Редизайн проекта',
    sections: [
      'Макеты. Layout',
      'SVGR. Обработка сборки',
      'Редизайн UI kit',
      'Редизайн Sidebar. Ссылки',
      'Редизайн Navbar',
      'Sticky Layout для статей',
      'Addon left right',
      'Редизайн карточки профиля',
      'Исправляем скрипт',
      'Редизайн ленты статей',
      'Редизайн плиточного вида',
      'Переключение фичей',
      'Рефакторинг портала',
      'Виджет с дополнительной формой',
      'Редизайн ArticleDetails',
      'Редизайн рейтинга комментариев',
      'Редизайн модального окна',
      'ForceUpdate. Метка',
      'Редизайн скролла',
      'AppLoader выбранно',
      'Toolbar как часть layout route',
      'HOC with theme',
      'Проверяем автоматические флаги',
      'Validate проблемы',
    ],
  },
];
