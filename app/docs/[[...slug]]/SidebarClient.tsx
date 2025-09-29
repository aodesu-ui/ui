"use client";

import { docsIndex, type DocEntry } from "@/lib/mdx/docs-index";
import { Button } from "@/registry/aodesu/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type TreeNode = {
  name: string;
  slug: string;
  title: string;
  order?: number;
  isPage?: boolean;
  children: TreeNode[];
};

function humanize(part: string) {
  return part.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

function buildTree(entries: DocEntry[]): TreeNode[] {
  const rootMap = new Map<string, TreeNode>();

  // process entries in order to preserve ordering heuristic
  const sorted = [...entries].sort((a, b) => a.order - b.order);

  for (const e of sorted) {
    const parts = e.slug.split("/").filter(Boolean);
    let pathSoFar = "";
    let parentMap = rootMap;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      pathSoFar = pathSoFar ? `${pathSoFar}/${part}` : part;
      let node = parentMap.get(part) as TreeNode | undefined;

      if (!node) {
        node = {
          name: part,
          slug: pathSoFar,
          title: humanize(part),
          order: undefined,
          isPage: false,
          children: [],
        };
        parentMap.set(part, node);
      }

      // if this part is the final segment, mark page and set title/order
      if (i === parts.length - 1) {
        node.isPage = true;
        node.title = e.title ?? node.title;
        node.order = e.order;
      }

      // prepare parentMap for next level (use a map on node children keyed by name)
      // we store children in array but need a map for quick lookup across iterations
      if (!(node as any).__childMap) {
        (node as any).__childMap = new Map<string, TreeNode>();
        for (const ch of node.children)
          (node as any).__childMap.set(ch.name, ch);
      }
      parentMap = (node as any).__childMap;
    }
  }

  // convert maps to arrays and sort children by order (fallback insertion order)
  function finalize(map: Map<string, TreeNode>): TreeNode[] {
    const arr = Array.from(map.values());
    for (const n of arr) {
      if ((n as any).__childMap) {
        n.children = finalize((n as any).__childMap);
        delete (n as any).__childMap;
      }
      // ensure order: pages keep their explicit order; folders get min child order if missing
      if (n.order == null && n.children.length > 0) {
        const childOrders = n.children.map((c) => c.order ?? Infinity);
        n.order = Math.min(...childOrders);
        if (!isFinite(n.order)) n.order = undefined;
      }
    }
    arr.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
    return arr;
  }

  return finalize(rootMap);
}

function SidebarItem({ node }: { node: TreeNode }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  // leaf page (no children)
  if (node.isPage && !hasChildren) {
    return (
      <Button asChild className="w-full justify-start" size="small">
        <Link
          href={`/docs/${node.slug}`}
        >
          {node.title}
        </Link>
      </Button>
    );
  }

  // folder (may also be a page)
  return (
    <div className="mb-2">
      <Button
        onClick={() => setOpen((s) => !s)}
        className="w-full justify-start"
        size="small"
      >
        <ChevronDown className={open ? "rotate-0" : "-rotate-90"} />
        {node.title}
      </Button>

      {open && (
        <div className="ml-4 mt-1 space-y-1">
          {node.isPage && (
            <Link
              href={`/docs/${node.slug}`}
              className="block px-2 py-1 hover:bg-accent rounded"
            >
              {node.title}
            </Link>
          )}
          {node.children.map((child) => (
            <SidebarItem key={child.slug} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SidebarClient() {
  const tree = useMemo(() => buildTree(docsIndex), []);

  return (
    <aside className="w-64 p-4 border-r overflow-y-auto">
      {tree.map((node) => (
        <SidebarItem key={node.slug} node={node} />
      ))}
    </aside>
  );
}
