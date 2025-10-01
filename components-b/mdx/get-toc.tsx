// lib/mdx/get-toc.ts
import type { Heading, Text } from "mdast";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export interface TocItem {
  depth: number;
  value: string;
  id: string;
}

export async function getToc(source: string): Promise<TocItem[]> {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);

  const headings: TocItem[] = [];

  visit(tree, "heading", (node: Heading) => {
    const textNode = node.children.find((c): c is Text => c.type === "text");
    if (!textNode) return;

    const value = textNode.value;
    const id = value
      .toLowerCase()
      .replace(/[^\w]+/g, "-")
      .replace(/(^-|-$)/g, "");

    headings.push({
      depth: node.depth,
      value,
      id,
    });
  });

  return headings;
}
