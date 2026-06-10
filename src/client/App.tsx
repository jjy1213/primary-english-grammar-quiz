import { CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";

type QuizMode = "random" | "knowledgePoint";
type QuestionSourceType = "choice" | "cloze";
type QuestionTypeFilter = "all" | QuestionSourceType;
type PetType = "dog" | "cat";
type ThemeType =
  | "peppa"
  | "wolffy"
  | "ultraman"
  | "octonauts"
  | "paw-patrol"
  | "demon-slayer"
  | "disney"
  | "gundam"
  | "pokemon";

interface KnowledgePoint {
  id: string;
  name: string;
  category: string;
  description: string;
  keywords: string[];
  relatedPoints: string[];
}

interface QuizQuestion {
  id: string;
  sourceType: QuestionSourceType;
  stem: string;
  options?: string[];
  wordBox?: string[];
  gradeBand: string;
  examSource: string;
  knowledgePointId: string;
  difficulty: string;
  knowledgePointName: string;
}

interface QuizStartResponse {
  sessionId: string;
  mode: QuizMode;
  questionType: QuestionTypeFilter;
  totalQuestions: number;
  currentQuestion: QuizQuestion | null;
}

interface SummaryItem {
  questionId: string;
  stem: string;
  sourceType: QuestionSourceType;
  options?: string[];
  wordBox?: string[];
  examSource: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  correctAnswerLabel?: string;
  knowledgePointName: string;
  explanation: string;
  explanationSource: "ai" | "fallback";
}

interface SubmitResponse {
  sessionId: string;
  isCorrect: boolean;
  correctAnswer: string;
  correctAnswerLabel?: string;
  knowledgePoint: KnowledgePoint;
  userAnswer: string;
  question: QuizQuestion;
  progress: {
    answered: number;
    total: number;
    correct: number;
  };
  nextQuestion: QuizQuestion | null;
  isFinished: boolean;
  summary?: {
    totalQuestions: number;
    correctCount: number;
    accuracy: number;
    items: SummaryItem[];
  };
}

interface ExplanationResponse {
  sessionId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  correctAnswerLabel?: string;
  explanation: string;
  explanationSource: "ai" | "fallback";
  knowledgePoint: KnowledgePoint;
}

interface PublicQuestion {
  id: string;
  sourceType: QuestionSourceType;
  wordBox?: string[];
  stem: string;
  knowledgePointId: string;
  gradeBand: string;
  difficulty: string;
  examSource: string;
}

interface RetryFeedback {
  isCorrect: boolean;
  userAnswer: string;
}

interface LoginResponse {
  user: {
    id: string;
    username: string;
    displayName: string;
  };
}

interface AiStatusResponse {
  enabled: boolean;
  configured: boolean;
  provider: "openai" | "deepseek" | "qwen" | "zhipu" | "moonshot";
  model: string;
  baseUrl: string;
  status: "idle" | "ai" | "fallback" | "disabled";
  lastHttpStatus: number | null;
  lastError: string | null;
  lastSuccessAt: string | null;
  lastAttemptAt: string | null;
}

interface ExplanationBlock {
  text: string;
}

interface PetMeta {
  value: PetType;
  label: string;
  image: string;
  accentClass: string;
}

interface ThemeMeta {
  value: ThemeType;
  label: string;
  sublabel: string;
  emblem: string;
  vibe: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSoft: string;
  surfaceSoft: string;
  line: string;
  backdrop: string;
}

const quizModeOptions: Array<{ value: QuizMode; label: string; description: string }> = [
  { value: "random", label: "每日闯关", description: "系统自动混合出题，适合每天练一练。" },
  { value: "knowledgePoint", label: "知识点专练", description: "围绕同一知识点集中突破，适合查漏补缺。" }
];

const questionTypeOptions: Array<{ value: QuestionTypeFilter; label: string }> = [
  { value: "all", label: "综合题" },
  { value: "choice", label: "单选题" },
  { value: "cloze", label: "填空题" }
];

const petOptions: PetMeta[] = [
  { value: "dog", label: "小狗", image: "/pet-dog.svg", accentClass: "dog" },
  { value: "cat", label: "小猫", image: "/pet-cat.svg", accentClass: "cat" }
];

const themeOptions: ThemeMeta[] = [
  {
    value: "peppa",
    label: "小猪佩奇",
    sublabel: "糖果草地",
    emblem: "PP",
    vibe: "粉蓝糖果、草地云朵、轻松幼儿向",
    primary: "#ffd0df",
    secondary: "#b8ecff",
    accent: "#ff8eb1",
    text: "#4e3352",
    textSoft: "#7f6581",
    surfaceSoft: "#fff6fb",
    line: "#f0cade",
    backdrop: 'url("/themes/peppa.svg")'
  },
  {
    value: "wolffy",
    label: "灰太狼",
    sublabel: "森林追逐",
    emblem: "HTL",
    vibe: "青绿树林、冒险追逐、喜剧感",
    primary: "#d5f2d1",
    secondary: "#d9efff",
    accent: "#75c46f",
    text: "#2d4b3a",
    textSoft: "#617e6d",
    surfaceSoft: "#f3fff1",
    line: "#d3e8d1",
    backdrop: 'url("/themes/wolffy.svg")'
  },
  {
    value: "ultraman",
    label: "奥特曼",
    sublabel: "星际出击",
    emblem: "ULT",
    vibe: "银蓝能量、宇宙光束、热血对决",
    primary: "#d9e4ff",
    secondary: "#d6f7ff",
    accent: "#ff6f80",
    text: "#243765",
    textSoft: "#61759f",
    surfaceSoft: "#f5f8ff",
    line: "#d2dcf3",
    backdrop: 'url("/themes/ultraman.svg")'
  },
  {
    value: "octonauts",
    label: "海底小纵队",
    sublabel: "深海任务",
    emblem: "OCT",
    vibe: "海洋蓝绿、气泡探险、清爽任务感",
    primary: "#c8f3ff",
    secondary: "#bde7df",
    accent: "#4fb7d7",
    text: "#204c62",
    textSoft: "#5f8598",
    surfaceSoft: "#effdff",
    line: "#cde8ef",
    backdrop: 'url("/themes/octonauts.svg")'
  },
  {
    value: "paw-patrol",
    label: "汪汪队",
    sublabel: "出动救援",
    emblem: "PAW",
    vibe: "活力橙蓝、任务派发、明快卡通",
    primary: "#d7ecff",
    secondary: "#fff3c7",
    accent: "#ff9c5b",
    text: "#29426a",
    textSoft: "#6e82a8",
    surfaceSoft: "#fffaf1",
    line: "#e7dcc4",
    backdrop: 'url("/themes/paw-patrol.svg")'
  },
  {
    value: "demon-slayer",
    label: "鬼灭之刃",
    sublabel: "呼吸修炼",
    emblem: "KNY",
    vibe: "墨绿红黑、刀纹流动、少年热血",
    primary: "#d9efe6",
    secondary: "#f5d7dc",
    accent: "#c3475b",
    text: "#2d3430",
    textSoft: "#6b736f",
    surfaceSoft: "#fcf7f8",
    line: "#e5d2d6",
    backdrop: 'url("/themes/demon-slayer.svg")'
  },
  {
    value: "disney",
    label: "迪士尼",
    sublabel: "童话星夜",
    emblem: "D",
    vibe: "梦幻紫金、城堡星光、童话舞台",
    primary: "#e3dcff",
    secondary: "#ffe1f7",
    accent: "#ffbf6b",
    text: "#473b73",
    textSoft: "#7a6e9e",
    surfaceSoft: "#fff8fd",
    line: "#eadcf0",
    backdrop: 'url("/themes/disney.svg")'
  },
  {
    value: "gundam",
    label: "高达",
    sublabel: "机甲格纳库",
    emblem: "RX",
    vibe: "机甲白蓝红、金属舱室、硬朗科幻",
    primary: "#dce8f8",
    secondary: "#f1f5fb",
    accent: "#ff6f61",
    text: "#28405b",
    textSoft: "#637890",
    surfaceSoft: "#f8fbff",
    line: "#d3deea",
    backdrop: 'url("/themes/gundam.svg")'
  },
  {
    value: "pokemon",
    label: "宠物小精灵",
    sublabel: "训练家冒险",
    emblem: "PKM",
    vibe: "电光黄蓝、野外地图、冒险收集",
    primary: "#fff2b8",
    secondary: "#d8ecff",
    accent: "#ff6d7d",
    text: "#56491d",
    textSoft: "#897a45",
    surfaceSoft: "#fffef6",
    line: "#eadfae",
    backdrop: 'url("/themes/pokemon.svg")'
  }
];

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const payload = await response.json();

    if (typeof payload?.error === "string" && payload.error.trim()) {
      return payload.error;
    }

    if (payload?.error?.fieldErrors) {
      const messages = Object.values(payload.error.fieldErrors)
        .flat()
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0);

      if (messages.length > 0) {
        return messages.join("，");
      }
    }

    if (payload?.error?.formErrors?.length) {
      return payload.error.formErrors.join("，");
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function buildApiUrl(path: string) {
  if (window.location.protocol === "file:") {
    return `http://127.0.0.1:4310${path}`;
  }

  const configuredBaseUrl = (globalThis as typeof globalThis & { __QUIZ_API_BASE_URL__?: string })
    .__QUIZ_API_BASE_URL__;

  if (configuredBaseUrl) {
    return `${configuredBaseUrl}${path}`;
  }

  return path;
}

const api = {
  async getKnowledgePoints(): Promise<KnowledgePoint[]> {
    const response = await fetch(buildApiUrl("/api/knowledge-points"));
    return response.json();
  },
  async getQuestions(
    knowledgePointId?: string,
    questionType: QuestionTypeFilter = "all"
  ): Promise<PublicQuestion[]> {
    const searchParams = new URLSearchParams();
    if (knowledgePointId) {
      searchParams.set("knowledgePointId", knowledgePointId);
    }
    if (questionType !== "all") {
      searchParams.set("questionType", questionType);
    }

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const response = await fetch(buildApiUrl(`/api/questions${query}`));
    return response.json();
  },
  async startQuiz(payload: {
    mode: QuizMode;
    knowledgePointId?: string;
    questionType?: QuestionTypeFilter;
    questionCount?: number;
  }): Promise<QuizStartResponse> {
    const response = await fetch(buildApiUrl("/api/quiz/start"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, "无法开始练习。"));
    }

    return response.json();
  },
  async login(payload: { username: string; password: string }): Promise<LoginResponse> {
    const response = await fetch(buildApiUrl("/api/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, "登录失败。"));
    }

    return response.json();
  },
  async getAiStatus(): Promise<AiStatusResponse> {
    const response = await fetch(buildApiUrl("/api/ai-status"));
    return response.json();
  },
  async submitAnswer(payload: {
    sessionId: string;
    questionId: string;
    userAnswer: string;
  }): Promise<SubmitResponse> {
    const response = await fetch(buildApiUrl("/api/quiz/submit"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, "提交答案失败。"));
    }

    return response.json();
  },
  async getExplanation(payload: { sessionId: string; questionId: string }): Promise<ExplanationResponse> {
    const response = await fetch(buildApiUrl("/api/quiz/explanation"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response, "暂时无法获取 AI 解析。"));
    }

    return response.json();
  }
};

