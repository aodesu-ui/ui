import { Button } from "@/registry/aodesu/ui/button";

export default function ContainedButton() {
  return (
    <>
      <Button variant="contained">Neutral</Button>
      <Button variant="contained" color="primary">Primario</Button>
      <Button variant="contained" color="secondary">Secundario</Button>
      <Button variant="contained" color="contrast">Contraste</Button>
    </>
  )
}
