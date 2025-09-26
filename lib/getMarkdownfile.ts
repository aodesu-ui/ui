// lib/getMarkdownFile.ts
import fs from "fs";
import path from "path";

export function getMarkdownFile(baseName: string, lang?: string) {
  const docsDir = path.join(process.cwd(), "content");

  const localized = lang
    ? path.join(docsDir, `${baseName}-${lang}.md`)
    : null;

  if (localized && fs.existsSync(localized)) return fs.readFileSync(localized, "utf-8");

  const fallback = path.join(docsDir, `${baseName}.md`);
  if (fs.existsSync(fallback)) return fs.readFileSync(fallback, "utf-8");

  throw new Error(`Archivo no encontrado: ${baseName}`);
}
