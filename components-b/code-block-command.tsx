// code-block-command.tsx
"use client";

import { Button } from "@/registry/aodesu/ui/button";
import { SquareTerminal } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "./copy-button";

export function CodeBlockCommand({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__,
}: {
  __npm__?: string;
  __yarn__?: string;
  __pnpm__?: string;
  __bun__?: string;
}) {
  const [activeTab, setActiveTab] = useState("pnpm");

  const tabs = {
    pnpm: __pnpm__,
    npm: __npm__,
    yarn: __yarn__,
    bun: __bun__,
  };

  const activeCommand = tabs[activeTab as keyof typeof tabs];

  return (
    <div className="my-4 overflow-hidden rounded-lg border">
      {/* Header con pestañas */}
      <div className="flex items-center justify-between bg-[hsl(var(--background-elevated-1))] p-2">
        <div className="flex gap-3 items-center mr-3">
          <SquareTerminal className="opacity-50 scale-80" />
          {Object.entries(tabs).map(([key, value]) => {
            if (!value) return null;
            return (
              <Button
                key={key}
                variant={activeTab === key ? "contained" : "ghost"}
                size="small"
                onClick={() => setActiveTab(key)}
              >
                {key}
              </Button>
            );
          })}
        </div>

        {/* Botón de copiar */}
        {activeCommand && <CopyButton value={activeCommand} />}
      </div>

      {/* Área del código */}
      <div className="relative">
        <pre className="p-4 text-sm bg-[hsl(var(--background-elevated-2))] overflow-x-auto">
          <code className="font-mono text-gray-800 dark:text-gray-200">
            {activeCommand}
          </code>
        </pre>
      </div>
    </div>
  );
}
