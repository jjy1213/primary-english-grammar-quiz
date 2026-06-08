import cors from "cors";
import express from "express";
import { ensureAppFiles } from "./fsUtils.js";
import { appConfig } from "./config.js";
import { getAttemptById } from "./attemptStore.js";
import { getKnowledgePoints, getQuestions, startQuiz, submitQuizAnswer } from "./quizService.js";
import { startQuizSchema, submitQuizSchema } from "./validation.js";

ensureAppFiles();

const app = express();
app.use(cors({ origin: appConfig.clientOrigin }));
app.use(express.json());

app.get("/api/status", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/knowledge-points", (_req, res) => {
  res.json(getKnowledgePoints());
});

app.get("/api/questions", (req, res) => {
  const knowledgePointId =
    typeof req.query.knowledgePointId === "string" ? req.query.knowledgePointId : undefined;
  const questionType =
    req.query.questionType === "choice" || req.query.questionType === "cloze"
      ? req.query.questionType
      : "all";
  res.json(getQuestions(knowledgePointId, questionType));
});

app.get("/api/attempts/:id", (req, res) => {
  const attempt = getAttemptById(req.params.id);
  if (!attempt) {
    res.status(404).json({ error: "Attempt not found." });
    return;
  }

  res.json(attempt);
});

app.post("/api/quiz/start", (req, res) => {
  const parsed = startQuizSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    res.status(201).json(startQuiz(parsed.data));
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unable to start quiz."
    });
  }
});

app.post("/api/quiz/submit", (req, res) => {
  const parsed = submitQuizSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    res.json(submitQuizAnswer(parsed.data));
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unable to submit answer."
    });
  }
});

export function createServer() {
  return app;
}

export function startServer(port = appConfig.serverPort) {
  return app.listen(port, () => {
    console.log(`Quiz API listening on http://localhost:${port}`);
  });
}

if (process.env.START_SERVER !== "false") {
  startServer();
}
