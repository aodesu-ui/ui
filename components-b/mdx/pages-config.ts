export interface aodesuPage {
  pathname: string;
  title?: string;
  children?: aodesuPage[];
  subheader?: string;
  newFeature?: boolean;
  deprecated?: boolean;
}

export const pages: aodesuPage[] = [
  {
    pathname: '/docs/getting-started-group',
    title: 'Getting started',
    children: [
      { pathname: '/docs/getting-started/installation', title: 'Installation' },
    ],
  },
  {
    pathname: "/docs/components-group",
    title: "Components",
    children: [
      {
        pathname: "/docs/components/inputs-group",
        title: "Inputs",
        children: [
          {
            pathname: "/docs/components/inputs/button",
            title: "Button"
          }
        ]
      }
    ]
  }
]

export function flattenPages(pages: aodesuPage[]): aodesuPage[] {
  const result: aodesuPage[] = [];

  function traverse(page: aodesuPage) {
    // Si es un grupo, solo procesar sus hijos sin agregarlo al resultado
    if (page.pathname.includes('-group')) {
      if (page.children) {
        page.children.forEach(traverse);
      }
    } else {
      // No es un grupo, agregarlo al resultado
      result.push(page);

      // Procesar hijos si existen
      if (page.children) {
        page.children.forEach(traverse);
      }
    }
  }

  pages.forEach(traverse);
  return result;
}

export function getPrevNext(currentPathname: string) {
  const flatPages = flattenPages(pages);
  const currentIndex = flatPages.findIndex(page => page.pathname === currentPathname);

  return {
    prev: currentIndex > 0 ? flatPages[currentIndex - 1] : null,
    next: currentIndex < flatPages.length - 1 && currentIndex >= 0 ? flatPages[currentIndex + 1] : null,
  };
}

export function getAllDocPaths(): { slug: string[] }[] {
  const flatPages = flattenPages(pages);
  return flatPages
    .filter(page => page.pathname.startsWith('/docs/'))
    .map(page => ({
      slug: page.pathname.replace('/docs/', '').split('/').filter(Boolean)
    }));
}
