// components/mdx/Sandbox.tsx
"use client";

import { useState } from "react";

interface SandboxProps {
  code: string;
  children: React.ReactNode;
}

export function Sandbox({ code, children }: SandboxProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="my-6 border rounded-lg overflow-hidden">
      <div className="p-4 bg-[var(--sandbox-bg)]">{children}</div>
      <button
        className="text-sm text-blue-600 font-medium px-3 py-2 border-t w-full text-left hover:bg-gray-100"
        onClick={() => setShowCode(!showCode)}
      >
        {showCode ? "Ocultar código" : "Ver código"}
      </button>
      {showCode && (
        <pre className="bg-black text-white text-sm p-4 overflow-x-auto">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