function getSourceTypeLabel(sourceType: QuestionSourceType) {
  return sourceType === "choice" ? "单选题" : "填空题";
}

function formatCorrectAnswer(answer: string, label?: string) {
  if (!label || label === answer) {
    return answer;
  }

  return `${answer}（${label}）`;
}

function clampQuestionCount(value: number, max: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.min(value, Math.max(1, max)));
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/\s*,\s*/g, " ").replace(/\s+/g, " ");
}

function getAcceptedAnswers(answer: string) {
  return answer
    .split("/")
    .map(normalizeAnswer)
    .filter(Boolean);
}

function countBlankSlots(stem: string) {
  const matches = stem.match(/_{2,}/g);
  return matches?.length ?? 0;
}

function getClozeAnswerHint(stem: string) {
  const blankCount = countBlankSlots(stem);
  const isWordBoxQuestion = /\(from the box\)/i.test(stem);

  if (blankCount > 1) {
    return `这题有 ${blankCount} 个空，请按顺序填写，并用英文逗号分隔，例如：am, is`;
  }

  if (isWordBoxQuestion) {
    return "这题需要先从词框里选词，再把答案填进输入框。";
  }

  return "请按题目要求填写答案，注意大小写和空格。";
}

function isRetryAnswerCorrect(item: SummaryItem, userAnswer: string) {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedStoredAnswers = getAcceptedAnswers(item.correctAnswer);

  if (normalizedStoredAnswers.includes(normalizedUserAnswer)) {
    return true;
  }

  if (item.sourceType === "choice" && item.correctAnswerLabel) {
    return normalizedUserAnswer === normalizeAnswer(item.correctAnswerLabel);
  }

  return false;
}

