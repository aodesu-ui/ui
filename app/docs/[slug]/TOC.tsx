import { Button } from "@/registry/aodesu/ui/button";

interface tocProps {
  depth: number;
  value: string;
  id: string;
}

export default function TOC({ toc }: { toc: tocProps[] }) {
  return (
    <aside className="flex-1 pl-4 pt-4 border-l">
      <nav className="w-64">
        <ul>
          {toc.map((item) => (
            <li
              key={item.id}
              className="flex items-center"
              style={{
                borderLeft: item.depth - 1 > 0 ? "1px solid var(--border)" : "",
                marginLeft: item.depth - 1 > 0 ? `${(item.depth - 2) * 16}px` : -8,
                paddingLeft: item.depth - 1 > 0 ? 8 : 0,
              }}
            >
              <Button
                variant="text"
                asChild
                className="flex-1 w-full justify-start"
              >
                <a href={`#${item.id}`}>{item.value}</a>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
