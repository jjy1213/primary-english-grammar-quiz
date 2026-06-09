import fs from "node:fs";
import path from "node:path";
import { paths } from "./config.js";

export function ensureAppFiles() {
  if (!fs.existsSync(paths.dataDir)) {
    fs.mkdirSync(paths.dataDir, { recursive: true });
  }

  copySeedFileIfMissing("knowledge-points.json");
  copySeedFileIfMissing("questions.json");
  copySeedFileIfMissing("users.json");

  if (!fs.existsSync(paths.attempts)) {
    fs.writeFileSync(paths.attempts, "[]", "utf8");
  }

  if (!fs.existsSync(paths.aiExplanationCache)) {
    fs.writeFileSync(paths.aiExplanationCache, "{}", "utf8");
  }
}

export function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function writeJsonFile<T>(filePath: string, value: T) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function copySeedFileIfMissing(fileName: string) {
  const targetPath = path.join(paths.dataDir, fileName);
  if (fs.existsSync(targetPath)) {
    return;
  }

  const seedPath = path.join(paths.root, "data", fileName);
  if (fs.existsSync(seedPath)) {
    fs.copyFileSync(seedPath, targetPath);
  }
}
