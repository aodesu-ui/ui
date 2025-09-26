// lib/mdx/get-mdx-source.ts
import { components } from "@/components/mdx/components";
import fs from "fs";
import { compileMDX } from "next-mdx-remote/rsc"; // si usas next-mdx-remote/rsc
import path from "path";
import { getToc } from "./get-toc";

export async function getMdxSource(slug: string, lang?: string) {
  const basePath = path.join(process.cwd(), "content", "docs");
  const file =
    lang && fs.existsSync(path.join(basePath, `${slug}-${lang}.mdx`))
      ? `${slug}-${lang}.mdx`
      : `${slug}.mdx`;

  const filePath = path.join(basePath, file);
  const source = fs.readFileSync(filePath, "utf8");

  const toc = await getToc(source);

  const { content } = await compileMDX({
    source,
    components,
  });

  return { content, toc };
}
