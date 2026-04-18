'use client';

import { usePlaylists, usePlaybackAction } from '@/lib/audio/hooks';
import { PlaylistList } from '@m7/audio-os/feature/library';

export default function PlaylistsPage() {
  const { data, isLoading, error } = usePlaylists();
  const action = usePlaybackAction();

  if (isLoading) return null;
  if (error) return <div className="text-sm text-red-500">{(error as Error).message}</div>;

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-dark mb-6">Playlists</h1>
      <PlaylistList
        playlists={data ?? []}
        onStartPlaylist={(uri) => action.mutate({ action: 'startPlaylist', uri })}
      />
    </main>
  );
}
