import { Button } from "@/registry/aodesu/ui/button";

export default function GhostButton() {
  return (
    <>
      <Button variant="outlined">Neutral</Button>
      <Button variant="outlined" color="primary">Primario</Button>
      <Button variant="outlined" color="secondary">Secundario</Button>
      <Button variant="outlined" color="contrast">Contraste</Button>
    </>
  );
}
