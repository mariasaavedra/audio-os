'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/browse', label: 'Browse', icon: '/icons/svg/music.svg' },
  { href: '/tracks', label: 'Tracks', icon: '/icons/svg/music.svg' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-40 shrink-0 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border py-5 px-3 gap-0.5">


      {NAV.map(({ href, label, icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-lg transition-colors ${
              isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            <Image
              src={icon}
              alt=""
              width={14}
              height={14}
              className={isActive ? '' : 'invert opacity-50'}
            />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
