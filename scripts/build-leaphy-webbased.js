const { execSync } = require("child_process");
const fs = require("fs");

if (!fs.existsSync("deps")) fs.mkdirSync("deps");

async function buildWebbased() {
  process.chdir("deps");
  execSync("git clone https://github.com/leaphy-robotics/leaphy-webbased");
  process.chdir("leaphy-webbased");

  execSync("yarn install");
  execSync("yarn buildLocal");

  fs.renameSync("dist", "../public");
  process.chdir("..");
  fs.rmSync("leaphy-webbased", { recursive: true, force: true });

  console.log("Webbased build complete");
}

buildWebbased().then();
