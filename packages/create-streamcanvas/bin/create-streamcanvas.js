#!/usr/bin/env node

import { access, cp, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const HELP = `create-streamcanvas

Usage:
  npx create-streamcanvas my-app

What it does:
  - copies a minimal StreamCanvas starter into ./my-app
  - replaces __APP_NAME__ placeholders
`;

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const templateDirectory = path.resolve(currentDirectory, "../template");

async function replaceTokens(directory, appName) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const targetPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await replaceTokens(targetPath, appName);
      continue;
    }

    const content = await readFile(targetPath, "utf8");
    await writeFile(targetPath, content.replaceAll("__APP_NAME__", appName), "utf8");
  }
}

async function main() {
  const [, , targetArgument] = process.argv;

  if (!targetArgument || targetArgument === "--help" || targetArgument === "-h") {
    console.log(HELP);
    return;
  }

  const targetDirectory = path.resolve(process.cwd(), targetArgument);

  try {
    await access(targetDirectory);
    console.error(`Target directory already exists: ${targetDirectory}`);
    process.exitCode = 1;
    return;
  } catch {
    // Expected when the target directory does not exist.
  }

  await cp(templateDirectory, targetDirectory, {
    recursive: true,
  });
  await replaceTokens(targetDirectory, targetArgument);

  console.log(`Created ${targetArgument} at ${targetDirectory}`);
  console.log("Next steps:");
  console.log(`  cd ${targetArgument}`);
  console.log("  pnpm install");
  console.log("  pnpm dev");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Scaffold failed.");
  process.exit(1);
});
