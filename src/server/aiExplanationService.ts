import { appConfig } from "./config.js";
import { getCachedExplanation, saveCachedExplanation } from "./aiExplanationCache.js";
import type { KnowledgePoint, Question } from "./types.js";

export interface ExplanationResult {
  explanation: string;
  explanationSource: "ai" | "fallback";
}

interface BuildExplanationInput {
  question: Question;
  knowledgePoint: KnowledgePoint;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswerLabel?: string;
}

type ExplanationGenerator = (input: BuildExplanationInput) => Promise<ExplanationResult | null>;

let customGenerator: ExplanationGenerator | null = null;
let aiRuntimeStatus: {
  mode: "idle" | "ai" | "fallback" | "disabled";
  lastHttpStatus: number | null;
  lastError: string | null;
  lastSuccessAt: string | null;
  lastAttemptAt: string | null;
} = {
  mode: appConfig.ai.enabled && appConfig.ai.apiKey ? "idle" : "disabled",
  lastHttpStatus: null,
  lastError: null,
  lastSuccessAt: null,
  lastAttemptAt: null
};

function buildPrompt(input: BuildExplanationInput) {
  const optionLines =
    input.question.sourceType === "choice" && input.question.options?.length
      ? input.question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join("\n")
      : "No options";

  const correctAnswerDisplay = input.correctAnswerLabel
    ? `${input.question.answer} (${input.correctAnswerLabel})`
    : input.question.answer;

  return [
    "You are an excellent primary-school English teacher.",
    "Write the explanation in Simplified Chinese.",
    "Use a warm, encouraging primary-school teacher tone.",
    "Keep the explanation accurate, concrete, and easy for children to understand.",
    "Do not mention that you are an AI.",
    "Prefer short sentences and familiar words.",
    "When useful, point out clue words or grammar signals in the sentence.",
    "Structure the explanation into 3 short parts using these labels exactly:",
    "1. 这题在考什么：",
    "2. 为什么这个答案对：",
    "3. 下次怎么更快看出来：",
    "If the student's answer is wrong, explain where the student's thinking may have gone off.",
    "If the student's answer is correct, praise briefly and still explain the reasoning.",
    "",
    `题型: ${input.question.sourceType}`,
    `考点: ${input.knowledgePoint.name}`,
    `题目: ${input.question.stem}`,
    `选项:\n${optionLines}`,
    `学生答案: ${input.userAnswer || "未作答"}`,
    `是否答对: ${input.isCorrect ? "是" : "否"}`,
    `正确答案: ${correctAnswerDisplay}`
  ].join("\n");
}

function buildCacheKey(input: BuildExplanationInput) {
  return JSON.stringify({
    questionId: input.question.id,
    stem: input.question.stem,
    options: input.question.options ?? [],
    correctAnswer: input.question.answer,
    correctAnswerLabel: input.correctAnswerLabel ?? "",
    knowledgePointId: input.knowledgePoint.id,
    knowledgePointName: input.knowledgePoint.name,
    userAnswer: input.userAnswer.trim(),
    isCorrect: input.isCorrect
  });
}

async function generateWithOpenAI(input: BuildExplanationInput): Promise<ExplanationResult | null> {
  const { enabled, apiKey, baseUrl, model } = appConfig.ai;
  if (!enabled || !apiKey) {
    aiRuntimeStatus = {
      ...aiRuntimeStatus,
      mode: "disabled",
      lastAttemptAt: new Date().toISOString()
    };
    return null;
  }

  aiRuntimeStatus = {
    ...aiRuntimeStatus,
    lastAttemptAt: new Date().toISOString()
  };

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "You provide high-quality grammar explanations for children."
        },
        {
          role: "user",
          content: buildPrompt(input)
        }
      ]
    })
  });

  if (!response.ok) {
    aiRuntimeStatus = {
      ...aiRuntimeStatus,
      mode: "fallback",
      lastHttpStatus: response.status,
      lastError: `AI explanation request failed with status ${response.status}.`
    };
    throw new Error(`AI explanation request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    aiRuntimeStatus = {
      ...aiRuntimeStatus,
      mode: "fallback",
      lastHttpStatus: response.status,
      lastError: "AI explanation returned empty content."
    };
    return null;
  }

  aiRuntimeStatus = {
    ...aiRuntimeStatus,
    mode: "ai",
    lastHttpStatus: response.status,
    lastError: null,
    lastSuccessAt: new Date().toISOString()
  };

  return {
    explanation: content,
    explanationSource: "ai"
  };
}

export async function buildExplanation(input: BuildExplanationInput): Promise<ExplanationResult> {
  const cacheKey = buildCacheKey(input);
  const cached = getCachedExplanation(cacheKey);
  if (cached) {
    aiRuntimeStatus = {
      ...aiRuntimeStatus,
      mode: "ai",
      lastHttpStatus: 200,
      lastError: null
    };
    return cached;
  }

  try {
    const result = customGenerator
      ? await customGenerator(input)
      : await generateWithOpenAI(input);

    if (result?.explanation?.trim()) {
      if (result.explanationSource === "ai") {
        saveCachedExplanation(cacheKey, result.explanation);
      }
      return result;
    }
  } catch (error) {
    console.warn("AI explanation unavailable, using fallback.", error);
  }

  return {
    explanation: input.question.explanation,
    explanationSource: "fallback"
  };
}

export function setExplanationGeneratorForTests(generator: ExplanationGenerator | null) {
  customGenerator = generator;
}

export function getAiRuntimeStatus() {
  return {
    enabled: appConfig.ai.enabled,
    configured: Boolean(appConfig.ai.apiKey),
    provider: appConfig.ai.provider,
    model: appConfig.ai.model,
    baseUrl: appConfig.ai.baseUrl,
    status: aiRuntimeStatus.mode,
    lastHttpStatus: aiRuntimeStatus.lastHttpStatus,
    lastError: aiRuntimeStatus.lastError,
    lastSuccessAt: aiRuntimeStatus.lastSuccessAt,
    lastAttemptAt: aiRuntimeStatus.lastAttemptAt
  };
}
