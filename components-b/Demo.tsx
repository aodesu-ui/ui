// components/Demo.tsx
import fs from "fs/promises";
import path from "path";
import { Sandbox } from "./mdx/Sandbox";

interface DemoProps {
  folder: string; // e.g. folder path. "/components/button" = "@/content/docs/components/button"
  file: string; // e.g., file name like 'BasicButton' = {folder}/examples/BasicButton
}

export async function Demo({ folder, file }: DemoProps) {
  const mod = await import(`@/content/docs/${folder}/examples/${file}.tsx`);
  const Component = mod.default;

  // Assuming '@' aliases to the 'src' directory (common in Next.js tsconfig.json).
  // Adjust the base path if your alias is different (e.g., process.cwd() + '/content/docs/...').
  const filePath = path.join(
    process.cwd(),
    "content/docs",
    folder,
    "examples",
    `${file}.tsx`
  );
  const code = await fs.readFile(filePath, "utf-8");

  return (
    <Sandbox code={code}>
      <Component />
    </Sandbox>
  );
}
