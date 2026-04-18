'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Home', icon: '/icons/svg/music.svg' },
  { href: '/playlists', label: 'Playlists', icon: '/icons/svg/music.svg' },
  { href: '/tracks', label: 'Tracks', icon: '/icons/svg/music.svg' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-40 shrink-0 flex flex-col bg-light border-r border-charcoal/10 py-5 px-3 gap-0.5">


      {NAV.map(({ href, label, icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-lg transition-colors ${
              isActive ? 'bg-dark text-light font-medium' : 'text-charcoal hover:bg-charcoal/8'
            }`}
          >
            <Image
              src={icon}
              alt=""
              width={14}
              height={14}
              className={isActive ? 'invert' : 'opacity-50'}
            />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
