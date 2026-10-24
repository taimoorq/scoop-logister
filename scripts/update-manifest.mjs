#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = parseArgs(process.argv.slice(2));
const version = required(args.version, "--version");
const sha256 = required(args.sha256, "--sha256");
const canonicalUrl = `https://registry.npmjs.org/logister-cli/-/logister-cli-${version}.tgz`;
const url = args.url || canonicalUrl;
const output = resolve(args.output || "bucket/logister.json");

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) fail(`Invalid --version: ${version}`);
if (!/^[a-f0-9]{64}$/.test(sha256)) fail("--sha256 must be 64 lowercase hex characters");
if (url !== canonicalUrl) fail(`--url must be ${canonicalUrl}`);

// The installer script is executed by CI, which requires it to match this template exactly.
const installerScript = readFileSync(new URL("./scoop-installer.ps1", import.meta.url), "utf8")
  .replace(/\r\n/g, "\n")
  .replace(/\n$/, "")
  .split("\n");

const manifest = {
  version,
  description: "Command-line access to Logister project telemetry for humans and AI tools.",
  homepage: "https://github.com/taimoorq/logister-cli",
  license: "MIT",
  depends: "nodejs-lts",
  url,
  hash: sha256,
  extract_dir: "package",
  installer: {
    script: installerScript
  },
  bin: [["logister.cmd", "logister"]],
  checkver: {
    url: "https://registry.npmjs.org/logister-cli/latest",
    jsonpath: "$.version"
  },
  autoupdate: {
    url: "https://registry.npmjs.org/logister-cli/-/logister-cli-$version.tgz"
  }
};

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`updated ${output}\n`);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${key}`);
    parsed[key.slice(2)] = value;
    index += 1;
  }
  return parsed;
}

function required(value, name) {
  if (!value) fail(`Missing ${name}`);
  return value;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}
