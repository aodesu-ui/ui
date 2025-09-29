"use client";

import { DocEntry, docsIndex } from "@/lib/mdx/docs-index";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/registry/aodesu/ui/button";
import { ChevronDown } from "lucide-react";

function SidebarItem({ node, currentLang }: { node: DocEntry; currentLang: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  
  // Verificar si es una página activa (considerando el idioma)
  const isActive = pathname === `/docs/${node.slug}`;
  
  // Verificar si este nodo tiene un archivo index (es collapsable + link)
  const hasIndexFile = node.children?.some(child => 
    child.slug === `${node.slug}/index` || child.slug === node.slug
  );

  // Tipo 1: Carpeta con index.mdx (Collapse + Link)
  if (node.children && node.children.length > 0 && hasIndexFile) {
    return (
      <div className="mb-2">
        <Button size="small">
          <div
            role="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Contraer" : "Expandir"}
          >
            <ChevronDown className={open ? 'rotate-0' : '-rotate-90'} />
          </div>
          <Link
            href={`/docs/${node.slug}?lang=${currentLang}`}
            className={`flex-1 font-semibold hover:underline ${
              isActive ? "text-primary font-bold" : ""
            }`}
          >
            {node.title}
          </Link>
        </Button>

        {open && (
          <div className="ml-4 mt-1 space-y-1 border-l pl-2">
            {node.children
              .filter(child => !child.slug.endsWith('/index') && child.slug !== node.slug)
              .map((child) => (
                <SidebarItem key={child.slug} node={child} currentLang={currentLang} />
              ))}
          </div>
        )}
      </div>
    );
  }

  // Tipo 2: Carpeta sin index.mdx (Solo Collapsable)
  if (node.children && node.children.length > 0) {
    return (
      <div className="mb-2">
        <button
          onClick={() => setOpen(!open)}
          className="font-semibold hover:underline text-left w-full flex items-center gap-1"
        >
          <span className="text-xs">{open ? "▼" : "▶"}</span>
          {node.title}
        </button>

        {open && (
          <div className="ml-4 mt-1 space-y-1 border-l pl-2">
            {node.children.map((child) => (
              <SidebarItem key={child.slug} node={child} currentLang={currentLang} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Tipo 3: Enlace simple (archivo en root o hoja del árbol)
  return (
    <Link
      href={`/docs/${node.slug}?lang=${currentLang}`}
      className={`block px-2 py-1 hover:bg-accent rounded transition-colors ${
        isActive ? "bg-accent font-medium text-primary" : ""
      }`}
    >
      {node.title}
    </Link>
  );
}

export default function SidebarClient() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') ?? "es";

  const handleLang = (lang: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("lang", lang);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="w-64 w-full p-4 border-r overflow-y-auto">
      {/* Selector de idioma opcional */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleLang('es')}
          className={`px-3 py-1 text-sm rounded border ${
            currentLang === 'es' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background hover:bg-accent'
          }`}
        >
          ES
        </button>
        <button
          onClick={() => handleLang('en')}
          className={`px-3 py-1 text-sm rounded border ${
            currentLang === 'en' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background hover:bg-accent'
          }`}
        >
          EN
        </button>
      </div>

      <nav className="space-y-1">
        {docsIndex.map((node) => (
          <SidebarItem key={node.slug} node={node} currentLang={currentLang} />
        ))}
      </nav>
    </aside>
  );
}