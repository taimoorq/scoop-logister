#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = parseArgs(process.argv.slice(2));
const version = required(args.version, "--version");
const sha256 = required(args.sha256, "--sha256");
const url = args.url || `https://registry.npmjs.org/logister-cli/-/logister-cli-${version}.tgz`;
const output = resolve(args.output || "bucket/logister.json");

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
    script: [
      "$cmd = @(",
      "    '@echo off',",
      "    'set LOGISTER_INSTALL_SOURCE=scoop',",
      "    'node \"%~dp0package\\\\bin\\\\logister.js\" %*'",
      ")",
      "Set-Content \"$dir\\\\logister.cmd\" ($cmd -join \"`r`n\") -Encoding ASCII"
    ]
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
  if (!value) {
    process.stderr.write(`Missing ${name}\n`);
    process.exit(2);
  }
  return value;
}
