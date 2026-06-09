import "dotenv/config";
import path from "node:path";

type AiProviderName = "openai" | "deepseek" | "qwen" | "zhipu" | "moonshot";

interface ResolvedAiConfig {
  enabled: boolean;
  provider: AiProviderName;
  apiKey: string;
  baseUrl: string;
  model: string;
}

function cleanEnvValue(value?: string) {
  if (!value) {
    return "";
  }

  return value.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}

function resolveAiConfig(): ResolvedAiConfig {
  const explicitOpenAiKey = cleanEnvValue(process.env.OPENAI_API_KEY);
  const deepSeekKey = cleanEnvValue(process.env.DEEPSEEK_API_KEY);
  const qwenKey = cleanEnvValue(process.env.DASHSCOPE_API_KEY);
  const zhipuKey = cleanEnvValue(process.env.ZHIPU_API_KEY);
  const moonshotKey = cleanEnvValue(process.env.MOONSHOT_API_KEY);

  if (deepSeekKey) {
    return {
      enabled: process.env.AI_EXPLANATION_ENABLED === "true",
      provider: "deepseek",
      apiKey: deepSeekKey,
      baseUrl: cleanEnvValue(process.env.DEEPSEEK_BASE_URL) || "https://api.deepseek.com/v1",
      model: cleanEnvValue(process.env.DEEPSEEK_MODEL) || "deepseek-chat"
    };
  }

  if (qwenKey) {
    return {
      enabled: process.env.AI_EXPLANATION_ENABLED === "true",
      provider: "qwen",
      apiKey: qwenKey,
      baseUrl:
        cleanEnvValue(process.env.DASHSCOPE_BASE_URL) ||
        "https://dashscope.aliyuncs.com/compatible-mode/v1",
      model: cleanEnvValue(process.env.DASHSCOPE_MODEL) || "qwen-plus"
    };
  }

  if (zhipuKey) {
    return {
      enabled: process.env.AI_EXPLANATION_ENABLED === "true",
      provider: "zhipu",
      apiKey: zhipuKey,
      baseUrl: cleanEnvValue(process.env.ZHIPU_BASE_URL) || "https://open.bigmodel.cn/api/paas/v4",
      model: cleanEnvValue(process.env.ZHIPU_MODEL) || "glm-4-flash"
    };
  }

  if (moonshotKey) {
    return {
      enabled: process.env.AI_EXPLANATION_ENABLED === "true",
      provider: "moonshot",
      apiKey: moonshotKey,
      baseUrl: cleanEnvValue(process.env.MOONSHOT_BASE_URL) || "https://api.moonshot.cn/v1",
      model: cleanEnvValue(process.env.MOONSHOT_MODEL) || "moonshot-v1-8k"
    };
  }

  return {
    enabled: process.env.AI_EXPLANATION_ENABLED === "true",
    provider: "openai",
    apiKey: explicitOpenAiKey,
    baseUrl: cleanEnvValue(process.env.OPENAI_BASE_URL) || "https://api.openai.com/v1",
    model: cleanEnvValue(process.env.OPENAI_MODEL) || "gpt-4.1-mini"
  };
}

const appRoot = process.env.APP_ROOT ? path.resolve(process.env.APP_ROOT) : process.cwd();
const dataRoot = process.env.APP_DATA_ROOT
  ? path.resolve(process.env.APP_DATA_ROOT)
  : path.join(appRoot, "data");
const resolvedAiConfig = resolveAiConfig();

export const appConfig = {
  serverPort: Number(process.env.SERVER_PORT ?? "4310"),
  serverHost: process.env.SERVER_HOST ?? "127.0.0.1",
  defaultQuizSize: 5,
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:4175",
  ai: resolvedAiConfig,
  appRoot,
  dataRoot
};

export const paths = {
  root: appRoot,
  dataDir: dataRoot,
  questions: path.join(dataRoot, "questions.json"),
  knowledgePoints: path.join(dataRoot, "knowledge-points.json"),
  attempts: path.join(dataRoot, "attempts.json"),
  users: path.join(dataRoot, "users.json"),
  aiExplanationCache: path.join(dataRoot, "ai-explanations-cache.json")
};
