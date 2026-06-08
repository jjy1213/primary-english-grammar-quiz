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

interface SubmitResponse {
  sessionId: string;
  isCorrect: boolean;
  correctAnswer: string;
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
    incorrectItems: Array<{
      questionId: string;
      stem: string;
      userAnswer: string;
      correctAnswer: string;
      knowledgePointName: string;
      explanation: string;
    }>;
  };
}

interface PublicQuestion {
  id: string;
  sourceType: QuestionSourceType;
  stem: string;
  knowledgePointId: string;
  gradeBand: string;
  difficulty: string;
  examSource: string;
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
      throw new Error((await response.json()).error ?? "无法开始练习。");
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
      throw new Error((await response.json()).error ?? "提交答案失败。");
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
    return "只做选择题";
  }
  if (questionType === "cloze") {
    return "只做填空题";
  }
  return "混合题型";
}

function getSourceTypeLabel(sourceType: QuestionSourceType) {
  return sourceType === "choice" ? "选择题" : "填空题";
}

function clampQuestionCount(value: number, max: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.min(value, Math.max(1, max)));
}

function App() {
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [questionCount, setQuestionCount] = useState(5);
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
  const [summary, setSummary] = useState<SubmitResponse["summary"] | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

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
    setQuestionCount((current) => clampQuestionCount(current, questionPool.length || 1));
  }, [questionPool.length]);

  const selectedKnowledgePoint = useMemo(
    () => knowledgePoints.find((item) => item.id === selectedKnowledgePointId) ?? null,
    [knowledgePoints, selectedKnowledgePointId]
  );

  const maxSelectableCount = Math.max(1, Math.min(20, questionPool.length || 1));

  async function handleStartQuiz() {
    setStarting(true);
    setErrorMessage("");
    setFeedback(null);
    setSummary(null);

    try {
      const response = await api.startQuiz({
        mode,
        knowledgePointId: mode === "knowledgePoint" ? selectedKnowledgePointId : undefined,
        questionType,
        questionCount: clampQuestionCount(questionCount, maxSelectableCount)
      });

      setSessionId(response.sessionId);
      setCurrentQuestion(response.currentQuestion);
      setDraftAnswer("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "无法开始练习。");
    } finally {
      setStarting(false);
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
      setDraftAnswer("");

      if (result.isFinished) {
        setCurrentQuestion(null);
        setSummary(result.summary ?? null);
      } else {
        setCurrentQuestion(result.nextQuestion);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "提交答案失败。");
    } finally {
      setSubmitting(false);
    }
  }

  function resetQuiz() {
    setSessionId(null);
    setCurrentQuestion(null);
    setDraftAnswer("");
    setFeedback(null);
    setSummary(null);
    setErrorMessage("");
  }

  return (
    <div className="page-shell">
      <div className="backdrop-circle circle-a" />
      <div className="backdrop-circle circle-b" />

      <header className="hero">
        <div className="hero-copy">
          <h1>小学生英语语法测试</h1>
          <p>你现在可以自由选择做选择题、填空题，也可以自己决定这一轮做多少题。</p>
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
            <p>先选模式、题型和题数，再进入单题练习。</p>
          </div>

          <div className="mode-switch">
            <button
              className={mode === "random" ? "selected" : ""}
              onClick={() => setMode("random")}
              type="button"
            >
              随机练习
            </button>
            <button
              className={mode === "knowledgePoint" ? "selected" : ""}
              onClick={() => setMode("knowledgePoint")}
              type="button"
            >
              按考点练习
            </button>
          </div>

          <label className="field">
            <span>题型</span>
            <select value={questionType} onChange={(event) => setQuestionType(event.target.value as QuestionTypeFilter)}>
              <option value="all">混合题型</option>
              <option value="choice">只做选择题</option>
              <option value="cloze">只做填空题</option>
            </select>
          </label>

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
            <input
              type="number"
              min={1}
              max={maxSelectableCount}
              value={questionCount}
              onChange={(event) => setQuestionCount(clampQuestionCount(Number(event.target.value), maxSelectableCount))}
            />
            <small className="hint-text">当前最多可选 {maxSelectableCount} 题</small>
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

              {currentQuestion.sourceType === "choice" ? (
                <div className="option-grid">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`option-btn ${draftAnswer === option ? "active" : ""}`}
                      onClick={() => setDraftAnswer(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <label className="field">
                  <span>请输入答案</span>
                  <input
                    value={draftAnswer}
                    onChange={(event) => setDraftAnswer(event.target.value)}
                    placeholder="在这里输入答案"
                  />
                </label>
              )}

              {currentQuestion.sourceType === "choice" ? (
                <p className="hint-text">点击一个选项后再提交答案。</p>
              ) : null}

              <button
                className="primary-action"
                type="submit"
                disabled={submitting || draftAnswer.trim() === ""}
              >
                {submitting ? "提交中..." : "提交答案"}
              </button>
            </form>
          ) : (
            <div className="empty-card">
              <h3>{summary ? "本轮练习已完成" : "还没有开始练习"}</h3>
              <p>{summary ? "可以查看结果，或者重新开始新一轮练习。" : "先在左侧选择模式、题型和题数后开始做题。"}</p>
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
              <p>你的答案：{feedback.userAnswer || "未填写"}</p>
              <p>正确答案：{feedback.correctAnswer}</p>
              <p>考点：{feedback.knowledgePoint.name}</p>
              <p>讲解：{feedback.explanation}</p>
            </div>
          ) : null}
        </section>
      </main>

      <section className="panel summary-panel">
        <div className="panel-title">
          <h2>结果汇总</h2>
          <p>完成练习后，这里会显示正确率和错题考点。</p>
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

            <div className="mistake-list">
              {summary.incorrectItems.length === 0 ? (
                <div className="success-card">这一轮全部答对了，继续保持。</div>
              ) : (
                summary.incorrectItems.map((item) => (
                  <article key={item.questionId} className="mistake-card">
                    <h3>{item.stem}</h3>
                    <p>你的答案：{item.userAnswer || "未填写"}</p>
                    <p>正确答案：{item.correctAnswer}</p>
                    <p>对应考点：{item.knowledgePointName}</p>
                    <p>讲解：{item.explanation}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="empty-card compact">
            <p>完成一轮练习后，这里会自动生成结果报告。</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
