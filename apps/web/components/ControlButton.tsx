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
  const circle =
    size === 'lg'
      ? 'w-16 h-16'
      : 'w-12 h-12';

  const bg = variant === 'white' ? 'bg-light' : 'bg-charcoal';

  return (
    <button
      onClick={onClick}
      className={`${circle} ${bg} rounded-full flex items-center justify-center shrink-0`}
    >
      <Image src={icon} alt={alt} width={size === 'lg' ? 28 : 22} height={size === 'lg' ? 28 : 22} />
    </button>
  );
}
