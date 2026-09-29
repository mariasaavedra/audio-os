'use client';

import { TrackList } from '@m7/audio-os/feature/library';
import type { NormalizedTrack } from '@m7/audio-os/shared/types';

interface SearchResultsProps {
  tracks: NormalizedTrack[];
  query: string;
  onPlayTrack: (uri: string) => void;
  onAddToQueue: (uri: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function SearchResults({
  tracks,
  query,
  onPlayTrack,
  onAddToQueue,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: SearchResultsProps) {
  if (tracks.length === 0) {
    return (
      <p className="text-lg text-muted-foreground px-3">
        No results for &ldquo;{query}&rdquo;.
      </p>
    );
  }

  return (
    <TrackList
      tracks={tracks}
      onPlayTrack={onPlayTrack}
      onAddToQueue={onAddToQueue}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      isLoadingMore={isLoadingMore}
    />
  );
}
