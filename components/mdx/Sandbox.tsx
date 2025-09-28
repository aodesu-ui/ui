// components/mdx/Sandbox.tsx
"use client";

import { useThemeContext } from "@/registry/theme";
import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";

interface SandboxProps {
  code: string;
  children: React.ReactNode;
}

export function Sandbox({ code, children }: SandboxProps) {
  const { theme } = useThemeContext();
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="my-6 border rounded-lg overflow-hidden">
      <div className="p-4 bg-[hsl(var(--sandbox-bg))] items-center flex justify-center gap-3 flex-wrap">
        {children}
      </div>
      <button
        className="text-sm text-blue-600 font-medium px-3 py-2 border-t w-full text-left hover:bg-gray-100"
        onClick={() => setShowCode(!showCode)}
      >
        {showCode ? "Ocultar código" : "Ver código"}
      </button>

      {showCode && (
        <Highlight theme={theme === "dark" ? themes.vsDark : themes.oneLight} code={code} language="tsx">
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={style}
              className="p-2 text-sm overflow-x-auto bg-[#2a2734]"
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="w-10 text-right pr-4 select-none opacity-50">
                    {i + 1}
                  </span>
                  <span className="pr-4">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      )}
    </div>
  );
}
