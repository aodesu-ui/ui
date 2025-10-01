import { Button } from "@/registry/aodesu/ui/button";

export default function GhostButton() {
  return (
    <p>
      ¿Qué te parece este <Button variant="text">botón</Button>?
      ¡Apenas se nota! Imagina poder usar <Button variant="text" color="primary">Otro color</Button>...
      ¿Así de <Button variant="text" color="secondary">sencillo</Button>?
      Solo <Button variant="text" color="contrast">usalos</Button>.
    </p>
  )
}
