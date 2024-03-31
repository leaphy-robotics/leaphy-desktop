const { platform } = require("os");
const { execSync } = require("child_process");
const tar = require("./tar");
const fs = require("fs");
const path = require("path");

if (!fs.existsSync("deps")) fs.mkdirSync("deps");

async function setupArduinoCli(platform) {
  const platformBinaries = {
    win32:
      "https://github.com/arduino/arduino-cli/releases/download/v0.35.2/arduino-cli_0.35.2_Windows_64bit.zip",
    linux: {
      x86_64:
        "https://github.com/arduino/arduino-cli/releases/download/v0.35.2/arduino-cli_0.35.2_Linux_64bit.tar.gz",
      armv7l:
        "https://github.com/arduino/arduino-cli/releases/download/v0.35.2/arduino-cli_0.35.2_Linux_ARMv7.tar.gz",
    },
  };

  let url = platformBinaries[platform];
  if (url instanceof Object) {
    url = url[execSync("uname -m").toString().trim()];
  }
  await tar(url);
}

const LIBRARIES = [
  "Leaphy Original Extension",
  "Leaphy Extra Extension",
  "Servo",
  "Adafruit GFX Library",
  "Adafruit SSD1306",
  "Adafruit LSM9DS1 Library",
  "Adafruit Unified Sensor",
  "List",
  "Adafruit SGP30 Sensor",
  "Adafruit_VL53L0X",
  "Adafruit BMP280 Library",
  "TM1637",
  "LedControl",
  "QMC5883LCompass",
  "Arduino_APDS9960",
];

async function setupAvr() {
  let arduinoCli = path.join(__dirname, "../deps/arduino-cli");
  if (platform() === "win32") arduinoCli = arduinoCli.replaceAll("/", "\\");

  try {
    execSync(`"${arduinoCli}" config init`);
  } catch (e) {}
  execSync(
    `"${arduinoCli}" config set directories.data "${path.join(__dirname, "../deps/arduino-cli-data")}"`,
  );
  execSync(
    `"${arduinoCli}" config set directories.user "${path.join(__dirname, "../deps/arduino-cli-user")}"`,
  );
  execSync(
    `"${arduinoCli}" core install arduino:avr arduino:esp32 arduino:mbed_nano`,
  );
  execSync(
    `"${arduinoCli}" lib install ${LIBRARIES.map((lib) => `"${lib}"`).join(" ")}`,
  );
}

setupArduinoCli(platform()).then(async () => {
  await setupAvr();
});
