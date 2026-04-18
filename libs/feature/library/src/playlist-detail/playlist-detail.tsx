'use client';

import type { PlaylistDetail as PlaylistDetailType } from '@m7/audio-os/shared/types';
import { TrackRow } from '../track-row';

interface PlaylistDetailProps {
  detail: PlaylistDetailType;
  onStartPlaylist: () => void;
  onPlayTrack: (uri: string) => void;
  onAddToQueue: (uri: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function PlaylistDetail({
  detail,
  onStartPlaylist,
  onPlayTrack,
  onAddToQueue,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: PlaylistDetailProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-3">
        <h1 className="text-xl font-bold text-dark truncate">{detail.name}</h1>
        <button
          onClick={onStartPlaylist}
          className="text-sm px-3 py-1.5 rounded-xl bg-brand text-white hover:bg-brand/80 shrink-0"
        >
          Play all
        </button>
      </div>

      {detail.tracks.length === 0 ? (
        <p className="text-sm text-charcoal/50 px-3">This playlist is empty.</p>
      ) : (
        <div className="flex flex-col">
          {detail.tracks.map((track) => (
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
      )}
    </div>
  );
}
