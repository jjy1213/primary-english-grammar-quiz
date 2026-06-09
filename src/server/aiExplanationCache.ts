import { paths } from "./config.js";
import { readJsonFile, writeJsonFile } from "./fsUtils.js";

interface CachedExplanationEntry {
  explanation: string;
  explanationSource: "ai";
  updatedAt: string;
}

type CacheStore = Record<string, CachedExplanationEntry>;

let cacheSnapshot: CacheStore | null = null;

function loadCacheStore(): CacheStore {
  if (!cacheSnapshot) {
    cacheSnapshot = readJsonFile<CacheStore>(paths.aiExplanationCache);
  }

  return cacheSnapshot;
}

export function getCachedExplanation(cacheKey: string) {
  const store = loadCacheStore();
  return store[cacheKey] ?? null;
}

export function saveCachedExplanation(cacheKey: string, explanation: string) {
  const store = loadCacheStore();
  store[cacheKey] = {
    explanation,
    explanationSource: "ai",
    updatedAt: new Date().toISOString()
  };
  writeJsonFile(paths.aiExplanationCache, store);
}

export function resetExplanationCacheForTests() {
  cacheSnapshot = {};
}
