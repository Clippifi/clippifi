import * as React from 'react';

import {
  RadioGroup as RadioGroupPrimitive,
  RadioGroupItem as RadioGroupItemPrimitive,
  RadioGroupIndicator as RadioGroupIndicatorPrimitive,
  type RadioGroupProps as RadioGroupPrimitiveProps,
  type RadioGroupItemProps as RadioGroupItemPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/radio-group';
import { cn } from '@/lib/utils';

type RadioGroupProps = RadioGroupPrimitiveProps;

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive className={cn('grid gap-3', className)} {...props} />
  );
}

type RadioGroupItemProps = RadioGroupItemPrimitiveProps;

function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupItemPrimitive
      className={cn(
        'relative aspect-square size-[22px] shrink-0 rounded-full border-[1.5px] border-hairline bg-card transition-[background-color,border-color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-45 data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand',
        className,
      )}
      {...props}
    >
      <RadioGroupIndicatorPrimitive className="absolute inset-0 flex items-center justify-center">
        <span className="size-2 rounded-full bg-brand-foreground" />
      </RadioGroupIndicatorPrimitive>
    </RadioGroupItemPrimitive>
  );
}

export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
};
