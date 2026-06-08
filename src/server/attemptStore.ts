import { v4 as uuid } from "uuid";
import { paths } from "./config.js";
import { readJsonFile, writeJsonFile } from "./fsUtils.js";
import type { AttemptRecord } from "./types.js";

export function listAttempts(): AttemptRecord[] {
  return readJsonFile<AttemptRecord[]>(paths.attempts);
}

export function getAttemptById(id: string): AttemptRecord | undefined {
  return listAttempts().find((item) => item.id === id);
}

export function saveAttempt(
  input: Omit<AttemptRecord, "id" | "submittedAt">
): AttemptRecord {
  const attempts = listAttempts();
  const nextRecord: AttemptRecord = {
    id: uuid(),
    submittedAt: new Date().toISOString(),
    ...input
  };

  attempts.push(nextRecord);
  writeJsonFile(paths.attempts, attempts);
  return nextRecord;
}
