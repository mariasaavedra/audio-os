'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Home', icon: '/icons/svg/music.svg' },
  { href: '/library', label: 'Library', icon: '/icons/svg/music.svg' },
  { href: '/recent', label: 'Recent', icon: '/icons/svg/bell.svg' },
  { href: '/settings', label: 'Settings', icon: '/icons/svg/more-vertical.svg' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-40 shrink-0 flex flex-col bg-light border-r border-charcoal/10 py-5 px-3 gap-0.5">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 pb-5 mb-1">
        <div className="w-7 h-7 bg-dark rounded-md flex items-center justify-center shrink-0">
          <Image src="/icons/svg/music.svg" alt="" width={13} height={13} className="invert" />
        </div>
        <span className="text-sm font-semibold text-dark tracking-tight">Monochrome</span>
      </div>

      {NAV.map(({ href, label, icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors ${
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