function getExplanationLabel(source: "ai" | "fallback") {
  return source === "ai" ? "AI 老师解析" : "基础解析";
}

function getAiStatusLabel(status: AiStatusResponse["status"]) {
  if (status === "ai") {
    return "AI 在线";
  }
  if (status === "fallback") {
    return "基础解析";
  }
  if (status === "disabled") {
    return "已关闭";
  }
  return "待调用";
}

function getAiStatusSummary(status: AiStatusResponse) {
  const providerName = status.provider.toUpperCase();

  if (status.status === "ai") {
    return `${providerName} 已连接，答题后可以按需请求 AI 老师解析。`;
  }
  if (status.status === "fallback") {
    return status.lastHttpStatus === 402
      ? "AI 当前仍在计费同步或余额状态更新中，系统会先使用基础解析，不影响做题。"
      : "AI 暂时不可用，系统会继续提供题库里的基础解析。";
  }
  if (status.status === "disabled") {
    return "当前没有开启 AI 解析，页面只展示基础解析能力。";
  }
  return "先完成一道题，再按按钮请求 AI 解析。";
}

function getAiStatusTone(status: AiStatusResponse["status"]) {
  if (status === "ai") {
    return "positive";
  }
  if (status === "fallback") {
    return "warm";
  }
  return "neutral";
}

function getProgressCopy(feedback: SubmitResponse | null) {
  if (!feedback) {
    return "做完题后会立刻告诉孩子自己的答案、正确答案，以及这题考什么。";
  }

  const accuracy = Math.round((feedback.progress.correct / feedback.progress.answered) * 100);
  return `已经完成 ${feedback.progress.answered} / ${feedback.progress.total} 题，当前正确率 ${accuracy}%。`;
}

function getDisplayAnswerText(userAnswer: string) {
  return userAnswer.trim() ? userAnswer : "未作答";
}

function hashSeed(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickBySeed<T>(items: T[], seedSource: string) {
  const seed = hashSeed(seedSource);
  return items[seed % items.length];
}

function cleanExplanationText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^[-*]\s+/, "")
    .replace(/^(\d+)[\.\)、）]\s*/, "$1. ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseExplanationBlocks(result: ExplanationResponse) {
  const blocks = result.explanation
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => cleanExplanationText(line))
    .filter(Boolean);

  return {
    blocks: blocks.length > 0 ? blocks.map((text) => ({ text })) : [{ text: cleanExplanationText(result.explanation) }]
  };
}

