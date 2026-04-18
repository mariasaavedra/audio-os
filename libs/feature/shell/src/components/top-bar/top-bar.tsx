'use client';

import { Button, SearchField, Label } from '@m7/audio-os/ui/primitives';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (pathname === '/search') {
      setQuery(searchParams.get('q') ?? '');
    } else {
      setQuery('');
    }
  }, [pathname, searchParams]);

  function handleSubmit(val: string) {
    const q = val.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="flex items-center gap-3 px-4 py-2.5 border-b border-charcoal/8 bg-light shrink-0">
      {/* Back / Forward */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          isIconOnly
          variant="ghost"
          onPress={() => router.back()}
          aria-label="Back"
          className="w-7 h-7 rounded-full bg-charcoal/8 hover:bg-charcoal/15"
        >
          <Image src="/icons/svg/arrow-left.svg" alt="" width={13} height={13} className="opacity-50" />
        </Button>
        <Button
          isIconOnly
          variant="ghost"
          onPress={() => router.forward()}
          aria-label="Forward"
          className="w-7 h-7 rounded-full bg-charcoal/8 hover:bg-charcoal/15"
        >
          <Image src="/icons/svg/arrow-left.svg" alt="" width={13} height={13} className="opacity-50 scale-x-[-1]" />
        </Button>
      </div>

      {/* Search */}
      <SearchField
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
        onClear={() => setQuery('')}
        className="flex-1"
      >
        <Label className="sr-only">Search for tracks, artists, albums</Label>
      </SearchField>

      {/* Avatar */}
      <Button
        isIconOnly
        variant="ghost"
        aria-label="Profile"
        className="w-8 h-8 rounded-full bg-charcoal/10 hover:bg-charcoal/18 shrink-0"
      >
        <Image src="/icons/svg/user.svg" alt="" width={15} height={15} className="opacity-55" />
      </Button>
    </header>
  );
}
