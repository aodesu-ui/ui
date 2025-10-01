// components/docs/SidebarClient.tsx
"use client";

import { pages, type aodesuPage } from "@/components-b/mdx/pages-config";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/aodesu/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function SidebarItem({ page, currentLang, level = 0 }: {
  page: aodesuPage;
  currentLang: string;
  level?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(level < 1); // Expandir primeros niveles por defecto

  const isActive = pathname === page.pathname;
  const hasChildren = page.children && page.children.length > 0;

  // Es un subheader (solo título, no clickeable)
  if (page.subheader) {
    return (
      <div className={cn(
        "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
        level === 0 ? "mt-6 mb-2" : "mt-4 mb-2",
        level > 0 && "ml-4"
      )}>
        {page.subheader}
      </div>
    );
  }

  // Es un grupo con hijos
  if (hasChildren) {
    return (
      <div className="mb-1">
        <Button
          onClick={() => setOpen(!open)}
          size="small"
          variant={isActive ? 'contained' : 'ghost'}
          className={cn(
            "w-full justify-start text-left",
          )}
        >
          {hasChildren && (
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform",
              !open && "-rotate-90"
            )} />
          )}
          <span className="flex-1 text-sm font-medium">
            {page.title}
            {page.newFeature && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                New
              </span>
            )}
            {page.deprecated && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                Deprecated
              </span>
            )}
          </span>
        </Button>

        {open && hasChildren && (
          <div className="ml-4 mt-1 space-y-1 border-l pl-2">
            {page.children && page.children.map((child) => (
              <SidebarItem
                key={child.pathname}
                page={child}
                currentLang={currentLang}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Es un grupo especial (como getting-started-group) - mostrar hijos directamente
  if (hasChildren && page.pathname.includes('-group')) {
    return (
      <>
        {page.children?.map((child) => (
          <SidebarItem
            key={child.pathname}
            page={child}
            currentLang={currentLang}
            level={level}
          />
        ))}
      </>
    );
  }

  // Es un elemento hoja (página individual)
  return (
    <Button className="w-full" size="small" asChild>
      <Link
        href={`${page.pathname}?lang=${currentLang}`}
      >
        <span className="flex-1">
          {page.title}
          {page.newFeature && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
              New
            </span>
          )}
          {page.deprecated && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
              Deprecated
            </span>
          )}
        </span>
      </Link>
    </Button>
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
    <aside className="flex flex-1 h-full p-2 border-r justify-end">
      {/* Selector de idioma */}
      <div className="w-64 overflow-y-auto">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => handleLang("es")}
            className={`px-3 py-1 text-sm rounded border ${
              currentLang === "es"
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-accent"
            }`}
          >
            ES
          </button>
          <button
            onClick={() => handleLang("en")}
            className={`px-3 py-1 text-sm rounded border ${
              currentLang === "en"
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-accent"
            }`}
          >
            EN
          </button>
        </div>

        <nav className="space-y-1 w-64">
          {pages.map((page) => (
            <SidebarItem
              key={page.pathname}
              page={page}
              currentLang={currentLang}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}
