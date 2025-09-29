import { getPrevNext } from "@/lib/mdx/docs-index";
import { getMdxSource } from "@/lib/mdx/get-mdx-resource";
import { Button } from "@/registry/aodesu/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import TOC from "./TOC";
import { Metadata, ResolvingMetadata } from "next";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type Props = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const slughPath = slug ? slug.join("/") : "";

  const { frontmatter } = await getMdxSource(slughPath);

  return{
    title: typeof frontmatter?.title === "string" ? `${frontmatter?.title} - aodesu ui` : "aodesu ui",
    description: typeof frontmatter?.description === "string" ? frontmatter?.description : "Bienvenido a aodesu ui"
  }
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

  const Pagination = ({ title = false }: { title?: boolean}) => {
    return(
      <div className="flex flex-wrap pt-6 gap-2 gap-y-8">
        {title && typeof frontmatter?.title === "string" ? (
          <h1 className="flex-1 shrink-0 text-4xl font-(family-name:--font-branch) font-extrabold">
            {frontmatter.title}
          </h1>
        ) : null}
        <div className="flex flex-1 ml-auto gap-2 shrink justify-between md:justify-end">
          {prev ? (
            <Button asChild variant="outlined">
              <Link href={`/docs/${prev.slug}?lang=${lang}`}>
                <ArrowLeft /> {prev.title}
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {next ? (
            <Button asChild variant="outlined">
              <Link href={`/docs/${next.slug}?lang=${lang}`}>
                {next.title} <ArrowRight />
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <article className="max-w-4xl w-full flex-10/12 px-8">
        <Pagination title />
        {content && <>{content}</>}

        <Pagination />
      </article>
      <TOC toc={toc} />
    </div>
  );
}
