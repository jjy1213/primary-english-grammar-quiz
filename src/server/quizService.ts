import { v4 as uuid } from "uuid";
import { appConfig } from "./config.js";
import { saveAttempt } from "./attemptStore.js";
import { loadKnowledgePoints, loadQuestions } from "./contentStore.js";
import type {
  KnowledgePoint,
  PublicQuestion,
  Question,
  QuizQuestionPayload,
  QuizSession,
  QuestionTypeFilter,
  QuizStartResponse,
  QuizSubmitResponse
} from "./types.js";

const sessions = new Map<string, QuizSession>();

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function toPublicQuestion(question: Question): PublicQuestion {
  return {
    id: question.id,
    sourceType: question.sourceType,
    stem: question.stem,
    options: question.options,
    wordBox: question.wordBox,
    gradeBand: question.gradeBand,
    examSource: question.examSource,
    knowledgePointId: question.knowledgePointId,
    difficulty: question.difficulty
  };
}

function toQuizQuestionPayload(question: Question, knowledgePoint: KnowledgePoint): QuizQuestionPayload {
  return {
    ...toPublicQuestion(question),
    knowledgePointName: knowledgePoint.name
  };
}

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s*,\s*/g, " ").replace(/\s+/g, " ");
}

function getAcceptedAnswers(answer: string) {
  return answer
    .split("/")
    .map(normalizeAnswer)
    .filter(Boolean);
}

function getChoiceAnswerLabel(question: Question, answer: string) {
  if (question.sourceType !== "choice" || !question.options?.length) {
    return undefined;
  }

  const normalized = normalizeAnswer(answer);
  const letterIndex = normalized.charCodeAt(0) - 97;
  const looksLikeChoiceLetter = normalized.length === 1 && letterIndex >= 0 && letterIndex < question.options.length;

  if (looksLikeChoiceLetter) {
    return question.options[letterIndex];
  }

  return answer;
}

function isAnswerCorrect(question: Question, userAnswer: string) {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedStoredAnswers = getAcceptedAnswers(question.answer);

  if (normalizedStoredAnswers.includes(normalizedUserAnswer)) {
    return true;
  }

  const choiceAnswerLabel = getChoiceAnswerLabel(question, question.answer);
  if (choiceAnswerLabel && normalizedUserAnswer === normalizeAnswer(choiceAnswerLabel)) {
    return true;
  }

  return false;
}

function getQuestionMap() {
  return new Map(loadQuestions().map((item) => [item.id, item]));
}

function getKnowledgeMap() {
  return new Map(loadKnowledgePoints().map((item) => [item.id, item]));
}

function filterQuestions(
  questions: Question[],
  knowledgePointId?: string,
  questionType: QuestionTypeFilter = "all"
) {
  return questions.filter((question) => {
    const matchesKnowledgePoint = !knowledgePointId || question.knowledgePointId === knowledgePointId;
    const matchesQuestionType = questionType === "all" || question.sourceType === questionType;
    return matchesKnowledgePoint && matchesQuestionType;
  });
}

export function getQuestions(knowledgePointId?: string, questionType: QuestionTypeFilter = "all"): PublicQuestion[] {
  const questions = loadQuestions();
  return filterQuestions(questions, knowledgePointId, questionType).map(toPublicQuestion);
}

export function getKnowledgePoints() {
  return loadKnowledgePoints();
}

export function startQuiz(input: {
  mode: "random" | "knowledgePoint";
  knowledgePointId?: string;
  questionType?: QuestionTypeFilter;
  questionCount?: number;
}): QuizStartResponse {
  const knowledgeMap = getKnowledgeMap();
  const questionType = input.questionType ?? "all";
  let candidates = loadQuestions();

  if (input.mode === "knowledgePoint") {
    if (!input.knowledgePointId) {
      throw new Error("knowledgePointId is required for knowledgePoint mode.");
    }
    if (!knowledgeMap.has(input.knowledgePointId)) {
      throw new Error("Knowledge point not found.");
    }
    candidates = filterQuestions(candidates, input.knowledgePointId, questionType);
  } else {
    candidates = filterQuestions(candidates, undefined, questionType);
  }

  if (candidates.length === 0) {
    throw new Error("No questions available for the selected mode.");
  }

  const limited = shuffle(candidates).slice(0, input.questionCount ?? appConfig.defaultQuizSize);
  const session: QuizSession = {
    id: uuid(),
    mode: input.mode,
    knowledgePointId: input.knowledgePointId,
    questionType,
    questionIds: limited.map((item) => item.id),
    currentIndex: 0,
    correctCount: 0,
    createdAt: new Date().toISOString(),
    answers: []
  };

  sessions.set(session.id, session);
  const firstQuestion = limited[0];
  const knowledgePoint = knowledgeMap.get(firstQuestion.knowledgePointId)!;

  return {
    sessionId: session.id,
    mode: session.mode,
    questionType,
    totalQuestions: session.questionIds.length,
    currentQuestion: toQuizQuestionPayload(firstQuestion, knowledgePoint)
  };
}

