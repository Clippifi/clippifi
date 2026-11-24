"use client";

import { useState } from "react";
import { Spinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

// Ask before a consequential action (DESIGN.md → Confirmations): a bottom drawer on
// phones (Vaul) and a centred dialog elsewhere, with the same words and buttons.
export function Confirm({
  trigger,
  title,
  description,
  confirmLabel,
  destructive = false,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => Promise<boolean | void>;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    const keepOpen = (await onConfirm()) === false;
    setBusy(false);
    if (!keepOpen) setOpen(false);
  }

  const actions = (
    <>
      <Button variant={destructive ? "destructive" : "default"} onClick={confirm} disabled={busy} className="w-full sm:w-auto">
        {busy && <Spinner className="animate-spin" />}
        {confirmLabel}
      </Button>
      <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy} className="w-full sm:w-auto">
        Cancel
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-[18px] sm:text-[20px] font-bold tracking-[-0.02em]">{title}</DrawerTitle>
            <DrawerDescription className="text-body leading-[22px]">{description}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>{actions}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-[18px] sm:text-[20px] font-bold tracking-[-0.02em]">{title}</DialogTitle>
          <DialogDescription className="text-body leading-[22px]">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row-reverse sm:justify-start">{actions}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
