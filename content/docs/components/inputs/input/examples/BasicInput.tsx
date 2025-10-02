import { Input } from "@/registry/aodesu/ui/input";

export default function BasicInput() {
  return (
    <>
      <Input
        variant="outlined"
        color="secondary"
        placeholder="Input Outlined"
      />
      <Input
        variant="filled"
        color="secondary"
        placeholder="Filled secondary"
      />
      <Input
        variant="standard"
        color="neutral"
        placeholder="Standard secondary"
      />
    </>
  );
}
