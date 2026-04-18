'use client';

import { useAllTracks, usePlaybackAction } from '@/lib/audio/hooks';
import { TrackList } from '@m7/audio-os/feature/library';

export default function TracksPage() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useAllTracks();
  const action = usePlaybackAction();

  const tracks = data?.pages.flatMap((p) => p.tracks) ?? [];

  if (isLoading) return null;
  if (error) return <div className="text-lg text-red-500">{(error as Error).message}</div>;

  return (
    <main className="px-6 py-5 max-w-2xl">
      <h1 className="text-2xl font-bold text-dark mb-6">Tracks</h1>
      <TrackList
        tracks={tracks}
        onPlayTrack={(uri) => action.mutate({ action: 'playTrack', uri })}
        onAddToQueue={(uri) => action.mutate({ action: 'addToQueue', uri })}
        showIndex
        hasMore={hasNextPage}
        onLoadMore={fetchNextPage}
        isLoadingMore={isFetchingNextPage}
      />
    </main>
  );
}
