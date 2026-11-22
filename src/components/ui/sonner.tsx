"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircle, ErrorCircle, Info, Spinner, Warning } from "@/components/icons"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CheckCircle className="size-[18px]" />
        ),
        info: (
          <Info className="size-[18px]" />
        ),
        warning: (
          <Warning className="size-[18px]" />
        ),
        error: (
          <ErrorCircle className="size-[18px]" />
        ),
        loading: (
          <Spinner className="size-4 animate-spin" />
        ),
      }}
      // Toasts are boxes (DESIGN.md → Shape and Surfaces): card radius, soft shadow, no
      // border, our font. On phones they sit above the floating tab bar, never on it.
      position="bottom-right"
      mobileOffset={{ bottom: "calc(88px + env(safe-area-inset-bottom))" }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "transparent",
          "--border-radius": "var(--radius-card)",
          fontFamily: "inherit",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast gap-3! px-4! py-3.5! text-[14px]! shadow-[0_8px_30px_rgb(0_0_0/0.12),0_1px_3px_rgb(0_0_0/0.08)]!",
          title: "font-semibold!",
          description: "text-muted-foreground! text-[13px]!",
          success: "[&_[data-icon]]:text-success",
          error: "[&_[data-icon]]:text-destructive",
          warning: "[&_[data-icon]]:text-warning",
          info: "[&_[data-icon]]:text-info",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
