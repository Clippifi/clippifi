import * as React from 'react';

import {
  Progress as ProgressPrimitive,
  ProgressIndicator as ProgressIndicatorPrimitive,
  type ProgressProps as ProgressPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/progress';
import { cn } from '@/lib/utils';

type ProgressProps = ProgressPrimitiveProps;

// Animate UI progress, styled with depth: a recessed track and a rounded, lit brand fill
// that springs up from empty on load.
function Progress({ className, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive
      className={cn(
        'relative h-2.5 w-full overflow-hidden rounded-full bg-muted shadow-[inset_0_1px_2px_rgb(0_0_0/0.16)]',
        className,
      )}
      {...props}
    >
      <ProgressIndicatorPrimitive
        initial={{ x: '-100%' }}
        className="h-full w-full flex-1 rounded-full bg-[linear-gradient(180deg,var(--color-brand-300)_0%,var(--color-brand-400)_45%,var(--color-brand-500)_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.8),inset_0_-1px_0_rgb(146_104_0/0.3)]"
      />
    </ProgressPrimitive>
  );
}

export { Progress, type ProgressProps };
