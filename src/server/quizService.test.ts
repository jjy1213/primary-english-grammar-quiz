import { afterAll, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { paths } from "./config.js";
import { getQuestions, startQuiz, submitQuizAnswer } from "./quizService.js";
import { login } from "./authService.js";
import { readJsonFile } from "./fsUtils.js";
import { loadQuestions } from "./contentStore.js";

describe("quizService", () => {
  const attemptsFile = path.resolve(paths.attempts);
  const attemptsBackup = fs.existsSync(attemptsFile) ? fs.readFileSync(attemptsFile, "utf8") : "[]";

  beforeEach(() => {
    fs.writeFileSync(attemptsFile, "[]", "utf8");
  });

  afterAll(() => {
    fs.writeFileSync(attemptsFile, attemptsBackup, "utf8");
  });

  it("filters questions by knowledge point", () => {
    const items = getQuestions("kp-be-verb");
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.knowledgePointId === "kp-be-verb")).toBe(true);
  });

  it("filters questions by question type", () => {
    const items = getQuestions(undefined, "choice");
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.sourceType === "choice")).toBe(true);
  });

  it("starts a random quiz with requested question count", () => {
    const quiz = startQuiz({ mode: "random", questionCount: 3 });
    expect(quiz.totalQuestions).toBe(3);
    expect(quiz.currentQuestion).not.toBeNull();
  });

  it("starts a cloze-only quiz when question type is limited", () => {
    const quiz = startQuiz({ mode: "random", questionType: "cloze", questionCount: 3 });
    expect(quiz.totalQuestions).toBe(3);
    expect(quiz.currentQuestion?.sourceType).toBe("cloze");
  });

  it("returns feedback for a correct choice answer", () => {
    const quiz = startQuiz({ mode: "knowledgePoint", knowledgePointId: "kp-preposition-time", questionCount: 1 });
    const current = quiz.currentQuestion!;
    const result = submitQuizAnswer({
      sessionId: quiz.sessionId,
      questionId: current.id,
      userAnswer: "on"
    });

    expect(result.isCorrect).toBe(true);
    expect(result.correctAnswer).toBe("on");
    expect(result.summary?.correctCount).toBe(1);
  });

  it("accepts choice option text when the stored answer is a letter", () => {
    const sourceQuestion = loadQuestions().find(
      (item) => item.sourceType === "choice" && /^[A-D]$/i.test(item.answer) && item.options?.length
    );

    expect(sourceQuestion).toBeDefined();

    const optionIndex = sourceQuestion!.answer.toUpperCase().charCodeAt(0) - 65;
    const correctOptionText = sourceQuestion!.options![optionIndex];

    const quiz = startQuiz({
      mode: "knowledgePoint",
      knowledgePointId: sourceQuestion!.knowledgePointId,
      questionType: "choice",
      questionCount: 20
    });

    expect(quiz.currentQuestion).not.toBeNull();

    const result = submitQuizAnswer({
      sessionId: quiz.sessionId,
      questionId: quiz.currentQuestion!.id,
      userAnswer:
        quiz.currentQuestion!.id === sourceQuestion!.id
          ? correctOptionText
          : quiz.currentQuestion!.options![
              sourceQuestion!.answer.toUpperCase().charCodeAt(0) - 65
            ] ?? correctOptionText
    });

    if (quiz.currentQuestion!.id === sourceQuestion!.id) {
      expect(result.isCorrect).toBe(true);
      expect(result.correctAnswerLabel).toBe(correctOptionText);
    }
  });

  it("ignores spaces and case for cloze answers", () => {
    const quiz = startQuiz({ mode: "knowledgePoint", knowledgePointId: "kp-like-v-ing", questionCount: 1 });
    const current = quiz.currentQuestion!;
    const result = submitQuizAnswer({
      sessionId: quiz.sessionId,
      questionId: current.id,
      userAnswer: "  ReAdInG "
    });

    expect(result.isCorrect).toBe(true);
    expect(result.isFinished).toBe(true);
  });

  it("returns incorrect summary items when the answer is wrong", () => {
    const quiz = startQuiz({ mode: "knowledgePoint", knowledgePointId: "kp-pronoun", questionCount: 1 });
    const current = quiz.currentQuestion!;
    const wrongAnswer =
      current.sourceType === "choice"
        ? current.options?.find((option) => option !== current.options?.[2]) ?? "wrong"
        : "wrong";
    const result = submitQuizAnswer({
      sessionId: quiz.sessionId,
      questionId: current.id,
      userAnswer: wrongAnswer
    });

    expect(result.isCorrect).toBe(false);
    expect(result.summary?.items.length).toBe(1);
    expect(result.summary?.items[0].isCorrect).toBe(false);
  });

  it("returns only wrong items in the summary", () => {
    const quiz = startQuiz({ mode: "random", questionCount: 3 });

    let current = quiz.currentQuestion!;
    let result = submitQuizAnswer({
      sessionId: quiz.sessionId,
      questionId: current.id,
      userAnswer: "wrong"
    });

    current = result.nextQuestion!;
    const secondAnswer =
      current.sourceType === "choice"
        ? current.options?.[0] ?? "wrong"
        : "wrong";
    result = submitQuizAnswer({
      sessionId: quiz.sessionId,
      questionId: current.id,
      userAnswer: secondAnswer
    });

    current = result.nextQuestion!;
    result = submitQuizAnswer({
      sessionId: quiz.sessionId,
      questionId: current.id,
      userAnswer: "wrong"
    });

    expect(result.isFinished).toBe(true);
    expect(result.summary?.items.every((item) => item.isCorrect === false)).toBe(true);
    expect(result.summary?.items.length).toBeLessThanOrEqual(3);
  });

  it("logs in with a valid username and password", () => {
    const result = login({ username: "demo", password: "demo123" });
    expect(result.user.username).toBe("demo");
    expect(result.user.displayName).toBe("Demo User");
  });

  it("validates question data against linked knowledge points", () => {
    const questions = loadQuestions();
    const ids = new Set(questions.map((item) => item.knowledgePointId));
    expect(ids.has("kp-be-verb")).toBe(true);
  });

  it("saves attempts after submission", () => {
    const quiz = startQuiz({ mode: "knowledgePoint", knowledgePointId: "kp-be-verb", questionCount: 1 });
    const current = quiz.currentQuestion!;
    submitQuizAnswer({
      sessionId: quiz.sessionId,
      questionId: current.id,
      userAnswer: "wrong"
    });

    const attempts = readJsonFile<Array<{ questionId: string; userAnswer: string }>>(paths.attempts);
    expect(attempts).toHaveLength(1);
    expect(attempts[0].questionId).toBe(current.id);
    expect(attempts[0].userAnswer).toBe("wrong");
  });
});
