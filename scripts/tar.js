const fs = require("fs");
const { https } = require("follow-redirects");
const decompress = require("decompress");
const { randomUUID } = require("crypto");
const { execSync } = require("child_process");

async function unZip(file) {
  execSync(`tar.exe -xf ${file} -C deps`);
}

async function unTar(url) {
  let fileName;
  if (url.endsWith(".zip")) fileName = `${randomUUID()}.zip`;
  else fileName = `${randomUUID()}.tar.gz`;

  const file = fs.createWriteStream(fileName);

  await new Promise((resolve) => {
    https.get(url, (res) => {
      res.on("data", (chunk) => {
        file.write(chunk);
      });
      res.on("end", () => {
        file.close(resolve);
      });
    });
  });

  if (url.endsWith(".zip")) await unZip(fileName);
  else await decompress(fileName, "deps");

  fs.unlinkSync(fileName);

  console.log("Downloaded and extracted");
}

module.exports = unTar;
