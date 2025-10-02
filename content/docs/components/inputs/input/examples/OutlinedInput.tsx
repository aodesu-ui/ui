import { Input } from "@/registry/aodesu/ui/input";

export default function BasicInput() {
  return (
    <div className="flex flex-col gap-5">
      <Input
        variant="outlined"
        placeholder="Outlined Neutral"
      />
      <Input
        variant="outlined"
        color="primary"
        placeholder="Outlined Primary"
      />
      <Input
        variant="outlined"
        color="secondary"
        placeholder="Outlined Secondary"
      />
      <Input
        variant="outlined"
        color="contrast"
        placeholder="Outlined Contrast"
      />
    </div>
  );
}
