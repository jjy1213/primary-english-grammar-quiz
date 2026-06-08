import fs from "node:fs";
import { paths } from "./config.js";

export function ensureAppFiles() {
  if (!fs.existsSync(paths.dataDir)) {
    fs.mkdirSync(paths.dataDir, { recursive: true });
  }

  if (!fs.existsSync(paths.attempts)) {
    fs.writeFileSync(paths.attempts, "[]", "utf8");
  }
}

export function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function writeJsonFile<T>(filePath: string, value: T) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}
