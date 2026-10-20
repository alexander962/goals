export type Interview2Stage = {
  id: string;
  title: string;
  items: string[];
};

export const interview2TheoryStages: Interview2Stage[] = [
  {
    "id": "interview-2-theory-day-1",
    "title": "День 1 · Redux, тесты, Advanced React",
    "items": [
      "Redux — зачем, почему не Context, когда применять/не применять",
      "Redux vs Redux Toolkit; иммутабельность, зачем",
      "Redux vs MobX vs Zustand vs Effector; когда какой выбрать",
      "middleware, цепочка, обработка аналитики; async thunk, saga",
      "RTK Query vs TanStack Query vs thunk/saga; useQuery vs useMutation",
      "RTK Query — кэш, инвалидация, оптимистичные обновления, refetching",
      "Нормализация данных, EntityAdapter; combineReducers",
      "Zustand — отличия; MobX реактивность, observable",
      "Виды тестов (unit/integration/e2e/screenshot), пирамида, когда какие",
      "Jest, testing-library, Cypress vs Playwright",
      "HOC — что, как использовать, примеры реализации",
      "Render props, slot паттерн; Compound Components; Headless-компонент",
      "Prop drilling — проблемы и решения (композиция, контекст, сторы)",
      "Context — зачем, минусы (перерисовки), проблемы",
      "Микрофронты, Module Federation — как работает, host, деплой, как шарили данные",
      "Можем ли полностью отказаться от классовых компонентов",
      "Версионирование компонентов в микрофронтах"
    ]
  },
  {
    "id": "interview-2-theory-day-2",
    "title": "День 2 · React: хуки и fiber",
    "items": [
      "Какие хуки знаешь / используешь; правила хуков",
      "useEffect — параметры, массив зависимостей, cleanup, моменты срабатывания",
      "useEffect vs useLayoutEffect — разница",
      "useMemo vs useCallback vs React.memo — когда использовать, когда бесполезно",
      "useRef — для чего, что хранить, примитивы; useRef vs useState",
      "React.memo — как работает, второй параметр (areEqual)",
      "useImperativeHandle, forwardRef; createRef vs useRef",
      "useTransition, useDeferredValue",
      "useReducer — может ли заменить глобальный стор",
      "Что если не указать массив зависимостей; функции в зависимостях",
      "Чревато ли повсеместное useCallback/useMemo",
      "useState: обновление через значение vs колбэк; ленивая инициализация",
      "Можно ли useEffect внутри if/else",
      "Error Boundary — что, почему на классах, какие ошибки ловит/не ловит",
      "Suspense — для чего, оборачивание lazy",
      "Lazy loading — что",
      "SSR vs CSR vs SSG vs ISR — когда что",
      "Гидратация (hydrate) — что это; hydration mismatch"
    ]
  },
  {
    "id": "interview-2-theory-day-3",
    "title": "День 3 · React: оптимизация и формы (7 теорий)",
    "items": [
      "Reconciliation — как React понимает, что обновлять, эвристика O(n)",
      "Virtual DOM — зачем, как устроен, почему быстрее",
      "React Fiber — что, какие задачи решает",
      "Жизненный цикл компонента (функциональные/классовые)",
      "Зачем key в списках, можно ли индекс, что если одинаковый/поменять местами",
      "Причины ререндера компонента; является ли props причиной",
      "Батчинг в React (18+), automatic batching",
      "Классовые vs функциональные, аналоги жизненного цикла в useEffect",
      "Какие методы жизненного цикла нельзя воспроизвести useEffect; componentDidCatch",
      "Что такое JSX, можно ли без JSX; чистые компоненты, PureComponent",
      "Способы оптимизации React-приложения",
      "Controlled vs uncontrolled input; прочитать оба при submit",
      "Зачем ref в React; как пробросить ref через props, forwardRef",
      "Портал — для чего",
      "React Hook Form + Zod, multi-step формы; типизация формы",
      "Touched/Dirty, подходы к валидации",
      "React.lazy (ленивые компоненты)"
    ]
  },
  {
    "id": "interview-2-theory-day-4",
    "title": "День 4 · Асинхронность (13 теорий)",
    "items": [
      "Event Loop — как работает (стек, очередь, микротаски/макротаски)",
      "Микротаски vs макротаски — что относится, зачем разделение",
      "Promise — состояния, методы",
      "async/await — что, как работает под капотом, что возвращает",
      "Как обработать ошибку в Promise (.catch, .then(null, onRejected))",
      "try/catch в async, обработка sync/async ошибок; можно ли await без async",
      "requestAnimationFrame vs requestIdleCallback, queueMicrotask",
      "Web Workers vs Service Workers — разница, когда что; почему у воркеров нет DOM",
      "AbortController — как отменить запрос, отмена при размонтировании",
      "setTimeout delay=0, минимальная задержка; что возвращает",
      "Debounce / throttle — где применять, отличие; как отменить debounce",
      "Многопоточность в JS; BroadcastChannel для общения",
      "Race condition — как решать",
      "localStorage vs sessionStorage vs cookie — отличия, назначение",
      "IndexedDB — что, когда использовать",
      "Что где хранить (токен/данные/настройки); где хранить корзину между вкладками (storage event)"
    ]
  },
  {
    "id": "interview-2-theory-day-5",
    "title": "День 5 · Замыкания, this, прототипы (11 теорий)",
    "items": [
      "Замыкание — что, где применяется, как работает scope",
      "this, контекст, виды; разница у стрелочной и обычной функции (момент определения)",
      "call / apply / bind — отличия",
      "Прототипное наследование, proto vs prototype, цепочка прототипов",
      "Стрелочная vs обычная функция (this, new, arguments, prototype); function declaration vs expression",
      "ООП в JS — классы, принципы (инкапсуляция/наследование/полиморфизм)",
      "Лексическое окружение vs область видимости; потеря this",
      "Каррирование, частичное применение, декораторы (once, memoize, throttle, debounce)",
      "Статические методы классов, static и this",
      "proto — у каких объектов есть, как установить прототип",
      "Как проверить что метод у объекта, а не у прототипа (hasOwnProperty)",
      "Клонирование объекта, 3 способа; минусы JSON.stringify",
      "WeakMap / WeakSet — зачем, отличие, сборка мусора",
      "Proxy — что, для чего, как работает; Reflect",
      "Всплытие, погружение, делегирование событий, фазы (capture/target/bubble)",
      "target vs currentTarget; stopPropagation vs stopImmediatePropagation",
      "preventDefault — для чего; event.defaultPrevented",
      "Intersection / Mutation / Resize Observer — какие знаешь",
      "Infinite scroll — как реализован (IntersectionObserver)"
    ]
  },
  {
    "id": "interview-2-theory-day-6",
    "title": "День 6 · Основы JS и хранилища",
    "items": [
      "Типы данных в JS, примитивы vs ссылочные, куча vs стек",
      "var / let / const — отличия, hoisting, TDZ, область видимости, window",
      "Способы копирования объектов (shallow/deep), глубокое копирование, нюансы (Date, циклы, функции)",
      "Методы массивов (map/filter/reduce/forEach); мутирующие vs немутирующие",
      "== vs ===, приведение типов, таблица преобразований",
      "null vs undefined, typeof null, typeof NaN, typeof function",
      "NaN — что такое; 0.1 + 0.2 — почему; BigInt vs Number",
      "Set / Map / WeakMap / WeakSet — разница, где применять, под капотом",
      "Map vs объект — разница, когда Map предпочтительнее",
      "rest vs spread, деструктуризация, Object.assign vs spread",
      "Методы Object (keys/values/entries/assign), freeze vs seal, structuredClone",
      "Иммутабельность, какие типы мутабельные, зачем, плюсы/минусы",
      "Новые методы: toSorted, toReversed, with, Object.groupBy",
      "typeof, keyof; автобоксинг (методы у примитивов)",
      "Итераторы, генераторы, итерируемые, Symbol.iterator",
      "use strict — что даёт",
      "Сборщик мусора (mark-and-sweep), утечки памяти, JS однопоточный",
      "Принципы SOLID, DRY, KISS, YAGNI, функциональное vs ООП, чистая функция, HOF, каррирование",
      "Паттерны проектирования, разница декоратор vs адаптер"
    ]
  },
  {
    "id": "interview-2-theory-day-7",
    "title": "День 7 · TypeScript и работа с объектами (16 теорий)",
    "items": [
      "Зачем TS, плюсы/минусы, обязательно ли везде",
      "interface vs type — когда что",
      "Generics (дженерики) — зачем, где использовать, T extends",
      "Utility Types: Partial / Pick / Omit / Record / Readonly / Required / NonNullable / Extract / Exclude / ReturnType / Parameters",
      "any vs unknown vs never vs void",
      "Type guards (is, in, instanceof, typeof); narrowing error: unknown",
      "Conditional types, infer; Intersection vs Union",
      "Перегрузка функции vs объединение аргументов; слияние интерфейсов",
      "keyof, typeof, as const; enum vs const enum, минусы enum",
      "Реализовать свой Pick / Omit / OptionalRecord / MyReturnType через infer",
      "Дискриминирующие объединения, literal types",
      "Что такое declare (declare global), as / утверждение типов",
      "readonly (в том числе вложенных); abstract vs обычный класс",
      "SOLID принципы с примерами; DI",
      "Паттерны (Observer, Singleton, Factory, Decorator, Facade, Strategy, адаптер, мост)",
      "DRY / KISS / YAGNI",
      "Можно ли SOLID в React, где проявляется; какие паттерны в React"
    ]
  },
  {
    "id": "interview-2-theory-day-8",
    "title": "День 8 · Next, архитектура, сборка",
    "items": [
      "Что такое Next.js, зачем, плюсы над React, критерии выбора",
      "App Router vs Pages Router; getServerSideProps vs getStaticProps",
      "Виды рендеринга в Next (SSR/SSG/ISR/CSR) — когда что; серверные vs клиентские компоненты",
      "Webpack vs Vite vs Rollup — отличия; что настраивал; Vite — 2 типа сборщика",
      "Что такое бандл, чанки; может ли бандл быть из одного файла; типы хэшей",
      "Динамический импорт; tree-shaking / code-splitting / source-map; минификация",
      "Module Federation — как работает, Single SPA; микрофронты; event bus",
      "Babel — что делает, транспиляция vs компиляция",
      "Docker — зачем, контейнеризация, Entrypoint vs CMD; опыт",
      "CI/CD — GitHub Actions / GitLab, pipelines, Jenkins",
      "npm install vs npm ci; yarn.lock vs package-lock.json; npmrc/yarnrc",
      "Tailwind — кастомные свойства, layer, модули",
      "Flux-архитектура — принцип; MVC / MVVM — где в React",
      "FSD — что такое, слои, плюсы/минусы, когда применять/не нужно, альтернативы",
      "FSD — как внедряли/мигрировали с монолита, трудности",
      "FSD — feature vs entity; почему нельзя из app импортировать в shared",
      "Atomic Design, плоская структура; FSD vs Atomic",
      "Микрофронты vs монолит; Module Federation — опыт",
      "Спроектировать мессенджер / чат-клиент (требования, буфер, балансировка, БД, CDN)"
    ]
  },
  {
    "id": "interview-2-theory-day-9",
    "title": "День 9 · Сети, безопасность, производительность (29 теорий)",
    "items": [
      "Методы HTTP по CRUD, коды ответов, редиректы (3xx), 409/425",
      "CORS — что это, заголовки, preflight OPTIONS, как обойти/разрешить домен",
      "REST API — что, принципы, ограничения; REST vs RPC vs RESTful",
      "Версии HTTP 1/2/3 — отличия, мультиплексирование",
      "PUT vs PATCH, идемпотентность; что будет если в PUT изменить одно поле",
      "HTTP vs HTTPS — отличия, что шифруется",
      "WebSocket — как работает, установка соединения, где применял, подтверждение доставки",
      "WebSocket vs SSE vs long-polling, polling",
      "CDN — как работает, что такое",
      "GET vs POST, можно ли body в GET, можем ли через GET создать ресурс",
      "Из чего состоит HTTP-запрос, зачем headers",
      "Throttle vs debounce, оптимизация запросов при вводе в поиск",
      "Кэширование HTTP, Cache-Control, E-Tag, Last-Modified, как заставить не кэшировать",
      "JWT — что, структура, зачем access/refresh, процесс авторизации",
      "XSS — что, защита, примеры, экранирование в React",
      "Где хранить токены (httpOnly cookie / localStorage / memory)",
      "CSRF — способы защиты; CORS vs CSP простыми словами",
      "Куки: Secure / HttpOnly / SameSite; как устроены; расшарить между доменами",
      "Аутентификация vs авторизация"
    ]
  },
  {
    "id": "interview-2-theory-day-10",
    "title": "День 10 · HTML, CSS, Git (35 теорий)",
    "items": [
      "Способы центрирования элемента (flex, grid, absolute+transform)",
      "Специфичность селекторов (числовая оценка, кортеж)",
      "position: значения (relative/absolute/fixed/sticky)",
      "flex vs grid — когда что использовать",
      "display: значения; display:none vs visibility:hidden vs opacity:0",
      "Псевдоклассы и псевдоэлементы, примеры",
      "rem vs em vs px, единицы измерения (vw, vh)",
      "z-index, stacking context; может ли меньший перекрыть больший",
      "Reflow vs Repaint, Composite, выделение слоя на GPU",
      "will-change — зачем, что будет если для всех элементов",
      "Блочная модель, box-sizing: border-box/content-box",
      "Плюсы/минусы CSS-in-JS, CSS Modules, styled-components",
      "Критические этапы рендеринга (Critical Rendering Path)",
      "BEM — методология, «не привязываться к контексту в названии класса»",
      "Кроссбраузерность, адаптивная вёрстка, медиазапросы",
      "Препроцессоры (SCSS/LESS), SCSS vs CSS-переменные",
      "!important — как часто использую, как перебить, inline-стили",
      "flex-grow / flex-shrink / flex-basis, align-items vs align-self",
      "git merge vs git rebase — отличие, что лучше",
      "Какие git-команды знаешь, workflow работы над задачей, git flow, стратегии ветвления",
      "Что хранится в коммите, как называли коммиты, были ли pre-commit/линтеры"
    ]
  },
  {
    "id": "interview-2-theory-day-11",
    "title": "День 11 · HTML, CSS, Git (35 теорий)",
    "items": [
      "Что происходит от ввода URL до отрисовки (DNS, IP, TCP, TLS, HTTP, рендер)",
      "Семантическая вёрстка (header/footer/main/nav/aside/article/section), зачем",
      "async / defer у скриптов — разница, порядок загрузки, несколько defer",
      "Что такое DOM, как работает",
      "picture vs img, srcset, адаптивные изображения",
      "aria-атрибуты, accessibility, доступность",
      "DOMContentLoaded vs onload, document.readyState",
      "HTML4 vs HTML5, какие семантические теги добавились",
      "data-атрибуты — для чего",
      "Атрибуты формы, методы, что при submit, как перехватить",
      "Сколько тегов main / header / footer можно на странице",
      "Блокирует ли CSS парсинг HTML",
      "role=button vs role=click, lang-атрибут — на что влияет",
      "Какие самые тяжёлые HTML-теги",
      "Core Web Vitals (LCP / FID/INP / CLS / TTI / TBT / FCP), Lighthouse",
      "Как оптимизировать приложение / фронт — перечислить подходы",
      "Оптимизация картинок, шрифтов, минификация, gzip, code splitting",
      "Виртуализация списков vs infinite scroll; таблица 10000 строк",
      "Ленивая загрузка, lazy loading, динамический импорт"
    ]
  }
];

