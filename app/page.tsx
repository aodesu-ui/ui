import { Button } from "@/registry/aodesu/ui/button";
import { ThemeProvider } from "@/registry/aodesu/ui/theme";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      hola
      <Button>Que onda negro</Button>
      <ThemeProvider defaultTheme="aodesu-dark">
        <Button>Que onda blanco</Button>
      </ThemeProvider>
    </div>
  );
}
