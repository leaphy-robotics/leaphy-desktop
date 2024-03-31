import express from "express";
import path from "path";

export default function runServer() {
  const app = express();
  app.use((_req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
  });
  app.use(express.static(path.join(__dirname, "../deps/public")));
  app.listen(8001);
}
