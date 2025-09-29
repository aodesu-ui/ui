// lib/mdx/get-mdx-source.ts
import { components } from "@/components/mdx/components";
import { getToc } from "@/components/mdx/get-toc";
import fs from "fs";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";

function cleanSlug(raw?: string) {
  if (!raw) return "";
  return raw
    .split("/")
    .filter(Boolean)
    .filter((s) => s !== "examples")
    .join("/");
}

function stripFrontmatter(source: string) {
  // elimina bloque YAML/MD frontmatter inicial (--- ... ---)
  return source.replace(/^---\s*[\r\n]+[\s\S]*?[\r\n]+---\s*[\r\n]*/m, "");
}

export async function getMdxSource(slug = "", lang?: string) {
  const cleaned = cleanSlug(slug);
  const basePath = path.join(process.cwd(), "content", "docs", cleaned);

  let filePath: string | null = null;

  if (lang && fs.existsSync(path.join(basePath, `index-${lang}.mdx`))) {
    filePath = path.join(basePath, `index-${lang}.mdx`);
  } else if (fs.existsSync(path.join(basePath, "index.mdx"))) {
    filePath = path.join(basePath, "index.mdx");
  } else {
    const last = cleaned ? path.basename(cleaned) : "";
    if (last) {
      if (lang && fs.existsSync(path.join(basePath, `${last}-${lang}.mdx`))) {
        filePath = path.join(basePath, `${last}-${lang}.mdx`);
      } else if (fs.existsSync(path.join(basePath, `${last}.mdx`))) {
        filePath = path.join(basePath, `${last}.mdx`);
      }
    }
  }

  if (!filePath) {
    // último recurso: si slug apuntaba a un archivo directo
    const possibleFile = path.join(process.cwd(), "content", "docs", cleaned);
    if (fs.existsSync(possibleFile) && fs.statSync(possibleFile).isFile()) {
      filePath = possibleFile;
    }
  }

  if (!filePath) {
    throw new Error(
      `No se encontró MDX para slug="${slug}" (limpio="${cleaned}")`
    );
  }

  const source = fs.readFileSync(filePath, "utf8");

  // TOC se genera sobre el contenido sin frontmatter
  const sourceForToc = stripFrontmatter(source);
  const toc = await getToc(sourceForToc);

  // compileMDX con parseFrontmatter para obtener frontmatter por separado
  const { content, frontmatter } = await compileMDX({
    source,
    components,
    options: { parseFrontmatter: true },
  });

  return { content, toc, frontmatter };
}
