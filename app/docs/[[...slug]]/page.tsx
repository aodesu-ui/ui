import { getPrevNext } from "@/lib/mdx/docs-index";
import { getMdxSource } from "@/lib/mdx/get-mdx-resource";
import { Button } from "@/registry/aodesu/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import TOC from "./TOC";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DocPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const lang =
    typeof resolvedSearchParams?.lang === "string"
      ? resolvedSearchParams.lang
      : "es";

  const slugPath = slug ? slug.join("/") : "";

  const { content, toc, frontmatter } = await getMdxSource(slugPath, lang);
  const { prev, next } = getPrevNext(slugPath);

  console.log(frontmatter)

  return (
    <div className="flex">
      <Sidebar />
      <article className="max-w-4xl w-full flex-10/12 px-8">
        <div className="flex items-center justify-between pt-6">
          {typeof frontmatter?.title === "string" ? (
            <h1 className="flex-1 text-4xl font-(family-name:--font-branch) font-extrabold">
              {frontmatter.title}
            </h1>
          ) : null}
          {prev ? (
            <Button asChild>
              <Link href={`/docs/${prev.slug}?lang=${lang}`}>
                <ArrowLeft /> {prev.title}
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {next ? (
            <Button asChild>
              <Link href={`/docs/${next.slug}?lang=${lang}`}>
                {next.title} <ArrowRight />
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>
        {content && <>{content}</>}

        <div className="flex justify-between mt-12 border-t pt-6">
          {prev ? (
            <Link href={`/docs/${prev.slug}?lang=${lang}`}>← {prev.title}</Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/docs/${next.slug}?lang=${lang}`}>{next.title} →</Link>
          ) : (
            <div />
          )}
        </div>
      </article>
      <TOC toc={toc} />
    </div>
  );
}
