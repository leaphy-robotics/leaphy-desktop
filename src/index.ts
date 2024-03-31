import { app, BrowserWindow } from "electron";
import registerSerial from "./serial";
import registerBackend from "./backend";
import registerServer from "./server";
import { ChildProcess } from "child_process";
import path from "path";

let backend: ChildProcess;

app.disableHardwareAcceleration();
async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  });
  win.setMenu(null);
  win.setIcon(path.join(__dirname, "../assets/icon.png"));
  win.maximize();
  registerServer();

  await win.loadURL("http://localhost:8001");
  registerSerial(win);
  backend = registerBackend();
}

app.whenReady().then(async () => {
  await createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    console.log("Killing backend...");
    backend.kill("SIGTERM");
    backend.kill("SIGTERM");

    app.quit();
  }
});

app.on("before-quit", () => {
  backend.kill("SIGTERM");
  backend.kill("SIGTERM");
});
