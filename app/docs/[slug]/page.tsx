// app/docs/[slug]/page.tsx
import { getMdxSource } from "@/components/mdx/get-mdx-resource";
import TOC from "./TOC";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DocPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const lang =
    typeof resolvedSearchParams?.lang === "string"
      ? resolvedSearchParams.lang
      : undefined;

  const { content, toc } = await getMdxSource(resolvedParams.slug, lang);

  console.log(toc);

  return (
    <div className="flex">
      <div className="flex-1"></div>
      <article className="max-w-4xl w-full flex-10/12 px-8">{content}</article>
      <TOC toc={toc} />
    </div>
  );
}
