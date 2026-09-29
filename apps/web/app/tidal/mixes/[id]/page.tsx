'use client';

import { usePlaybackAction, useTidalMixDetail } from '@/lib/audio/hooks';
import { PlaylistDetail } from '@m7/audio-os/feature/library';
import { use } from 'react';

export default function TidalMixDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTidalMixDetail(id);
  const action = usePlaybackAction();

  if (isLoading) return null;
  if (error) return <div className="text-lg text-red-500">{(error as Error).message}</div>;
  if (!data) return null;

  const firstPage = data.pages[0];
  const tracks = data.pages.flatMap((p) => p.tracks);

  return (
    <div className="max-w-8xl mx-auto p-6">
      <PlaylistDetail
        detail={{ ...firstPage, tracks }}
        onStartPlaylist={() => {
          if (tracks[0]) action.mutate({ action: 'playTrack', uri: tracks[0].uri });
        }}
        onPlayTrack={(uri) => action.mutate({ action: 'playTrack', uri })}
        onAddToQueue={(uri) => action.mutate({ action: 'addToQueue', uri })}
        hasMore={hasNextPage}
        onLoadMore={fetchNextPage}
        isLoadingMore={isFetchingNextPage}
      />
    </div>
  );
}
