"use client";
import { Theme, useThemeContext } from "@/registry/aodesu/ui/theme";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { setTheme } = useThemeContext();
  const params = useParams<{ theme: Theme }>();

  useEffect(() => {
    setTheme(`${params.theme}-dark`);
  }, [params.theme])
  return (
    <div>page {params.theme}</div>
  )
}
