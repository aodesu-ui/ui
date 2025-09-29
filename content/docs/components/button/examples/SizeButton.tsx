import { Button } from "@/registry/aodesu/ui/button";

export default function BasicButton() {
  return (
    <>
      <Button size="small" variant="contained" color="secondary">Pequeño</Button>
      <Button size="medium" variant="contained" color="primary">Mediano</Button>
      <Button size="big" variant="contained" color="contrast">Grande</Button>
    </>
  );
}
