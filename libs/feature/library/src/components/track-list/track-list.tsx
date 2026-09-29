'use client';

import { LoadMore } from '@m7/audio-os/ui/feedback';
import type { NormalizedTrack } from '@m7/audio-os/shared/types';
import { TrackRow } from '../track-row';

interface TrackListProps {
  tracks: NormalizedTrack[];
  onPlayTrack: (uri: string) => void;
  onAddToQueue: (uri: string) => void;
  showIndex?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function TrackList({
  tracks,
  onPlayTrack,
  onAddToQueue,
  showIndex = false,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: TrackListProps) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[3rem_1fr_5rem_6rem] px-4 pb-2 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span className="text-center">#</span>
        <span>Title</span>
        <span className="text-right">Duration</span>
        <span className="text-right">Menu</span>
      </div>

      {tracks.map((track, i) => (
        <TrackRow
          key={track.uri}
          index={showIndex ? i + 1 : undefined}
          track={track}
          onPlay={() => onPlayTrack(track.uri)}
          onAdd={() => onAddToQueue(track.uri)}
        />
      ))}

      <LoadMore
        hasMore={hasMore}
        isLoading={isLoadingMore}
        onLoadMore={onLoadMore}
        className="mx-4"
      />
    </div>
  );
}
