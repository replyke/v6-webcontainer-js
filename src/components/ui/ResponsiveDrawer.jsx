import * as React from "react";
import { useMediaQuery } from "../../hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function ResponsiveDrawer({
  children,
  title,
  open,
  onOpenChange,
  trigger,
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="max-w-md">
          {title && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <VisuallyHidden>
                <DialogDescription>{title}</DialogDescription>
              </VisuallyHidden>
            </DialogHeader>
          )}
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          {title && (
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
          )}
          <div className="p-4 pb-8">{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function ResponsiveDrawerTrigger({ children }) {
  return <>{children}</>;
}

export function ResponsiveDrawerContent({ children }) {
  return <>{children}</>;
}
