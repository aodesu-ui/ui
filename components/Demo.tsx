// components/Demo.tsx
import fs from "fs/promises";
import path from "path";
import { Sandbox } from "./mdx/Sandbox";

interface DemoProps {
  name: string; // e.g., folder name like 'buttons'
  component: string; // e.g., file name like 'Primary'
}

export async function Demo({ name, component }: DemoProps) {
  const mod = await import(`@/content/docs/${name}/examples/${component}.tsx`);
  const Component = mod.default;

  // Assuming '@' aliases to the 'src' directory (common in Next.js tsconfig.json).
  // Adjust the base path if your alias is different (e.g., process.cwd() + '/content/docs/...').
  const filePath = path.join(
    process.cwd(),
    "content/docs",
    name,
    "examples",
    `${component}.tsx`
  );
  const code = await fs.readFile(filePath, "utf-8");

  return (
    <Sandbox code={code}>
      <Component />
    </Sandbox>
  );
}
