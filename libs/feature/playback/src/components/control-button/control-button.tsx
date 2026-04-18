'use client';

import { Button } from '@m7/audio-os/ui/primitives';
import Image from 'next/image';

interface ControlButtonProps {
  icon: string;
  alt: string;
  onClick: () => void;
  size?: 'sm' | 'lg';
  variant?: 'dark' | 'white';
}

export function ControlButton({
  icon,
  alt,
  onClick,
  size = 'sm',
  variant = 'dark',
}: ControlButtonProps) {
  const dimension = size === 'lg' ? 'w-14 h-14' : 'w-12 h-12';
  const bg = variant === 'white' ? 'bg-light' : 'bg-charcoal';

  return (
    <Button
      isIconOnly
      onPress={onClick}
      aria-label={alt}
      className={`${dimension} ${bg} rounded-full shadow-md`}
    >
      <Image
        src={icon}
        alt={alt}
        width={size === 'lg' ? 28 : 22}
        height={size === 'lg' ? 28 : 22}
        className={variant === 'dark' ? 'invert' : ''}
      />
    </Button>
  );
}