export const interview2TaskStages: Interview2Stage[] = [
  {
    "id": "interview-2-tasks-main",
    "title": "1 этап · Основные задачи",
    "items": [
      "`useQuery` с кэшем и типизацией",
      "Two Sum через Map",
      "`useDebounce(value, delay)`",
      "Event Loop: три примера из указанных номеров",
      "React-компонент с антипаттернами, задачи 1 и 6",
      "Палиндром и оценка сложности",
      "Свой `Promise.all`",
      "React: убрать лишние ререндеры, задачи 2, 3 и 9",
      "`createCounter` на замыкании",
      "Цепочки `Promise.reject`, три примера",
      "`var + setTimeout`: три исправления",
      "Глубокое копирование",
      "Свои Pick / Omit / Partial / ReturnType",
      "`useFetch` с отменой при размонтировании",
      "`MyReturnType` через `infer`",
      "Debounce: trailing и leading",
      "Throttle: leading и trailing",
      "Longest substring without repeating",
      "`memoize` с методом `clear`",
      "Слушатели в цикле по nodes",
      "FizzBuzz с акцентом на DRY",
      "Свои bind / call / apply",
      "Потеря `this`, задачи context 2 и 4",
      "Анаграммы, задачи algorithms 4 и 5"
    ]
  },
  {
    "id": "interview-2-tasks-reserve",
    "title": "2 этап · Резервные задачи",
    "items": [
      "parallelLimit с лимитом и мемоизацией",
      "fetchWithRetry через рекурсию",
      "sleep и withTimeout",
      "AbortController при размонтировании",
      "deepEqual",
      "setClicks и функциональный setter",
      "Валидация скобок",
      "Flat любой вложенности по указанным repo-вариантам",
      "Автокомплит с debounce и отменой гонки",
      "EventEmitter с чейнингом",
      "get по строковому пути",
      "useLocalStorage<T>",
      "VirtualList",
      "Модалка через портал",
      "Обход дерева без рекурсии",
      "Type guard isCat"
    ]
  }
];

