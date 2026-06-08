import path from "node:path";

const appRoot = process.env.APP_ROOT ? path.resolve(process.env.APP_ROOT) : process.cwd();
const dataRoot = process.env.APP_DATA_ROOT
  ? path.resolve(process.env.APP_DATA_ROOT)
  : path.join(appRoot, "data");

export const appConfig = {
  serverPort: Number(process.env.SERVER_PORT ?? "4310"),
  defaultQuizSize: 5,
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:4175",
  appRoot,
  dataRoot
};

export const paths = {
  root: appRoot,
  dataDir: dataRoot,
  questions: path.join(dataRoot, "questions.json"),
  knowledgePoints: path.join(dataRoot, "knowledge-points.json"),
  attempts: path.join(dataRoot, "attempts.json")
};
