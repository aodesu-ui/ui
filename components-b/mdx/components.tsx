import { cn } from "@/lib/utils";
import { Button } from "@/registry/aodesu/ui/button";
import Link from "next/link";
import { UiComponent } from "../Component";
import { Demo } from "../Demo";
import { CodeBlockCommand } from "../code-block-command";
import { CopyButton } from "../copy-button";

const heading = "mt-10 mb-4 font-bold font-ubuntu";

// Función para generar ID a partir del texto
const generateId = (children: React.ReactNode): string => {
  if (typeof children === "string") {
    return children
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "-") // Reemplazar caracteres especiales con guión
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") // Reemplazar múltiples guiones con uno solo
      .replace(/^-|-$/g, ""); // Remover guiones al inicio y final
  }

  if (Array.isArray(children)) {
    return children
      .filter((child) => typeof child === "string")
      .join(" ")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "-")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  return "";
};

export const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.id || generateId(props.children);
    return (
      <h1
        id={id}
        className="text-4xl font-(family-name:--font-branch) font-extrabold mt-6 mb-4"
        {...props}
      />
    );
  },
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.id || generateId(props.children);
    return <h2 id={id} className={`text-2xl ${heading}`} {...props} />;
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.id || generateId(props.children);
    return <h3 id={id} className={`text-xl ${heading}`} {...props} />;
  },
  ul: (props: any) => <ul className="ml-8 list-disc" {...props} />,
  ol: (props: any) => <ol className="ml-8 list-decimal" {...props} />,
  li: (props: any) => <li className="mt-1" {...props} />,
  p: (props: any) => <p className="my-4 font-sans" {...props} />,
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => {
    return (
      <pre
        className={cn(
          "no-scrollbar min-w-0 overflow-x-auto outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    )
  },
  figure: ({ className, ...props }: React.ComponentProps<"figure">) => {
    return <figure className={cn(className)} {...props} />
  },
  code: ({
    className,
    __raw__,
    __src__,
    __npm__,
    __yarn__,
    __pnpm__,
    __bun__,
    ...props
  }: React.ComponentProps<"code"> & {
    __raw__?: string
    __src__?: string
    __npm__?: string
    __yarn__?: string
    __pnpm__?: string
    __bun__?: string
  }) => {
    const command = String(props.children).trim();
    if (command.match(/^(npm|yarn|pnpm|bun)\s+/)) {
      const packageManager = command.split(" ")[0];
      const commands = {
        npm: command,
        yarn: command.replace(/^npm/, "yarn"),
        pnpm: command.replace(/^npm/, "pnpm"),
        bun: command.replace(/^npm/, "bun"),
      };

      return (
        <CodeBlockCommand
          __npm__={commands.npm}
          __yarn__={commands.yarn}
          __pnpm__={commands.pnpm}
          __bun__={commands.bun}
        />
      );
    }

    // Inline Code.
    if (typeof props.children === "string") {
      return (
        <code
          className={cn(
            "bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words outline-none",
            className
          )}
          {...props}
        />
      );
    }

    console.log(__npm__)

    // npm command.
    const isNpmCommand = __npm__ && __yarn__ && __pnpm__ && __bun__;
    if (isNpmCommand) {
      return (
        <CodeBlockCommand
          __npm__={__npm__}
          __yarn__={__yarn__}
          __pnpm__={__pnpm__}
          __bun__={__bun__}
        />
      );
    }

    // Default codeblock.
    return (
      <>
        {__raw__ && <CopyButton value={__raw__} src={__src__} />}
        <code {...props} />
      </>
    );
  },
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "font-heading mt-8 scroll-m-32 text-xl font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step steps mb-12 [counter-reset:step] *:[h3]:first:!mt-0"
      {...props}
    />
  ),
  Demo: (props: any) => <Demo {...props} />,
  UiComponent: (props: any) => <UiComponent {...props} />,
  Button: (props: any) => <Button {...props} />,
  Link: (props: any) => <Link {...props} />,
};
