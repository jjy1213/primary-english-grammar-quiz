import { readJsonFile } from "./fsUtils.js";
import { paths } from "./config.js";
import type { KnowledgePoint, Question } from "./types.js";
import { knowledgePointListSchema, questionListSchema } from "./validation.js";

export function loadKnowledgePoints(): KnowledgePoint[] {
  const parsed = knowledgePointListSchema.safeParse(readJsonFile(paths.knowledgePoints));
  if (!parsed.success) {
    throw new Error(`Knowledge point data is invalid: ${parsed.error.message}`);
  }

  return parsed.data;
}

export function loadQuestions(): Question[] {
  const questions = questionListSchema.safeParse(readJsonFile(paths.questions));
  if (!questions.success) {
    throw new Error(`Question data is invalid: ${questions.error.message}`);
  }

  const knowledgePointIds = new Set(loadKnowledgePoints().map((item) => item.id));
  for (const question of questions.data) {
    if (!knowledgePointIds.has(question.knowledgePointId)) {
      throw new Error(
        `Question ${question.id} references missing knowledge point ${question.knowledgePointId}.`
      );
    }
  }

  return questions.data;
}
