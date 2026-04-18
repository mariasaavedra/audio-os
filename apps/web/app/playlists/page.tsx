'use client';

import { usePlaylists } from '@/lib/audio/hooks';
import { AlbumCard } from '@m7/audio-os/feature/library';
import { encodeUri } from '@m7/audio-os/shared/utils';
import { useRouter } from 'next/navigation';

export default function PlaylistsPage() {
  const { data: playlists = [] } = usePlaylists();
  const router = useRouter();

  return (
    <div className="px-6 py-5">
      <h1 className="text-2xl font-bold text-dark mb-6">Playlists</h1>
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
    </div>
  );
}
