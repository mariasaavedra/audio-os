import Image from 'next/image';

interface AlbumCardProps {
  name: string;
  artist?: string;
  year?: string;
  artworkUrl?: string;
  onClick: () => void;
}

function hueFromString(s: string): number {
  return s.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
}

export function AlbumCard({ name, artist, year, artworkUrl, onClick }: AlbumCardProps) {
  const subtitle = [artist, year].filter(Boolean).join(' • ');
  const hue = hueFromString(name);

  return (
    <button onClick={onClick} className="flex flex-col gap-2 text-left group w-full">
      <div className="aspect-square w-full rounded-xl overflow-hidden shadow-sm">
        {artworkUrl ? (
          <Image
            src={artworkUrl}
            alt={name}
            width={200}
            height={200}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, hsl(${hue} 40% 72%), hsl(${(hue + 45) % 360} 50% 58%))`,
            }}
          >
            <Image src="/icons/svg/music.svg" alt="" width={28} height={28} className="opacity-25 invert" />
          </div>
        )}
      </div>
      <div className="min-w-0 px-0.5">
        <p className="text-sm font-medium text-dark truncate">{name}</p>
        {subtitle && <p className="text-xs text-charcoal/55 truncate">{subtitle}</p>}
      </div>
    </button>
  );
}
