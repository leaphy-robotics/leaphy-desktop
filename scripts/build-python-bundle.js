const { execSync } = require("child_process");
const { platform } = require("os");
const fs = require("fs");
const tar = require("./tar");
const path = require("path");

if (!fs.existsSync("deps")) fs.mkdirSync("deps");

async function setupPython(platform) {
  const platformBinaries = {
    win32:
      "https://github.com/indygreg/python-build-standalone/releases/download/20240107/cpython-3.11.7+20240107-x86_64-pc-windows-msvc-shared-install_only.tar.gz",
    linux: {
      x86_64:
        "https://github.com/indygreg/python-build-standalone/releases/download/20240107/cpython-3.11.7+20240107-x86_64-unknown-linux-gnu-install_only.tar.gz",
      armv7l:
        "https://github.com/rmartin16/python-standalone-releases/releases/download/continuous/cpython-3.11-armv7-unknown-linux-gnueabihf-noopt.tar.gz",
    },
  };

  let url = platformBinaries[platform];
  if (url instanceof Object) {
    url = url[execSync("uname -m").toString().trim()];
  }
  await tar(url);
}

async function setupCompiler() {
  const platformExecutables = {
    win32: path
      .join(__dirname, "../deps/python/python.exe")
      .replaceAll("/", "\\"),
    linux: path.join(__dirname, "../deps/python/bin/python3"),
  };

  if (fs.existsSync("deps/leaphy-webbased-backend")) {
    fs.rmSync("deps/leaphy-webbased-backend", { recursive: true });
  }

  process.chdir("deps");
  execSync(
    "git clone https://github.com/leaphy-robotics/leaphy-webbased-backend",
  );
  process.chdir("leaphy-webbased-backend");

  execSync(`"${platformExecutables[platform()]}" -m ensurepip`);
  execSync(
    `"${platformExecutables[platform()]}" -m pip install -r requirements.txt`,
  );

  console.log("Compiler setup complete");
}

setupPython(platform()).then(async () => {
  await setupCompiler();
});
