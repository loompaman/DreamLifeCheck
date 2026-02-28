const fs = require("fs");
const path = require("path");

const root = ".open-next";
const out = path.join(root, "assets");

const copyDirContents = (src, dest) => {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    fs.cpSync(path.join(src, entry), path.join(dest, entry), { recursive: true });
  }
};

// Public assets -> output root (so /demo-*.png works)
copyDirContents("public", out);

// Next static assets -> /_next/static/*
copyDirContents(path.join(".next", "static"), path.join(out, "_next", "static"));

// OpenNext runtime folders needed by the worker
copyDirContents(path.join(root, "cloudflare"), path.join(out, "cloudflare"));
copyDirContents(path.join(root, "middleware"), path.join(out, "middleware"));
copyDirContents(path.join(root, "server-functions"), path.join(out, "server-functions"));
copyDirContents(path.join(root, ".build"), path.join(out, ".build"));
copyDirContents(path.join(root, "cache"), path.join(out, "cache"));

// Force asset resolver to use ASSETS binding in Pages advanced mode.
const initPath = path.join(out, "cloudflare", "init.js");
if (fs.existsSync(initPath)) {
  const marker = "__ASSETS_RUN_WORKER_FIRST__";
  const contents = fs.readFileSync(initPath, "utf8");
  if (!contents.includes("globalThis.__ASSETS_RUN_WORKER_FIRST__")) {
    fs.appendFileSync(
      initPath,
      `\n// Force static assets to be served via ASSETS binding in Pages\n` +
        `globalThis.__ASSETS_RUN_WORKER_FIRST__ = true;\n`
    );
  }
}

// Pages requires _worker.js at output root
const workerSrc = path.join(root, "worker.js");
const workerDst = path.join(out, "_worker.js");
if (!fs.existsSync(workerSrc)) {
  throw new Error(`Missing ${workerSrc}`);
}
fs.copyFileSync(workerSrc, workerDst);
if (fs.existsSync(`${workerSrc}.map`)) {
  fs.copyFileSync(`${workerSrc}.map`, `${workerDst}.map`);
}
