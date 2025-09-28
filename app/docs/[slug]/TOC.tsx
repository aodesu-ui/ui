import { Button } from "@/registry/aodesu/ui/button";

interface tocProps {
  depth: number;
  value: string;
  id: string;
}

export default function TOC({ toc }: { toc: tocProps[] }) {

  const ThreadSeparator = ({ depth }: { depth: number}) => {
    return Array.from({ length: depth }).map((i) => {
      return (
        <div
          className="h-7 ml-2 mr-3"
          style={{
            borderLeft:
              depth > 0 ? "1px solid hsl(var(--border))" : "",
          }}
        ></div>
      );
    })
  }

  return (
    <aside className="flex-1 pl-4 pt-4 border-l">
      <nav className="w-64">
        <ul>
          {toc.map((item) => (
            <li
              key={item.id}
              className="flex items-center"
            >
              {item.depth - 1 > 0 && <ThreadSeparator depth={item.depth - 1} />}
              <Button
                asChild
                size="small"
                className="flex-1 w-full justify-start -ml-2"
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
