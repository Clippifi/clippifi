"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

// One component for "show this in a panel": a bottom drawer (Vaul) on phones and a
// centred dialog elsewhere, with the same title, description and body (DESIGN.md → Dialogs).
export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-[20px] font-bold tracking-[-0.02em]">{title}</DrawerTitle>
            {description && <DrawerDescription className="text-[15px] leading-[22px]">{description}</DrawerDescription>}
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4">{children}</div>
          {footer && <div className="flex flex-col gap-2 p-4">{footer}</div>}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold tracking-[-0.02em]">{title}</DialogTitle>
          {description && <DialogDescription className="text-[15px] leading-[22px]">{description}</DialogDescription>}
        </DialogHeader>
        {children && <div className="flex flex-col gap-4">{children}</div>}
        {footer && <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
