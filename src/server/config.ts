import path from "node:path";

const root = process.cwd();

export const appConfig = {
  serverPort: 4310,
  defaultQuizSize: 5
};

export const paths = {
  root,
  dataDir: path.join(root, "data"),
  questions: path.join(root, "data", "questions.json"),
  knowledgePoints: path.join(root, "data", "knowledge-points.json"),
  attempts: path.join(root, "data", "attempts.json")
};
