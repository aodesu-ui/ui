import { Button } from "@/registry/aodesu/ui/button";
import { Sandbox } from "./Sandbox";

export const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-4xl font-extrabold text-blue-600 mt-6 mb-4"
      {...props} />
  ),
  ul: (props: any) => (
    <ul className="ml-4 list-disc" {...props} />
  ),
  ol: (props: any) => (
    <ol className="ml-4 list-decimal" {...props} />
  ),
  li: (props: any) => (
    <li className="mt-1" {...props} />
  ),
  // wrapper para Button con código
  ButtonDemo: () => (
    <Sandbox code={`<Button>Click aquí</Button>`}>
      <Button>Click aquí</Button>
    </Sandbox>
  ),
};