export function submitQuizAnswer(input: {
  sessionId: string;
  questionId: string;
  userAnswer: string;
}): QuizSubmitResponse {
  const session = sessions.get(input.sessionId);
  if (!session) {
    throw new Error("Quiz session not found.");
  }

  if (session.completedAt) {
    throw new Error("This quiz session is already completed.");
  }

  const currentQuestionId = session.questionIds[session.currentIndex];
  if (currentQuestionId !== input.questionId) {
    throw new Error("Submitted question does not match the current quiz progress.");
  }

  const questionMap = getQuestionMap();
  const knowledgeMap = getKnowledgeMap();
  const question = questionMap.get(input.questionId);
  if (!question) {
    throw new Error("Question not found.");
  }

  const knowledgePoint = knowledgeMap.get(question.knowledgePointId);
  if (!knowledgePoint) {
    throw new Error("Knowledge point not found.");
  }

  const correctAnswerLabel = getChoiceAnswerLabel(question, question.answer);

  const isCorrect = isAnswerCorrect(question, input.userAnswer);
  if (isCorrect) {
    session.correctCount += 1;
  }

  session.answers.push({
    questionId: question.id,
    userAnswer: input.userAnswer,
    isCorrect
  });

  saveAttempt({
    questionId: question.id,
    userAnswer: input.userAnswer,
    isCorrect,
    correctAnswer: question.answer,
    knowledgePointId: question.knowledgePointId
  });

  session.currentIndex += 1;
  const answered = session.currentIndex;
  const isFinished = answered >= session.questionIds.length;

  let nextQuestion: QuizQuestionPayload | null = null;
  let summary: QuizSubmitResponse["summary"];

  if (isFinished) {
    session.completedAt = new Date().toISOString();
    const items = session.questionIds
      .map((questionId) => questionMap.get(questionId)!)
      .map((item) => {
        const relatedAttempt = session.answers.find((answer) => answer.questionId === item.id);
        return { item, relatedAttempt };
      })
      .map((entry) => ({
        questionId: entry.item.id,
        stem: entry.item.stem,
        sourceType: entry.item.sourceType,
        options: entry.item.options,
        examSource: entry.item.examSource,
        userAnswer: entry.relatedAttempt?.userAnswer ?? "",
        isCorrect: entry.relatedAttempt?.isCorrect ?? false,
        correctAnswer: entry.item.answer,
        correctAnswerLabel: getChoiceAnswerLabel(entry.item, entry.item.answer),
        knowledgePointName: knowledgeMap.get(entry.item.knowledgePointId)!.name,
        explanation: entry.item.explanation
      }));

    summary = {
      totalQuestions: session.questionIds.length,
      correctCount: session.correctCount,
      accuracy: Number(((session.correctCount / session.questionIds.length) * 100).toFixed(1)),
      items
    };
  } else {
    const next = questionMap.get(session.questionIds[session.currentIndex])!;
    nextQuestion = toQuizQuestionPayload(next, knowledgeMap.get(next.knowledgePointId)!);
  }

  return {
    sessionId: session.id,
    isCorrect,
    correctAnswer: question.answer,
    correctAnswerLabel,
    explanation: question.explanation,
    knowledgePoint,
    userAnswer: input.userAnswer,
    question: toQuizQuestionPayload(question, knowledgePoint),
    progress: {
      answered,
      total: session.questionIds.length,
      correct: session.correctCount
    },
    nextQuestion,
    isFinished,
    summary
  };
}
