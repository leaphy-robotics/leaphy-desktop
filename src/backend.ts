import { execFile, execSync } from "child_process";
import { platform } from "os";
import path from "path";

const platformExecutables: Record<string, string> = {
  win32: path.join(__dirname, "../deps/python/python.exe").replace("/", "\\"),
  linux: path.join(__dirname, "../deps/python/bin/python3"),
};

export default function runBackend() {
  let arduinoCli = path.join(__dirname, "../deps/arduino-cli");
  if (platform() === "win32") arduinoCli = arduinoCli.replace("/", "\\");

  const backendDir = path.join(__dirname, "../deps/leaphy-webbased-backend");
  const dataDir = path.join(__dirname, "../deps/arduino-cli-data");
  const userDir = path.join(__dirname, "../deps/arduino-cli-user");

  try {
    execSync(`"${arduinoCli}" config init --overwrite`);
  } catch (e) {}
  execSync(`"${arduinoCli}" config set directories.data "${dataDir}"`);
  execSync(`"${arduinoCli}" config set directories.user "${userDir}"`);

  process.env.ARDUINO_CLI_PATH = arduinoCli;
  process.env.LIBRARY_INDEX_REFRESH_INTERVAL = "-1";

  return execFile(
    platformExecutables[platform()],
    ["-m", "uvicorn", "main:app"],
    {
      cwd: backendDir,
    },
  );
}
