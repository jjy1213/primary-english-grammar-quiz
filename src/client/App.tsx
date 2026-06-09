import { FormEvent, useEffect, useMemo, useState } from "react";

type QuizMode = "random" | "knowledgePoint";
type QuestionSourceType = "choice" | "cloze";
type QuestionTypeFilter = "all" | QuestionSourceType;

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
}

interface SubmitResponse {
  sessionId: string;
  isCorrect: boolean;
  correctAnswer: string;
  correctAnswerLabel?: string;
  explanation: string;
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

interface PublicQuestion {
  id: string;
  sourceType: QuestionSourceType;
  stem: string;
  wordBox?: string[];
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

const quizModeOptions: Array<{ value: QuizMode; label: string }> = [
  { value: "random", label: "随机练习" },
  { value: "knowledgePoint", label: "按考点练习" }
];

const questionTypeOptions: Array<{ value: QuestionTypeFilter; label: string }> = [
  { value: "all", label: "混合题型" },
  { value: "choice", label: "选择题" },
  { value: "cloze", label: "填空题" }
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
        return messages.join("；");
      }
    }

    if (payload?.error?.formErrors?.length) {
      return payload.error.formErrors.join("；");
    }
  } catch {
    return fallback;
  }

  return fallback;
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
  }
};

function buildApiUrl(path: string) {
  if (window.location.protocol === "file:") {
    return `http://127.0.0.1:4310${path}`;
  }

  return path;
}

function getQuestionTypeLabel(questionType: QuestionTypeFilter) {
  if (questionType === "choice") {
    return "选择题";
  }
  if (questionType === "cloze") {
    return "填空题";
  }
  return "混合题型";
}

function getSourceTypeLabel(sourceType: QuestionSourceType) {
  return sourceType === "choice" ? "选择题" : "填空题";
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
    return "本题应从词框中选词作答。";
  }

  return "如果有多个空，请按顺序填写，并用英文逗号分隔，例如：am, is";
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

function getSegmentPosition(optionCount: number, index: number) {
  return {
    width: `${100 / optionCount}%`,
    transform: `translateX(${index * 100}%)`
  };
}

