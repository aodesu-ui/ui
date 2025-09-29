// lib/mdx/docs-index.ts
export interface DocEntry {
  slug: string;         // "getting-started/intro"
  title: string;
  order: number;
}

export const docsIndex: DocEntry[] = [
  { slug: "getting-started", title: "Getting Started", order: 1 },
  { slug: "components/button", title: "Button", order: 2 },
  // ...
];

// utilidades
export function getPrevNext(slug: string) {
  const sorted = [...docsIndex].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((d) => d.slug === slug);
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}
