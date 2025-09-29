// scripts/generate-docs-index.ts
import fs from "fs";
import path from "path";

interface DocEntry {
  slug: string;
  title: string;
  children?: DocEntry[];
  hasIndexFile?: boolean;
}

// Configuración manual para orden y títulos personalizados
const docsConfig: Record<string, { title?: string; order?: number }> = {
  "getting-started": { title: "Getting Started", order: 1 },
  "components": { title: "Componentes", order: 2 },
  "components/inputs": { title: "Inputs", order: 1 },
  "components/inputs/button": { title: "Button", order: 1 },
};

const IGNORED_DIRS = new Set(["examples"]);

// Función para obtener el título desde el frontmatter del MDX
function getTitleFromMDX(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(/^---\s*\ntitle:\s*["']?([^"'\n]+)["']?\s*\n/m);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Generar árbol desde el filesystem
function walkDocs(dir: string, baseSlug = ""): DocEntry[] {
  if (!fs.existsSync(dir)) return [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes: DocEntry[] = [];

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    
    console.log(entry)

    const fullPath = path.join(dir, entry.name);
    const slug = baseSlug ? `${baseSlug}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
        const children = walkDocs(fullPath, slug);
        
        // Verificar si esta carpeta tiene un archivo index
        const hasIndexFile = children.some(child => 
            child.slug === `${slug}/index` || 
            (child.slug === slug && !child.children) // archivo directo con mismo nombre
        );

        if (children.length > 0) {
            nodes.push({
            slug,
            title: docsConfig[slug]?.title || entry.name,
            children,
            // Podemos agregar una propiedad para identificar fácilmente
            hasIndexFile
            });
        }
        continue;
        }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      const nameWithoutExt = path.basename(entry.name, ".mdx");

      if (!entry.name.split('-')[1]) {
        const fileSlug = baseSlug ? `${baseSlug}/${nameWithoutExt}` : nameWithoutExt;
        
        // Intentar obtener título del config, luego del frontmatter, luego del nombre
        const title = 
            docsConfig[fileSlug]?.title || 
            getTitleFromMDX(fullPath) || 
            nameWithoutExt;

        nodes.push({
            slug: fileSlug,
            title,
        });
      }
    }
  }

  // Ordenar según configuración
  return nodes.sort((a, b) => {
    const orderA = docsConfig[a.slug]?.order ?? 999;
    const orderB = docsConfig[b.slug]?.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });
}

// Generar el contenido del archivo
function generateIndexFile() {
  const docsDir = path.join(process.cwd(), "content", "docs");
  const tree = walkDocs(docsDir);

  const configStr = JSON.stringify(docsConfig, null, 2);
  const treeStr = JSON.stringify(tree, null, 2);

  return `// lib/mdx/docs-index.ts
// ⚠️ Este archivo es generado automáticamente por scripts/generate-docs-index.ts
// No editar manualmente. Para cambiar el orden o títulos, edita docsConfig en el script.

export interface DocEntry {
  slug: string;
  title: string;
  children?: DocEntry[];
  hasIndexFile?: boolean;
}

// Configuración manual para orden y títulos personalizados
export const docsConfig: Record<string, { title?: string; order?: number }> = ${configStr};

// Árbol de documentación generado automáticamente
export const docsIndex: DocEntry[] = ${treeStr};

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
`;
}

// Ejecutar
const outputPath = path.join(process.cwd(), "lib", "mdx", "docs-index.ts");
const content = generateIndexFile();
fs.writeFileSync(outputPath, content, "utf-8");

console.log("✅ docs-index.ts generado exitosamente!");