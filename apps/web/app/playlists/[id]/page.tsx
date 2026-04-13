'use client';

import { use } from 'react';
import { usePlaylistDetail, usePlaybackAction } from '@/lib/audio/hooks';
import { PlaylistDetail } from '@/components/playlists/PlaylistDetail';

export default function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = usePlaylistDetail(id);
  const action = usePlaybackAction();

  if (isLoading) return null;
  if (error) return <div className="text-sm text-red-500">{(error as Error).message}</div>;
  if (!data) return null;

  const firstPage = data.pages[0];
  const tracks = data.pages.flatMap((p) => p.tracks);

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto">
      <PlaylistDetail
        detail={{ ...firstPage, tracks }}
        onStartPlaylist={() => action.mutate({ action: 'startPlaylist', uri: firstPage.uri })}
        onPlayTrack={(uri) => action.mutate({ action: 'playTrack', uri })}
        onAddToQueue={(uri) => action.mutate({ action: 'addToQueue', uri })}
        hasMore={hasNextPage}
        onLoadMore={fetchNextPage}
        isLoadingMore={isFetchingNextPage}
      />
    </main>
  );
}
