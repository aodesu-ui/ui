interface DemoProps {
  folder: string; // e.g. folder path. "/components/button" = "@/content/docs/components/button"
  file: string; // e.g., file name like 'BasicButton' = {folder}/examples/BasicButton
}

export async function UiComponent({ folder, file }: DemoProps) {
  const mod = await import(`@/content/docs/${folder}/${file}.tsx`);
  const Component = mod.default;

  return <Component />;
}
