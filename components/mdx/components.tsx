import { Button } from "@/registry/aodesu/ui/button";
import { Sandbox } from "./Sandbox";

export const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-4xl font-extrabold text-blue-600 mt-6 mb-4"
      {...props}
    />
  ),

  // wrapper para Button con código
  ButtonDemo: () => (
    <Sandbox code={`<Button>Click aquí</Button>`}>
      <Button>Click aquí</Button>
    </Sandbox>
  ),
};
