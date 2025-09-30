import { Event } from "@/lib/events";
import { Button } from "@/registry/aodesu/ui/button";
import React from "react";

export function CopyButton({
  value,
  className,
  variant = "ghost",
  event,
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string
  src?: string
  event?: Event["name"]
}) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000);
  }, []);

  return (
    <div>
      <Button>
        Hola
      </Button>
    </div>
  )
}
