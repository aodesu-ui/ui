import { Event } from "@/lib/events";
import { Button } from "@/registry/aodesu/ui/button";
import { Check, Copy } from "lucide-react"; // Importar iconos de Lucide
import React from "react";

export function CopyButton({
  value,
  className,
  variant = "contained",
  event,
  src,
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
  event?: Event["name"];
}) {
  const [hasCopied, setHasCopied] = React.useState(false);

  const copyToClipboard = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setHasCopied(true);

      // Track event if provided
      if (event) {
        // Aquí puedes agregar tu lógica de tracking de eventos
        console.log(`Event tracked: ${event}`, { source: src });
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback para navegadores antiguos
      const textArea = document.createElement("textarea");
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setHasCopied(true);
      } catch (fallbackErr) {
        console.error("Fallback copy failed: ", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  }, [value, event, src]);

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => {
        setHasCopied(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  return (
    <Button
      size="small"
      variant={variant}
      onClick={copyToClipboard}
      icon
      className={className}
      disabled={hasCopied}
      {...props}
    >
      <div className="flex items-center gap-2">
        {hasCopied ? <Check /> : <Copy />}
      </div>

      {/* Tooltip sutil */}
      {!hasCopied && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2
                      bg-gray-900 text-white text-xs py-1 px-2 rounded
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      pointer-events-none whitespace-nowrap"
        >
          Copy to clipboard
        </div>
      )}
    </Button>
  );
}
