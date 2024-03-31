const builder = require("electron-builder");
const { platform } = require("os");
const Platform = builder.Platform;

const ARCH_TARGETS = {
  x86_64: [
    {
      target: "AppImage",
      arch: "x64",
    },
    {
      target: "rpm",
      arch: "x64",
    },
    {
      target: "deb",
      arch: "x64",
    },
  ],
  armv7l: [
    {
      target: "AppImage",
      arch: "armv7l",
    },
    {
      target: "deb",
      arch: "armv7l",
    },
  ],
};

const ARCH = process.argv[2] || "x86_64";

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const options = {
  compression: "normal",
  removePackageScripts: true,

  nodeGypRebuild: false,
  buildDependenciesFromSource: false,

  icon: "assets/icon.png",
  directories: {
    output: "dist/artifacts/local",
    buildResources: "installer/resources",
  },
  files: ["package.json", { from: "build/", to: "." }],
  extraResources: ["deps", "assets"],

  win: {
    target: "nsis",
  },
  nsis: {
    deleteAppDataOnUninstall: true,
  },

  linux: {
    desktop: {
      StartupNotify: "false",
      Encoding: "UTF-8",
      Icon: "/usr/share/icons/hicolor/0x0/apps/easybloqs.png",
    },
    icon: "assets/icon.png",
    target: ARCH_TARGETS[ARCH],
    category: "Development",
  },

  publish: {
    provider: "github",
    releaseType: "release",
  },
  artifactName: "${arch}-${productName}-${version}.${ext}",
};

const platforms = {
  win32: Platform.WINDOWS,
  linux: Platform.LINUX,
};

builder
  .build({
    targets: platforms[platform()].createTarget(),
    config: options,
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
