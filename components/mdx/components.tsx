import { Demo } from "../Demo";

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
  code: (props: any) => (
    <code
      className="text-[.875rem] border font-mono whitespace-nowrap rounded-sm px-1"
      {...props}
    />
  ),
  Demo: (props: any) => <Demo {...props} />,
};
