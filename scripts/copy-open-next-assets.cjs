const fs = require("fs");
const path = require("path");

const root = ".open-next";

const copyDirContents = (src, dest) => {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    fs.cpSync(path.join(src, entry), path.join(dest, entry), { recursive: true });
  }
};

// Public assets -> root (so /demo-*.png works)
copyDirContents("public", root);

// Next static assets -> /_next/static/*
copyDirContents(path.join(".next", "static"), path.join(root, "_next", "static"));

// Pages requires _worker.js at output root
const workerSrc = path.join(root, "worker.js");
const workerDst = path.join(root, "_worker.js");
if (!fs.existsSync(workerSrc)) {
  throw new Error(`Missing ${workerSrc}`);
}
fs.copyFileSync(workerSrc, workerDst);
if (fs.existsSync(`${workerSrc}.map`)) {
  fs.copyFileSync(`${workerSrc}.map`, `${workerDst}.map`);
}
