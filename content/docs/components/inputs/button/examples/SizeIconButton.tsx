import { Button } from "@/registry/aodesu/ui/button";
import { Home, Menu, Trash } from "lucide-react";

export default function BasicButton() {
  return (
    <>
      <Button icon size="small" variant="contained" color="secondary"><Home /></Button>
      <Button icon size="medium" variant="contained" color="primary"><Menu /></Button>
      <Button icon size="big" variant="contained" color="contrast"><Trash /></Button>
    </>
  );
}
