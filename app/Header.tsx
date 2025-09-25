"use client"
import { Button } from "@/registry/aodesu/ui/button";
import { DropdownButton, DropdownMenuCheckboxItem, DropdownMenuItem } from "@/registry/aodesu/ui/dropdown-menu";
import { useThemeContext } from "@/registry/theme";
import { ChevronDown, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";

const AodesuIcon = (props: any) => {
  return (
    <svg
      viewBox="0 0 315 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M213.79 106.67L157.684 128.835L101.579 106.67C101.579 106.67 105.042 76.8853 122.012 47.7936C138.983 18.7018 157.684 0 157.684 0C157.684 0 177.079 18.7018 193.357 47.7936C209.634 76.8853 213.79 106.67 213.79 106.67Z"
        fill="currentColor"
      ></path>
      <path
        d="M8.06984 92.1238L134.827 141.995C134.827 141.995 109.545 160.351 93.6134 188.75C77.6822 217.149 75.9506 249.358 75.9506 249.358C75.9506 249.358 29.8887 234.812 9.45517 184.248C-10.9783 133.683 8.06984 92.1238 8.06984 92.1238Z"
        fill="currentColor"
      ></path>
      <path
        d="M105.042 302L239.418 249.358C239.418 249.358 284.441 233.427 305.221 185.287C326.001 137.147 307.299 92.1238 307.299 92.1238L173.616 144.42C173.616 144.42 128.695 158.619 107.12 208.837C85.5452 259.055 105.042 302 105.042 302Z"
        fill="currentColor"
      ></path>
      <path
        d="M186.084 292.649L216.561 280.874C216.561 280.874 214.483 289.186 213.79 291.61C213.097 294.034 210.327 302 210.327 302L186.084 292.649Z"
        fill="currentColor"
      ></path>
    </svg>
  )
}

export const Header = () => {
  const { style, availableStyles, setStyle, theme, setTheme, availableThemes } = useThemeContext();
  
  console.log(availableThemes)

  return (
    <header className="flex border-b border-[var(--border)] justify-center">
      <div className="max-w-5xl py-2 px-4 gap-5 flex items-center flex-1">
        <Button size="icon" variant="outlined">
          <Menu />
        </Button>
        <div className="flex gap-2 items-center">
          <svg
            className="h-8 text-[var(--primary)]"
            viewBox="0 0 315 350"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M213.79 106.67L157.684 128.835L101.579 106.67C101.579 106.67 105.042 76.8853 122.012 47.7936C138.983 18.7018 157.684 0 157.684 0C157.684 0 177.079 18.7018 193.357 47.7936C209.634 76.8853 213.79 106.67 213.79 106.67Z"
              fill="currentColor"
            ></path>
            <path
              d="M8.06984 92.1238L134.827 141.995C134.827 141.995 109.545 160.351 93.6134 188.75C77.6822 217.149 75.9506 249.358 75.9506 249.358C75.9506 249.358 29.8887 234.812 9.45517 184.248C-10.9783 133.683 8.06984 92.1238 8.06984 92.1238Z"
              fill="currentColor"
            ></path>
            <path
              d="M105.042 302L239.418 249.358C239.418 249.358 284.441 233.427 305.221 185.287C326.001 137.147 307.299 92.1238 307.299 92.1238L173.616 144.42C173.616 144.42 128.695 158.619 107.12 208.837C85.5452 259.055 105.042 302 105.042 302Z"
              fill="currentColor"
            ></path>
            <path
              d="M186.084 292.649L216.561 280.874C216.561 280.874 214.483 289.186 213.79 291.61C213.097 294.034 210.327 302 210.327 302L186.084 292.649Z"
              fill="currentColor"
            ></path>
          </svg>
          <span className="text-3xl leading-none font-(family-name:--font-branch)">
            ui
          </span>
        </div>
        <div className="flex gap-2 items-center justify-end flex-1">
          <DropdownButton menuGropClassName="" label="Estilos">
            {availableStyles.map((s) => (
              <DropdownMenuItem
                onClick={() => {
                  setStyle(s);
                }}
              >
                <AodesuIcon style={{ opacity: s === style ? 1 : .5}}/>
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownButton>
          <DropdownButton menuGropClassName="" label="Temas">
            {availableThemes.map((t) => (
              <Button
                key={t}
                onClick={() => {
                  setTheme(t);
                }}
                variant="ghost"
                color={t === theme ? 'contrast' : 'neutral'}
                className="w-full justify-start" 
              >
                {t === "dark" && <Moon />}
                {t === "light" && <Sun />}
                {t}
              </Button>
            ))}
          </DropdownButton>
          <Button>
            Componentes
            <ChevronDown />
          </Button>
        </div>
      </div>
    </header>
  );
};
