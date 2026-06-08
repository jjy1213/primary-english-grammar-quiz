import { afterAll, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { paths } from "./config.js";
import { getQuestions, startQuiz, submitQuizAnswer } from "./quizService.js";
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
    expect(result.knowledgePoint.name).toBe("时间介词");
    expect(result.summary?.correctCount).toBe(1);
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
    const result = submitQuizAnswer({
      sessionId: quiz.sessionId,
      questionId: current.id,
      userAnswer: "He"
    });

    expect(result.isCorrect).toBe(false);
    expect(result.summary?.incorrectItems.length).toBe(1);
    expect(result.summary?.incorrectItems[0].knowledgePointName).toBe("人称代词");
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
