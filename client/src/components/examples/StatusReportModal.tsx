import { StatusReportModal } from "../StatusReportModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function StatusReportModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Report Modal</Button>
      <StatusReportModal
        open={open}
        onOpenChange={setOpen}
        campgroundName="Pine Lake Campground"
        onSubmit={(status) => console.log("Status reported:", status)}
      />
    </div>
  );
}
