import { app, BrowserWindow } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
const serverPort = Number(process.env.SERVER_PORT ?? "4310");

let mainWindow: BrowserWindow | null = null;
let serverHandle: { close?: () => void } | null = null;

function resolveAppRoot() {
  if (isDev) {
    return process.env.APP_ROOT ? path.resolve(process.env.APP_ROOT) : process.cwd();
  }

  return process.resourcesPath;
}

function resolveDataRoot() {
  if (isDev) {
    return path.join(resolveAppRoot(), "data");
  }

  const userDataRoot = path.join(app.getPath("userData"), "data");
  if (!fs.existsSync(userDataRoot)) {
    fs.mkdirSync(userDataRoot, { recursive: true });
  }
  return userDataRoot;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1000,
    minHeight: 720,
    backgroundColor: "#f4efe6",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  if (isDev) {
    void mainWindow.loadURL("http://127.0.0.1:4175");
    mainWindow.webContents.openDevTools({ mode: "detach" });
    return;
  }

  void mainWindow.loadFile(path.join(resolveAppRoot(), "dist", "index.html"));
}

async function bootstrap() {
  process.env.APP_ROOT = resolveAppRoot();
  process.env.APP_DATA_ROOT = resolveDataRoot();
  process.env.CLIENT_ORIGIN = isDev ? "http://127.0.0.1:4175" : "file://";
  process.env.START_SERVER = "false";

  await app.whenReady();
  serverHandle = await startEmbeddedServer();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}

void bootstrap();

app.on("window-all-closed", () => {
  serverHandle?.close?.();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

async function startEmbeddedServer() {
  const serverEntry = isDev
    ? path.join(resolveAppRoot(), "dist", "server", "index.js")
    : path.join(resolveAppRoot(), "dist", "server", "index.js");
  const serverModule = await import(pathToFileURL(serverEntry).href);
  return serverModule.startServer(serverPort) as { close?: () => void };
}
