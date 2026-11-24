"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Slider as SliderPrimitive } from "radix-ui"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-2 data-horizontal:w-full data-vertical:h-full data-vertical:w-2"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-brand-500 select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          // The handle is what screen readers announce (role="slider"), so it carries the label.
          aria-label={ariaLabel}
          className="relative block size-6 shrink-0 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.2),0_4px_12px_rgb(0_0_0/0.12)] transition-[box-shadow,transform] duration-150 select-none after:absolute after:-inset-3 [@media(hover:hover)]:hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
