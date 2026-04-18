'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlbumCard } from '@m7/audio-os/feature/library';
import { usePlaylists } from '@/lib/audio/hooks';
import { encodeUri } from '@m7/audio-os/shared/utils';

const TABS = ['Home', 'Hot & New'] as const;
type Tab = (typeof TABS)[number];

export default function Home() {
  const [tab, setTab] = useState<Tab>('Home');
  const { data: playlists = [] } = usePlaylists();
  const router = useRouter();

  return (
    <div className="px-6 py-5">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-charcoal/10 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-dark text-dark'
                : 'border-transparent text-charcoal/50 hover:text-charcoal'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Home' && (
        <>
          <h2 className="text-xl font-bold text-dark mb-4">Your Library</h2>
          {playlists.length === 0 ? (
            <p className="text-sm text-charcoal/40">No playlists found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {playlists.map((playlist) => (
                <AlbumCard
                  key={playlist.uri}
                  name={playlist.name}
                  onClick={() => router.push(`/playlists/${encodeUri(playlist.uri)}`)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'Hot & New' && (
        <div className="flex items-center justify-center h-48 text-charcoal/30 text-sm">
          Coming soon
        </div>
      )}
    </div>
  );
}
