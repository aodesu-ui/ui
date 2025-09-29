// lib/mdx/get-docs-tree.ts
import fs from "fs";
import path from "path";

export interface DocNode {
  name: string;
  type: "dir" | "file";
  children?: DocNode[];
}

const IGNORED_DIRS = new Set(["examples"]);

function walk(dir: string): DocNode[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes: DocNode[] = [];

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      nodes.push({
        name: entry.name,
        type: "dir",
        children: walk(full),
      });
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      nodes.push({
        name: path.basename(entry.name, ".mdx"),
        type: "file",
      });
    }
  }

  return nodes;
}

export function getDocsTree() {
  const root = path.join(process.cwd(), "content", "docs");
  return walk(root);
}
