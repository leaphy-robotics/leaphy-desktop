const { execSync } = require("child_process");
const fs = require("fs");

if (!fs.existsSync("deps")) fs.mkdirSync("deps");

async function buildWebbased() {
  process.chdir("deps");
  execSync("git clone https://github.com/leaphy-robotics/leaphy-webbased-svelte");
  process.chdir("leaphy-webbased-svelte");

  execSync("yarn install");

  process.env.VITE_BACKEND_URL = "http://localhost:8000"
  process.env.NODE_OPTIONS = "--max-old-space-size=4096"
  execSync("yarn build");

  fs.renameSync("dist", "../public");
  process.chdir("..");
  fs.rmSync("leaphy-webbased-svelte", { recursive: true, force: true });

  console.log("Webbased build complete");
}

buildWebbased().then();
