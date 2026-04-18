'use client';

import type { NormalizedTrack } from '@m7/audio-os/shared/types';
import { TrackRow } from '@m7/audio-os/feature/library';

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
      <p className="text-sm text-charcoal/50 px-3">
        No results for &ldquo;{query}&rdquo;.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {tracks.map((track) => (
        <TrackRow
          key={track.uri}
          track={track}
          onPlay={() => onPlayTrack(track.uri)}
          onAdd={() => onAddToQueue(track.uri)}
        />
      ))}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="mt-3 mx-3 py-2 text-sm text-charcoal/60 hover:text-charcoal disabled:opacity-40"
        >
          {isLoadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  );
}