function App() {
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [questionCountInput, setQuestionCountInput] = useState("5");
  const [mode, setMode] = useState<QuizMode>("random");
  const [questionType, setQuestionType] = useState<QuestionTypeFilter>("all");
  const [selectedKnowledgePointId, setSelectedKnowledgePointId] = useState("");
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

  useEffect(() => {
    void api.getKnowledgePoints().then((items) => {
      setKnowledgePoints(items);
      if (items.length > 0) {
        setSelectedKnowledgePointId(items[0].id);
      }
    });
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
  const wrongItems = summary?.items ?? [];
  const retryQuestion = wrongItems[retryIndex] ?? null;
  const retryCorrectCount = Object.values(retryResults).filter((item) => item.isCorrect).length;
  const modeIndex = quizModeOptions.findIndex((item) => item.value === mode);
  const questionTypeIndex = questionTypeOptions.findIndex((item) => item.value === questionType);

  async function handleStartQuiz() {
    if (!loggedInUser) {
      setErrorMessage("请先登录后再开始练习。");
      return;
    }

    setStarting(true);
    setErrorMessage("");
    setFeedback(null);
    setPendingNextQuestion(null);
    setPendingSummary(null);
    setSummary(null);
    setRetryIndex(0);
    setRetryDraftAnswer("");
    setRetryFeedback(null);
    setRetryResults({});

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
      setPendingNextQuestion(result.isFinished ? null : result.nextQuestion);
      setPendingSummary(result.isFinished ? result.summary ?? null : null);

      if (result.isFinished) {
        setRetryIndex(0);
        setRetryDraftAnswer("");
        setRetryFeedback(null);
        setRetryResults({});
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
    setPendingNextQuestion(null);
    setPendingSummary(null);
    setSummary(null);
    setErrorMessage("");
    setRetryIndex(0);
    setRetryDraftAnswer("");
    setRetryFeedback(null);
    setRetryResults({});
  }

  function handleLogout() {
    setLoggedInUser(null);
    setLoginForm({ username: "", password: "" });
    setLoginError("");
    resetQuiz();
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
        <div className="option-grid">
          {question.options?.map((option) => (
            <button
              key={option}
              type="button"
              className={`option-btn ${value === option ? "active" : ""}`}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    return (
      <label className="field">
        <span>请输入答案</span>
        {question.wordBox?.length ? (
          <div className="word-box" aria-label="词框">
            {question.wordBox.map((word) => (
              <button key={word} type="button" className="word-box-token" onClick={() => onChange(word)}>
                {word}
              </button>
            ))}
          </div>
        ) : question.stem && /\(from the box\)/i.test(question.stem) ? (
          <small className="answer-format-hint">当前题库暂未保存这题对应的词框内容。</small>
        ) : null}
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="在这里输入答案" />
        {question.stem ? <small className="answer-format-hint">{getClozeAnswerHint(question.stem)}</small> : null}
      </label>
    );
  }

  return (
    <div className="page-shell">
      <div className="backdrop-circle circle-a" />
      <div className="backdrop-circle circle-b" />

      <header className="hero">
        <div className="hero-copy">
          <h1>小学生英语语法测试</h1>
          <p>现在可以自由选择做选择题或填空题，也可以自己决定这一轮练习做多少题。</p>
        </div>
        <div className="hero-card">
          <span>题库独立维护</span>
          <span>知识库可持续扩展</span>
          <span>作答记录本地保存</span>
        </div>
      </header>

      <main className="content-grid">
        <section className="panel setup-panel">
          <div className="panel-title">
            <h2>开始练习</h2>
            <p>先登录，再选模式、题型和题数。</p>
          </div>

          <div className="login-card">
            <div className="login-head">
              <div>
                <h3>账号登录</h3>
                <p>登录后才能开始本轮练习。</p>
              </div>
              {loggedInUser ? (
                <button type="button" className="secondary-action login-action" onClick={handleLogout}>
                  退出登录
                </button>
              ) : null}
            </div>

            {loggedInUser ? (
              <div className="login-success">
                <strong>{loggedInUser.displayName}</strong>
                <span>{loggedInUser.username}</span>
              </div>
            ) : (
              <form className="login-form" onSubmit={handleLogin}>
                <label className="field">
                  <span>账号</span>
                  <input
                    value={loginForm.username}
                    onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                    placeholder="请输入账号"
                  />
                </label>

                <label className="field">
                  <span>密码</span>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="请输入密码"
                  />
                </label>

                <button className="secondary-action login-action" type="submit" disabled={loggingIn}>
                  {loggingIn ? "登录中..." : "登录"}
                </button>
              </form>
            )}

            <p className="hint-text">演示账号：demo，密码：demo123</p>
            {loginError ? <div className="error-box">{loginError}</div> : null}
          </div>

          <div className="field">
            <span>练习模式</span>
            <div className="segment-control two-up" role="tablist" aria-label="练习模式">
              <div className="segment-indicator" style={getSegmentPosition(quizModeOptions.length, modeIndex)} />
              {quizModeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`segment-option ${mode === option.value ? "active" : ""}`}
                  onClick={() => setMode(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span>题型</span>
            <div className="segment-control three-up" role="tablist" aria-label="题型">
              <div
                className="segment-indicator"
                style={getSegmentPosition(questionTypeOptions.length, questionTypeIndex)}
              />
              {questionTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`segment-option ${questionType === option.value ? "active" : ""}`}
                  onClick={() => setQuestionType(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {mode === "knowledgePoint" ? (
            <label className="field">
              <span>选择考点</span>
              <select
                value={selectedKnowledgePointId}
                onChange={(event) => setSelectedKnowledgePointId(event.target.value)}
              >
                {knowledgePoints.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="field">
            <span>练习题数</span>
            <div className="count-input-card">
              <input
                type="number"
                min={1}
                max={maxSelectableCount}
                inputMode="numeric"
                value={questionCountInput}
                onChange={(event) => setQuestionCountInput(event.target.value)}
              />
              <span>最多 {maxSelectableCount} 题</span>
            </div>
            <small className="hint-text">
              如果输入超过题库上限，开始练习时会自动按最多 {maxSelectableCount} 题处理，当前将出 {resolvedQuestionCount} 题。
            </small>
          </label>

          <div className="stats-board">
            <article>
              <strong>{knowledgePoints.length}</strong>
              <span>当前考点数</span>
            </article>
            <article>
              <strong>{questionPool.length}</strong>
              <span>{getQuestionTypeLabel(questionType)}可用题数</span>
            </article>
          </div>

          {selectedKnowledgePoint ? (
            <div className="knowledge-card">
              <h3>{selectedKnowledgePoint.name}</h3>
              <p>{selectedKnowledgePoint.description}</p>
              <div className="tag-row">
                {selectedKnowledgePoint.keywords.map((keyword) => (
                  <span key={keyword}>{keyword}</span>
                ))}
              </div>
            </div>
          ) : null}

          <button className="primary-action" onClick={() => void handleStartQuiz()} disabled={starting}>
            {starting ? "正在准备题目..." : "开始做题"}
          </button>

          {errorMessage ? <div className="error-box">{errorMessage}</div> : null}
        </section>

        <section className="panel quiz-panel">
          <div className="panel-title">
            <h2>练习区</h2>
            <p>提交后会立即显示对错、正确答案、考点和讲解。</p>
          </div>

          {currentQuestion ? (
            <form onSubmit={handleSubmitAnswer} className="question-card">
              <div className="question-meta">
                <span>{getSourceTypeLabel(currentQuestion.sourceType)}</span>
                <span>{currentQuestion.knowledgePointName}</span>
                <span>{currentQuestion.examSource}</span>
              </div>
              <h3>{currentQuestion.stem}</h3>

              {renderAnswerInput(currentQuestion, draftAnswer, setDraftAnswer)}

              {currentQuestion.sourceType === "choice" ? <p className="hint-text">点击一个选项后再提交答案。</p> : null}

              <button
                className="primary-action"
                type="submit"
                disabled={submitting || draftAnswer.trim() === "" || feedback?.question.id === currentQuestion.id}
              >
                {submitting ? "提交中..." : "提交答案"}
              </button>
            </form>
          ) : (
            <div className="empty-card">
              <h3>{summary ? "本轮练习已完成" : "还没有开始练习"}</h3>
              <p>{summary ? "可以查看结果，或重新开始新一轮练习。" : "先在左侧登录并选择模式、题型和题数后开始做题。"}</p>
              {(summary || sessionId) && (
                <button type="button" className="secondary-action" onClick={resetQuiz}>
                  重新开始
                </button>
              )}
            </div>
          )}

          {feedback ? (
            <div className={`feedback-card ${feedback.isCorrect ? "correct" : "incorrect"}`}>
              <div className="feedback-head">
                <strong>{feedback.isCorrect ? "回答正确" : "再想一想"}</strong>
                <span>
                  {feedback.progress.answered}/{feedback.progress.total} 题
                </span>
              </div>
              <p>题型：{getSourceTypeLabel(feedback.question.sourceType)}</p>
              <p>来源：{feedback.question.examSource}</p>
              {feedback.question.sourceType === "choice" && feedback.question.options?.length ? (
                <p>原选项：{feedback.question.options.join(" / ")}</p>
              ) : null}
              <p>你的答案：{feedback.userAnswer || "未填写"}</p>
              <p>正确答案：{formatCorrectAnswer(feedback.correctAnswer, feedback.correctAnswerLabel)}</p>
              <p>考点：{feedback.knowledgePoint.name}</p>
              <p>讲解：{feedback.explanation}</p>
              <button type="button" className="secondary-action retry-next-btn" onClick={handleContinueToNext}>
                {pendingSummary ? "查看结果" : "下一题"}
              </button>
            </div>
          ) : null}
        </section>
      </main>

      <section className="panel summary-panel">
        <div className="panel-title">
          <h2>结果汇总</h2>
          <p>完成练习后，这里会显示数据汇总和错题明细。</p>
        </div>

        {summary ? (
          <div className="summary-grid">
            <div className="summary-hero">
              <article>
                <strong>{summary.totalQuestions}</strong>
                <span>总题数</span>
              </article>
              <article>
                <strong>{summary.correctCount}</strong>
                <span>答对题数</span>
              </article>
              <article>
                <strong>{summary.accuracy}%</strong>
                <span>正确率</span>
              </article>
            </div>

            <div className="summary-caption">
              <strong>错题明细</strong>
              <span>本轮只展示答错的题目。</span>
            </div>

            <div className="mistake-list">
              {summary.items.length > 0 ? (
                summary.items.map((item) => (
                  <article key={item.questionId} className="mistake-card summary-incorrect">
                    <h3>{item.stem}</h3>
                    <p>结果：答错</p>
                    <p>题型：{getSourceTypeLabel(item.sourceType)}</p>
                    <p>来源：{item.examSource}</p>
                    {item.sourceType === "choice" && item.options?.length ? <p>原选项：{item.options.join(" / ")}</p> : null}
                    <p>你的答案：{item.userAnswer || "未填写"}</p>
                    <p>正确答案：{formatCorrectAnswer(item.correctAnswer, item.correctAnswerLabel)}</p>
                    <p>对应考点：{item.knowledgePointName}</p>
                    <p>讲解：{item.explanation}</p>
                  </article>
                ))
              ) : (
                <div className="success-card">
                  <h3>这一轮没有错题</h3>
                  <p>上方已经保留总题数、答对数和正确率。</p>
                </div>
              )}
            </div>

            <div className="retry-panel">
              <div className="retry-head">
                <div>
                  <h3>错题再练</h3>
                  <p>把本轮做错的题单独拿出来，再练一遍。</p>
                </div>
                {wrongItems.length > 0 ? (
                  <button type="button" className="secondary-action" onClick={startRetryPractice}>
                    重新开始错题练习
                  </button>
                ) : null}
              </div>

              {wrongItems.length === 0 ? (
                <div className="success-card">
                  <h3>这轮没有错题</h3>
                  <p>这一轮全部答对了，不需要进入错题练习。</p>
                </div>
              ) : retryQuestion ? (
                <div className="retry-layout">
                  <div className="summary-hero retry-stats">
                    <article>
                      <strong>{wrongItems.length}</strong>
                      <span>错题总数</span>
                    </article>
                    <article>
                      <strong>{retryIndex + 1}</strong>
                      <span>当前进度</span>
                    </article>
                    <article>
                      <strong>{retryCorrectCount}</strong>
                      <span>再练答对</span>
                    </article>
                  </div>

                  <form onSubmit={handleRetrySubmit} className="question-card compact">
                    <div className="question-meta">
                      <span>{getSourceTypeLabel(retryQuestion.sourceType)}</span>
                      <span>{retryQuestion.knowledgePointName}</span>
                      <span>{retryQuestion.examSource}</span>
                    </div>
                    <h3>{retryQuestion.stem}</h3>

                    {renderAnswerInput(retryQuestion, retryDraftAnswer, setRetryDraftAnswer)}

                    <button className="primary-action" type="submit" disabled={retryDraftAnswer.trim() === ""}>
                      提交错题答案
                    </button>
                  </form>

                  {retryFeedback ? (
                    <div className={`feedback-card ${retryFeedback.isCorrect ? "correct" : "incorrect"}`}>
                      <div className="feedback-head">
                        <strong>{retryFeedback.isCorrect ? "这次答对了" : "这题还可以再记一记"}</strong>
                        <span>
                          {retryIndex + 1}/{wrongItems.length} 题
                        </span>
                      </div>
                      {retryQuestion.sourceType === "choice" && retryQuestion.options?.length ? (
                        <p>原选项：{retryQuestion.options.join(" / ")}</p>
                      ) : null}
                      <p>你的答案：{retryFeedback.userAnswer || "未填写"}</p>
                      <p>正确答案：{formatCorrectAnswer(retryQuestion.correctAnswer, retryQuestion.correctAnswerLabel)}</p>
                      <p>考点：{retryQuestion.knowledgePointName}</p>
                      <p>讲解：{retryQuestion.explanation}</p>

                      <button type="button" className="secondary-action retry-next-btn" onClick={moveToNextRetryQuestion}>
                        {retryIndex + 1 >= wrongItems.length ? "完成错题练习" : "下一题"}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="success-card">
                  <h3>错题练习完成</h3>
                  <p>
                    本轮错题共 {wrongItems.length} 题，再练答对 {retryCorrectCount} 题。
                  </p>
                  <button type="button" className="secondary-action" onClick={startRetryPractice}>
                    再练一遍
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-card">
            <h3>还没有结果</h3>
            <p>完成一轮练习后，这里会显示总题数、答对数、正确率和错题明细。</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
