'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="flex items-center gap-3 px-4 py-2.5 border-b border-charcoal/8 bg-light shrink-0">
      {/* Back / Forward */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => router.back()}
          className="w-7 h-7 rounded-full bg-charcoal/8 flex items-center justify-center hover:bg-charcoal/15 transition-colors"
          aria-label="Back"
        >
          <Image src="/icons/svg/arrow-left.svg" alt="" width={13} height={13} className="opacity-50" />
        </button>
        <button
          onClick={() => router.forward()}
          className="w-7 h-7 rounded-full bg-charcoal/8 flex items-center justify-center hover:bg-charcoal/15 transition-colors"
          aria-label="Forward"
        >
          <Image
            src="/icons/svg/arrow-left.svg"
            alt=""
            width={13}
            height={13}
            className="opacity-50 scale-x-[-1]"
          />
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative">
          <Image
            src="/icons/svg/search.svg"
            alt=""
            width={13}
            height={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-35 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tracks, artists, albums..."
            className="w-full pl-8 pr-4 py-1.5 text-sm bg-charcoal/8 rounded-xl outline-none focus:ring-2 focus:ring-brand/30 placeholder:text-charcoal/35"
          />
        </div>
      </form>

      {/* Avatar */}
      <button
        className="w-8 h-8 rounded-full bg-charcoal/10 flex items-center justify-center shrink-0 hover:bg-charcoal/18 transition-colors"
        aria-label="Profile"
      >
        <Image src="/icons/svg/user.svg" alt="" width={15} height={15} className="opacity-55" />
      </button>
    </header>
  );
}