function getPetReaction(pet: PetType, isCorrect: boolean) {
  const petMeta = petOptions.find((item) => item.value === pet) ?? petOptions[0];
  const dogCheers = isCorrect
    ? ["你真棒，继续冲呀", "汪汪点赞，这题漂亮", "小狗队长说你很稳"]
    : ["继续努力，我陪你再想想", "汪，我们再试一次", "别怕，小狗陪你过关"];
  const catCheers = isCorrect
    ? ["喵，你答得真好", "小猫鼓掌，这题很棒", "继续保持，状态很好"]
    : ["喵，没关系，再来一次", "小猫陪你慢慢拆题", "这题还能追回来"];

  const cheerList = pet === "dog" ? dogCheers : catCheers;
  return {
    ...petMeta,
    message: pickBySeed(cheerList, `${pet}-${isCorrect ? "yes" : "no"}`)
  };
}

function App() {
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [questionCountInput, setQuestionCountInput] = useState("20");
  const [mode, setMode] = useState<QuizMode>("random");
  const [questionType, setQuestionType] = useState<QuestionTypeFilter>("choice");
  const [selectedKnowledgePointId, setSelectedKnowledgePointId] = useState("");
  const [selectedPet, setSelectedPet] = useState<PetType>("dog");
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>("pokemon");
  const [questionPool, setQuestionPool] = useState<PublicQuestion[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [feedback, setFeedback] = useState<SubmitResponse | null>(null);
  const [pendingNextQuestion, setPendingNextQuestion] = useState<QuizQuestion | null>(null);
  const [pendingSummary, setPendingSummary] = useState<SubmitResponse["summary"] | null>(null);
  const [summary, setSummary] = useState<SubmitResponse["summary"] | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryIndex, setRetryIndex] = useState(0);
  const [retryDraftAnswer, setRetryDraftAnswer] = useState("");
  const [retryFeedback, setRetryFeedback] = useState<RetryFeedback | null>(null);
  const [retryResults, setRetryResults] = useState<Record<string, RetryFeedback>>({});
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loggedInUser, setLoggedInUser] = useState<LoginResponse["user"] | null>(null);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatusResponse | null>(null);
  const [explanationResult, setExplanationResult] = useState<ExplanationResponse | null>(null);
  const [summaryExplanationIndex, setSummaryExplanationIndex] = useState(0);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState("");

  useEffect(() => {
    void api.getKnowledgePoints().then((items) => {
      setKnowledgePoints(items);
      if (items.length > 0) {
        setSelectedKnowledgePointId(items[0].id);
      }
    });
    void api.getAiStatus().then(setAiStatus);
  }, []);

  useEffect(() => {
    const knowledgePointId = mode === "knowledgePoint" ? selectedKnowledgePointId : undefined;
    void api.getQuestions(knowledgePointId, questionType).then(setQuestionPool);
  }, [mode, questionType, selectedKnowledgePointId]);

  useEffect(() => {
    setQuestionCountInput((current) =>
      String(clampQuestionCount(Number.parseInt(current, 10), questionPool.length || 1))
    );
  }, [questionPool.length]);

  const selectedKnowledgePoint = useMemo(
    () => knowledgePoints.find((item) => item.id === selectedKnowledgePointId) ?? null,
    [knowledgePoints, selectedKnowledgePointId]
  );

  const maxSelectableCount = Math.max(1, questionPool.length || 1);
  const resolvedQuestionCount = clampQuestionCount(Number.parseInt(questionCountInput, 10), maxSelectableCount);
  const activeModeMeta = quizModeOptions.find((item) => item.value === mode) ?? quizModeOptions[0];
  const activeTheme = themeOptions.find((item) => item.value === selectedTheme) ?? themeOptions[0];
  const summaryItems = summary?.items ?? [];
  const wrongItems = summaryItems.filter((item) => !item.isCorrect);
  const retryQuestion = wrongItems[retryIndex] ?? null;
  const retryCorrectCount = Object.values(retryResults).filter((item) => item.isCorrect).length;
  const answeredCount = feedback?.progress.answered ?? summary?.totalQuestions ?? 0;
  const totalCount = feedback?.progress.total ?? summary?.totalQuestions ?? resolvedQuestionCount;
  const accuracy = feedback
    ? Math.round((feedback.progress.correct / feedback.progress.answered) * 100)
    : summary?.accuracy ?? 0;
  const solvedCount = feedback?.progress.correct ?? summary?.correctCount ?? 0;
  const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const currentStep = feedback ? feedback.progress.answered : currentQuestion ? answeredCount + 1 : answeredCount;
  const petReaction = feedback ? getPetReaction(selectedPet, feedback.isCorrect) : null;
  const selectedPetMeta = petOptions.find((item) => item.value === selectedPet) ?? petOptions[0];
  const canContinue = Boolean(feedback && (pendingNextQuestion || pendingSummary));
  const summaryExplanationItem = summaryItems[summaryExplanationIndex] ?? null;

  const explanationView = explanationResult ? parseExplanationBlocks(explanationResult) : null;
  const shellStyle = useMemo(
    () =>
      ({
        "--theme-primary": activeTheme.primary,
        "--theme-secondary": activeTheme.secondary,
        "--theme-accent": activeTheme.accent,
        "--text": activeTheme.text,
        "--text-soft": activeTheme.textSoft,
        "--surface-soft": activeTheme.surfaceSoft,
        "--line": activeTheme.line
      }) as CSSProperties,
    [activeTheme]
  );

  async function handleStartQuiz() {
    if (!loggedInUser) {
      setErrorMessage("请先登录后再开始练习。");
      return;
    }

    setStarting(true);
    setErrorMessage("");
    setFeedback(null);
    setExplanationResult(null);
    setExplanationError("");
    setPendingNextQuestion(null);
    setPendingSummary(null);
    setSummary(null);
    setRetryIndex(0);
    setRetryDraftAnswer("");
    setRetryFeedback(null);
    setRetryResults({});
    setSummaryExplanationIndex(0);

    try {
      const response = await api.startQuiz({
        mode,
        knowledgePointId: mode === "knowledgePoint" ? selectedKnowledgePointId : undefined,
        questionType,
        questionCount: resolvedQuestionCount
      });

      setSessionId(response.sessionId);
      setCurrentQuestion(response.currentQuestion);
      setDraftAnswer("");
      setQuestionCountInput(String(response.totalQuestions));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "无法开始练习。"));
    } finally {
      setStarting(false);
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError("");

    try {
      const response = await api.login(loginForm);
      setLoggedInUser(response.user);
    } catch (error) {
      setLoggedInUser(null);
      setLoginError(getErrorMessage(error, "登录失败。"));
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleSubmitAnswer(event: FormEvent) {
    event.preventDefault();
    if (!sessionId || !currentQuestion) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const result = await api.submitAnswer({
        sessionId,
        questionId: currentQuestion.id,
        userAnswer: draftAnswer
      });

      setFeedback(result);
      setExplanationResult(null);
      setExplanationError("");
      setPendingNextQuestion(result.isFinished ? null : result.nextQuestion);
      setPendingSummary(result.isFinished ? result.summary ?? null : null);

      if (result.isFinished) {
        setRetryIndex(0);
        setRetryDraftAnswer("");
        setRetryFeedback(null);
        setRetryResults({});
        setSummaryExplanationIndex(0);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "提交答案失败。"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetQuiz() {
    setSessionId(null);
    setCurrentQuestion(null);
    setDraftAnswer("");
    setFeedback(null);
    setExplanationResult(null);
    setExplanationError("");
    setPendingNextQuestion(null);
    setPendingSummary(null);
    setSummary(null);
    setRetryIndex(0);
    setRetryDraftAnswer("");
    setRetryFeedback(null);
    setRetryResults({});
    setErrorMessage("");
    setSummaryExplanationIndex(0);
  }

  function handleLogout() {
    setLoggedInUser(null);
    setLoginForm({ username: "", password: "" });
    setLoginError("");
    resetQuiz();
  }

  async function loadExplanationFor(questionId: string) {
    if (!sessionId) {
      return;
    }

    setLoadingExplanation(true);
    setExplanationError("");

    try {
      const result = await api.getExplanation({
        sessionId,
        questionId
      });
      setExplanationResult(result);
      setAiStatus(await api.getAiStatus());
    } catch (error) {
      setExplanationError(getErrorMessage(error, "暂时无法获取 AI 解析。"));
    } finally {
      setLoadingExplanation(false);
    }
  }

  async function handleLoadCurrentExplanation() {
    if (!feedback) {
      return;
    }

    await loadExplanationFor(feedback.question.id);
  }

  async function handleLoadSummaryExplanation() {
    if (!summaryExplanationItem) {
      return;
    }

    await loadExplanationFor(summaryExplanationItem.questionId);
  }

  async function handleNextSummaryExplanation() {
    const nextIndex = summaryExplanationIndex + 1;
    if (nextIndex >= summaryItems.length) {
      return;
    }

    setSummaryExplanationIndex(nextIndex);
    setExplanationResult(null);
    setExplanationError("");
  }

  function handleContinueToNext() {
    if (pendingSummary) {
      setCurrentQuestion(null);
      setSummary(pendingSummary);
    } else if (pendingNextQuestion) {
      setCurrentQuestion(pendingNextQuestion);
    }

    setDraftAnswer("");
    setFeedback(null);
    setExplanationResult(null);
    setExplanationError("");
    setPendingNextQuestion(null);
    setPendingSummary(null);
  }

  function startRetryPractice() {
    setRetryIndex(0);
    setRetryDraftAnswer("");
    setRetryFeedback(null);
    setRetryResults({});
  }

  function handleRetrySubmit(event: FormEvent) {
    event.preventDefault();
    if (!retryQuestion) {
      return;
    }

    const result: RetryFeedback = {
      isCorrect: isRetryAnswerCorrect(retryQuestion, retryDraftAnswer),
      userAnswer: retryDraftAnswer
    };

    setRetryFeedback(result);
    setRetryResults((current) => ({
      ...current,
      [retryQuestion.questionId]: result
    }));
  }

  function moveToNextRetryQuestion() {
    if (!retryQuestion) {
      return;
    }

    setRetryFeedback(null);
    const nextIndex = retryIndex + 1;
    setRetryIndex(nextIndex);
    const nextQuestionId = wrongItems[nextIndex]?.questionId;
    setRetryDraftAnswer(nextQuestionId ? retryResults[nextQuestionId]?.userAnswer ?? "" : "");
  }

  function renderAnswerInput(
    question: {
      sourceType: QuestionSourceType;
      stem?: string;
      options?: string[];
      wordBox?: string[];
    },
    value: string,
    onChange: (nextValue: string) => void
  ) {
    if (question.sourceType === "choice") {
      return (
        <div className="answer-option-grid">
          {question.options?.map((option, index) => {
            const optionKey = String.fromCharCode(65 + index);
            const isActive = value === option;

            return (
              <button
                key={`${optionKey}-${option}`}
                type="button"
                className={`answer-option-tile ${isActive ? "active" : ""}`}
                onClick={() => onChange(option)}
              >
                <span className="answer-badge">{optionKey}</span>
                <strong>{option}</strong>
              </button>
            );
          })}
        </div>
      );
    }

    return (
        <div className="answer-editor">
          {question.wordBox?.length ? (
            <div className="word-box" aria-label="词框">
              {question.wordBox.map((word) => (
                <button
                  key={word}
                  type="button"
                  className="word-box-token"
                  onClick={() => onChange(value.trim() ? `${value.trim()} ${word}` : word)}
                >
                  {word}
                </button>
              ))}
            </div>
          ) : null}
          <label className="field">
            <span>请输入答案</span>
            <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="在这里填写答案" />
          </label>
          <small className="answer-format-hint">{question.stem ? getClozeAnswerHint(question.stem) : ""}</small>
        </div>
    );
  }

  return (
    <div className={`app-shell cartoon-shell theme-shell theme-${selectedTheme}`} style={shellStyle}>
      <div
        className="theme-backdrop"
        style={{
          backgroundImage: activeTheme.backdrop
        }}
      />
      <div className="cartoon-bg cartoon-bg-left" />
      <div className="cartoon-bg cartoon-bg-right" />

      {petReaction ? (
        <div className={`floating-pet ${petReaction.accentClass} ${feedback?.isCorrect ? "happy" : "oops"}`}>
          <div className="floating-pet-body">
            <img className="floating-pet-face" src={petReaction.image} alt={petReaction.label} />
          </div>
          <div className="floating-pet-bubble">
            <strong>{selectedPetMeta.label}</strong>
            <p>{petReaction.message}</p>
          </div>
        </div>
      ) : (
        <div className={`floating-pet idle ${selectedPetMeta.accentClass}`}>
          <div className="floating-pet-body">
            <img className="floating-pet-face" src={selectedPetMeta.image} alt={selectedPetMeta.label} />
          </div>
          <div className="floating-pet-bubble">
            <strong>{selectedPetMeta.label}</strong>
            <p>我会一直陪你做题。</p>
          </div>
        </div>
      )}

      <header className="play-header">
        <div className="brand-lockup">
          <div className="brand-mascot">{activeTheme.emblem}</div>
          <div>
            <p className="eyebrow">{activeTheme.label} Theme</p>
            <h1>英语语法小闯关</h1>
            <p className="theme-vibe">{activeTheme.vibe}</p>
          </div>
        </div>

        <div className="header-badges">
          <div className="header-badge">
            <span>已答题</span>
            <strong>{answeredCount}</strong>
          </div>
          <div className="header-badge">
            <span>正确率</span>
            <strong>{answeredCount ? `${accuracy}%` : "--"}</strong>
          </div>
          <div className="player-chip">
            <span className="player-avatar">{loggedInUser ? "学" : "游"}</span>
            <div>
              <strong>{loggedInUser?.displayName ?? "小小练习家"}</strong>
              <span>{loggedInUser ? loggedInUser.username : "先登录再开始"}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="play-layout">
        <aside className="setup-panel">
          <section className="bubble-card setup-card">
            <div className="section-heading">
              <h2>开始前准备</h2>
              <p>像游戏一样，先选好今天的练习任务。</p>
            </div>

            {loggedInUser ? (
              <div className="login-state">
                <div>
                  <strong>{loggedInUser.displayName}</strong>
                  <p>{loggedInUser.username}</p>
                </div>
                <button type="button" className="tiny-action" onClick={handleLogout}>
                  退出登录
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="login-form">
                <input
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                  placeholder="用户名"
                />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="密码"
                />
                <button className="secondary-button full-width" type="submit" disabled={loggingIn}>
                  {loggingIn ? "登录中..." : "登录"}
                </button>
                {loginError ? <div className="error-box">{loginError}</div> : null}
              </form>
            )}

            <div className="setup-section">
              <div className="subsection-heading">
                <h3>练习设置</h3>
                <p>先决定怎么练，再开始做题。</p>
              </div>

              <div className="picker-group">
                <span className="picker-label">练习模式</span>
                <div className="chip-row">
                  {quizModeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`chip-button ${mode === option.value ? "active" : ""}`}
                      onClick={() => setMode(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="picker-hint">{activeModeMeta.description}</p>
              </div>

              <div className="picker-group">
                <span className="picker-label">题型</span>
                <div className="chip-row compact">
                  {questionTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`chip-button ${questionType === option.value ? "active" : ""}`}
                      onClick={() => setQuestionType(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="picker-group">
                <span className="picker-label">题目数量</span>
                <div className="count-stepper">
                  <button
                    type="button"
                    className="stepper-button"
                    onClick={() => setQuestionCountInput(String(Math.max(1, resolvedQuestionCount - 1)))}
                  >
                    -
                  </button>
                  <strong>{resolvedQuestionCount}</strong>
                  <button
                    type="button"
                    className="stepper-button"
                    onClick={() => setQuestionCountInput(String(Math.min(maxSelectableCount, resolvedQuestionCount + 1)))}
                  >
                    +
                  </button>
                </div>
                <p className="picker-hint">当前题库最多可出 {maxSelectableCount} 题。</p>
              </div>

              {mode === "knowledgePoint" ? (
                <div className="picker-group">
                  <span className="picker-label">知识点</span>
                  <select value={selectedKnowledgePointId} onChange={(event) => setSelectedKnowledgePointId(event.target.value)}>
                    {knowledgePoints.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {selectedKnowledgePoint ? <p className="picker-hint">{selectedKnowledgePoint.description}</p> : null}
                </div>
              ) : null}

              {aiStatus ? (
                <div className={`ai-status-card ${getAiStatusTone(aiStatus.status)}`}>
                  <div className="ai-status-head">
                    <span className={`status-dot ${getAiStatusTone(aiStatus.status)}`} />
                    <strong>{getAiStatusLabel(aiStatus.status)}</strong>
                  </div>
                  <p>{getAiStatusSummary(aiStatus)}</p>
                </div>
              ) : null}

              <button className="primary-button full-width" onClick={() => void handleStartQuiz()} disabled={starting || questionPool.length === 0}>
                {starting ? "正在准备题目..." : "开始练习"}
              </button>
            </div>

            <div className="setup-section secondary">
              <div className="subsection-heading">
                <h3>主题外观</h3>
                <p>这一组是氛围设置，不影响做题主流程。</p>
              </div>

              <div className="picker-group">
                <span className="picker-label">动漫主题</span>
                <select value={selectedTheme} onChange={(event) => setSelectedTheme(event.target.value as ThemeType)}>
                  {themeOptions.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label} · {theme.sublabel}
                    </option>
                  ))}
                </select>
                <div className="theme-preview-card">
                  <span className="theme-preview-banner" style={{ backgroundImage: activeTheme.backdrop }} />
                  <div className="theme-preview-copy">
                    <strong>{activeTheme.label}</strong>
                    <small>{activeTheme.sublabel}</small>
                    <p>{activeTheme.vibe}</p>
                  </div>
                </div>
              </div>


              <div className="picker-group">
                <span className="picker-label">选择小宠物</span>
                <div className="chip-row compact">
                  {petOptions.map((pet) => (
                    <button
                      key={pet.value}
                      type="button"
                      className={`chip-button pet-chip ${selectedPet === pet.value ? "active" : ""}`}
                      onClick={() => setSelectedPet(pet.value)}
                    >
                      <img className="pet-chip-face" src={pet.image} alt={pet.label} />
                      {pet.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {errorMessage ? <div className="error-box">{errorMessage}</div> : null}
          </section>
        </aside>

        <section className="game-panel">
          <section className="bubble-card stage-card">
            <div className="stage-top">
              <div className="progress-copy">
                <p className="eyebrow">今天的学习进度</p>
                <h2>{summary ? "本轮练习完成啦" : currentQuestion ? "专心做这一题" : "准备进入练习"}</h2>
                <span>{getProgressCopy(feedback)}</span>
              </div>
              <div className="mascot-bubble">
                <img className="mascot-face" src={selectedPetMeta.image} alt={selectedPetMeta.label} />
                <p>
                  {summary
                    ? "做完以后可以一题一题看完整轮解析。"
                    : feedback
                      ? "继续下一题已经放到提交答案旁边了。"
                      : "每次只做一题，思路会更清楚。"}
                </p>
              </div>
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="progress-meta">
              <span>第 {Math.max(1, currentStep)} 题</span>
              <span>共 {totalCount} 题</span>
              <span>答对 {solvedCount} 题</span>
            </div>

            {currentQuestion ? (
              <form key={currentQuestion.id} onSubmit={handleSubmitAnswer} className="question-stack">
                <div className="question-card">
                  <div className="question-tags">
                    <span className="pill-tag blue">{getSourceTypeLabel(currentQuestion.sourceType)}</span>
                    <span className="pill-tag yellow">{currentQuestion.knowledgePointName}</span>
                  </div>
                  <h3>{currentQuestion.stem}</h3>
                  <p>
                    {currentQuestion.examSource} · {currentQuestion.gradeBand}
                  </p>
                </div>

                {renderAnswerInput(currentQuestion, draftAnswer, setDraftAnswer)}

                <div className="question-actions">
                  <button type="button" className="secondary-button" onClick={() => setDraftAnswer("")}>
                    清空答案
                  </button>
                  <button
                    className="primary-button"
                    type="submit"
                    disabled={submitting || draftAnswer.trim() === "" || feedback?.question.id === currentQuestion.id}
                  >
                    {submitting ? "提交中..." : "提交答案"}
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handleContinueToNext}
                    disabled={!canContinue}
                  >
                    {pendingSummary ? "查看本轮结果" : "继续下一题"}
                  </button>
                </div>
              </form>
            ) : summary ? (
              <div className="summary-view">
                <div className="summary-grid">
                  <article>
                    <strong>{summary.totalQuestions}</strong>
                    <span>总题数</span>
                  </article>
                  <article>
                    <strong>{summary.correctCount}</strong>
                    <span>答对</span>
                  </article>
                  <article>
                    <strong>{summary.accuracy}%</strong>
                    <span>正确率</span>
                  </article>
                </div>

                <div className="summary-actions">
                  <button type="button" className="secondary-button" onClick={resetQuiz}>
                    再来一轮
                  </button>
                  {wrongItems.length > 0 ? (
                    <button type="button" className="primary-button" onClick={startRetryPractice}>
                      开始错题再练
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="welcome-card">
                <div className="welcome-illustration">
                  <span className="star">A+</span>
                  <span className="cloud">cloud</span>
                </div>
                <h3>界面已经收成单屏练习模式</h3>
                <p>左边设置任务，中间专心做题，结果和解析都在下面一步一步展开，不再像控制台。</p>
              </div>
            )}
          </section>

          {feedback ? (
            <section className={`bubble-card result-card ${feedback.isCorrect ? "correct" : "incorrect"}`}>
              <div className="result-head">
                <h3>{feedback.isCorrect ? "答对啦，继续保持" : "这题先记下来，再想一想"}</h3>
                <span className="result-badge">{feedback.isCorrect ? "正确" : "待巩固"}</span>
              </div>

              <div className="result-lines">
                <p>你的答案：{getDisplayAnswerText(feedback.userAnswer)}</p>
                <p>正确答案：{formatCorrectAnswer(feedback.correctAnswer, feedback.correctAnswerLabel)}</p>
                <p>知识点：{feedback.knowledgePoint.name}</p>
              </div>
            </section>
          ) : null}

          {(feedback || summary) ? (
            <section className="bubble-card explanation-card">
              <div className="section-heading inline">
                <div>
                  <h2>题目解析</h2>
                  <p>
                    {feedback
                      ? explanationResult
                        ? getExplanationLabel(explanationResult.explanationSource)
                        : "当前题提交后可立即查看"
                      : `整轮解析 ${Math.min(summaryExplanationIndex + 1, Math.max(summaryItems.length, 1))} / ${summaryItems.length || 1}`}
                  </p>
                </div>
                <div className="inline-actions">
                  {feedback && !explanationResult ? (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => void handleLoadCurrentExplanation()}
                      disabled={loadingExplanation}
                    >
                      {loadingExplanation ? "正在请求 AI 解析..." : "查看 AI 解析"}
                    </button>
                  ) : null}
                  {summary && summaryExplanationItem && !feedback ? (
                    <>
                      {!explanationResult ? (
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => void handleLoadSummaryExplanation()}
                          disabled={loadingExplanation}
                        >
                          {loadingExplanation ? "正在请求 AI 解析..." : "查看这一题解析"}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => void handleNextSummaryExplanation()}
                        disabled={summaryExplanationIndex + 1 >= summaryItems.length}
                      >
                        下一题解析
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              {summary && summaryExplanationItem && !feedback ? (
                <div className="summary-question-preview">
                  <span className="pill-tag blue">{getSourceTypeLabel(summaryExplanationItem.sourceType)}</span>
                  <strong>{summaryExplanationItem.stem}</strong>
                  <p>
                    你的答案：{getDisplayAnswerText(summaryExplanationItem.userAnswer)} ｜ 正确答案：
                    {formatCorrectAnswer(summaryExplanationItem.correctAnswer, summaryExplanationItem.correctAnswerLabel)}
                  </p>
                </div>
              ) : null}

              {explanationView ? (
                <div className="teacher-explanation">
                  <div className="teacher-step-list">
                    {explanationView.blocks.map((block, index) => (
                      <div key={`block-${index}`} className="explanation-block">
                        <p>{block.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : summary ? (
                <div className="empty-panel">
                  <p>整轮做完后，这里会一次只显示一道题的解析。点“查看这一题解析”后，再点“下一题解析”继续往后看。</p>
                </div>
              ) : (
                <div className="empty-panel">
                  <p>先提交当前题答案，就可以决定是否查看这道题的 AI 解析。</p>
                </div>
              )}

              {explanationError ? <div className="error-box">{explanationError}</div> : null}
            </section>
          ) : null}

          {summary && wrongItems.length > 0 ? (
            <section className="bubble-card retry-card">
              <div className="section-heading inline">
                <div>
                  <h2>错题再练</h2>
                  <p>
                    共 {wrongItems.length} 题，已重新答对 {retryCorrectCount} 题。
                  </p>
                </div>
              </div>

              {retryQuestion ? (
                <>
                  <div className="retry-question-card">
                    <span className="pill-tag orange">
                      第 {retryIndex + 1} / {wrongItems.length} 题
                    </span>
                    <h3>{retryQuestion.stem}</h3>
                    <p>{retryQuestion.knowledgePointName}</p>
                  </div>

                  <form onSubmit={handleRetrySubmit} className="question-stack">
                    {renderAnswerInput(retryQuestion, retryDraftAnswer, setRetryDraftAnswer)}
                    <div className="question-actions">
                      <button className="primary-button" type="submit" disabled={retryDraftAnswer.trim() === ""}>
                        提交错题答案
                      </button>
                    </div>
                  </form>

                  {retryFeedback ? (
                    <div className={`retry-feedback ${retryFeedback.isCorrect ? "correct" : "incorrect"}`}>
                      <strong>{retryFeedback.isCorrect ? "这次答对了" : "这题还可以再想一遍"}</strong>
                      <p>正确答案：{formatCorrectAnswer(retryQuestion.correctAnswer, retryQuestion.correctAnswerLabel)}</p>
                      <button type="button" className="secondary-button" onClick={moveToNextRetryQuestion}>
                        {retryIndex + 1 >= wrongItems.length ? "完成错题再练" : "下一题"}
                      </button>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="empty-panel">
                  <p>错题再练已经完成，可以开始新一轮练习。</p>
                </div>
              )}
            </section>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default App;
