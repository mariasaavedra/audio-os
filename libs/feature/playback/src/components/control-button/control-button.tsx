'use client';

import { cn } from '@m7/audio-os/shared/utils';
import { Button } from '@m7/audio-os/ui/primitives';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';

interface ControlButtonProps {
  icon: IconSvgElement;
  alt: string;
  onClick: () => void;
  size?: 'sm' | 'lg';
  tone?: 'default' | 'muted' | 'primary';
}

const TONE: Record<NonNullable<ControlButtonProps['tone']>, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary hover:text-primary',
};

export function ControlButton({ icon, alt, onClick, size = 'sm', tone = 'default' }: ControlButtonProps) {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      aria-label={alt}
      className={cn(size === 'lg' ? 'size-12' : 'size-10', TONE[tone])}
    >
      <HugeiconsIcon icon={icon} size={size === 'lg' ? 28 : 22} strokeWidth={2} />
    </Button>
  );
}
