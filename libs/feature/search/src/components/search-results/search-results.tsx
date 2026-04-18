'use client';

import { Button } from '@m7/audio-os/ui/primitives';
import { Spinner } from '@m7/audio-os/ui/feedback';
import { TrackRow } from '@m7/audio-os/feature/library';
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
      <p className="text-lg text-charcoal/50 px-3">
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
        <div className="mt-3 mx-3 flex justify-center">
          {isLoadingMore ? (
            <Spinner size="sm" />
          ) : (
            <Button variant="ghost" onPress={onLoadMore}>
              Load more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
