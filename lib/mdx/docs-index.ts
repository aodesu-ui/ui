// lib/mdx/docs-index.ts
// ⚠️ Este archivo es generado automáticamente por scripts/generate-docs-index.ts
// No editar manualmente. Para cambiar el orden o títulos, edita docsConfig en el script.

export interface DocEntry {
  slug: string;
  title: string;
  children?: DocEntry[];
  hasIndexFile?: boolean;
}

// Configuración manual para orden y títulos personalizados
export const docsConfig: Record<string, { title?: string; order?: number }> = {
  "getting-started": {
    "title": "Getting Started",
    "order": 1
  },
  "components": {
    "title": "Componentes",
    "order": 2
  },
  "components/inputs": {
    "title": "Inputs",
    "order": 1
  },
  "components/inputs/button": {
    "title": "Button",
    "order": 1
  }
};

// Árbol de documentación generado automáticamente
export const docsIndex: DocEntry[] = [
  {
    "slug": "getting-started",
    "title": "Getting Started",
    "children": [
      {
        "slug": "getting-started/index",
        "title": "Empezando"
      }
    ],
    "hasIndexFile": true
  },
  {
    "slug": "components",
    "title": "Componentes",
    "children": [
      {
        "slug": "components/inputs",
        "title": "Inputs",
        "children": [
          {
            "slug": "components/inputs/button",
            "title": "Button",
            "children": [
              {
                "slug": "components/inputs/button/index",
                "title": "Botón"
              }
            ],
            "hasIndexFile": true
          }
        ],
        "hasIndexFile": false
      },
      {
        "slug": "components/index",
        "title": "Componentes"
      }
    ],
    "hasIndexFile": true
  }
];

// ---------- helpers ----------

// Aplanar árbol manteniendo el orden jerárquico
function flattenTree(tree: DocEntry[]): DocEntry[] {
  const result: DocEntry[] = [];
  for (const node of tree) {
    result.push({ slug: node.slug, title: node.title });
    if (node.children) {
      result.push(...flattenTree(node.children));
    }
  }
  return result;
}

// Obtener página anterior y siguiente
export function getPrevNext(slug: string) {
  const flat = flattenTree(docsIndex);
  const idx = flat.findIndex((d) => d.slug === slug);
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

// Obtener todas las rutas para generateStaticParams
export function getAllDocSlugs(): string[][] {
  const flat = flattenTree(docsIndex);
  return flat.map((doc) => doc.slug.split("/"));
}

// Buscar un documento específico en el árbol
export function findDocBySlug(slug: string, tree: DocEntry[] = docsIndex): DocEntry | null {
  for (const node of tree) {
    if (node.slug === slug) return node;
    if (node.children) {
      const found = findDocBySlug(slug, node.children);
      if (found) return found;
    }
  }
  return null;
}

// Obtener breadcrumbs para una ruta
export function getBreadcrumbs(slug: string): DocEntry[] {
  const parts = slug.split("/");
  const crumbs: DocEntry[] = [];
  
  for (let i = 0; i < parts.length; i++) {
    const partialSlug = parts.slice(0, i + 1).join("/");
    const doc = findDocBySlug(partialSlug);
    if (doc) crumbs.push(doc);
  }
  
  return crumbs;
}
