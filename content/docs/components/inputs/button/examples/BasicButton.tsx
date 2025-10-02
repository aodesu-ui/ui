import { Button } from "@/registry/aodesu/ui/button";

export default function BasicButton() {
  return (
    <>
      <Button variant="ghost">Ghost</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </>
  );
}
