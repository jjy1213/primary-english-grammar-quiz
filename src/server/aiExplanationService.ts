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
    "The first line must be a lively opening sentence for a child.",
    "Vary the opening naturally each time and do not always use the same wording.",
    "After that opening, output 3 to 5 numbered lines in order.",
    "Each numbered line should focus on one clear point, and may use a short mini-title when helpful.",
    "The mini-titles should feel natural for this specific question, not fixed templates.",
    "Put each numbered point on its own line.",
    "Do not merge the points into one paragraph.",
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

function buildFallbackExplanation(input: BuildExplanationInput) {
  const openingOptions = input.isCorrect
    ? [
        "你这次抓得很准，我们顺着题目把思路再走一遍。",
        "这题你答得不错，我们来看看你是怎么判断对的。",
        "这一题表现很好，我们一起把关键线索记牢。"
      ]
    : [
        "别着急，这题里藏着一个很重要的小线索，我们一起找出来。",
        "这道题有点像小机关，拆开看就不难了。",
        "没关系，我们把这题一步一步拆开，你很快就能看懂。"
      ];

  const opening = openingOptions[Math.abs(input.question.id.length + input.userAnswer.length) % openingOptions.length];
  const studentAnswer = input.userAnswer.trim() || "还没作答";
  const correctAnswerDisplay = input.correctAnswerLabel
    ? `${input.question.answer}（${input.correctAnswerLabel}）`
    : input.question.answer;
  const pointTwo = input.isCorrect
    ? `你这次答对了，说明你已经注意到题目的关键位置了。你的答案是“${studentAnswer}”。`
    : `你这次容易卡住的地方，多半是在比较“${studentAnswer}”和正确答案时少看了一步。`;
  const pointFour =
    input.question.sourceType === "choice"
      ? "下次先圈出关键词，再把每个选项代回句子里读一遍，通常会更快。"
      : "下次先看空前空后，再判断时态、单复数或固定搭配，会更稳。";

  return [
    opening,
    `1. 先看考点：这题主要考 ${input.knowledgePoint.name}${input.knowledgePoint.description ? `，${input.knowledgePoint.description}` : "。"} `,
    `2. 这次卡点：${pointTwo}`,
    `3. 正确思路：正确答案是“${correctAnswerDisplay}”。${input.question.explanation}`,
    `4. 小提醒：${pointFour}`
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
      temperature: 0.7,
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
    explanation: buildFallbackExplanation(input),
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
