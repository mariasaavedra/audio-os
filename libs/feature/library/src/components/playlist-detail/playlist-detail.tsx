'use client';

import type { PlaylistDetail as PlaylistDetailType } from '@m7/audio-os/shared/types';
import { TrackRow } from '../track-row';

function formatTotalDuration(tracks: PlaylistDetailType['tracks']): string {
  const totalMs = tracks.reduce((sum, t) => sum + (t.duration ?? 0), 0);
  return `${Math.floor(totalMs / 60000)} min`;
}

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
  const trackCount = detail.total || detail.tracks.length;
  const totalDuration = formatTotalDuration(detail.tracks);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex gap-8 px-6 py-8">
        <div className="w-44 h-44 rounded-xl bg-charcoal/10 shrink-0 flex items-center justify-center text-charcoal/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9Z" />
          </svg>
        </div>

        <div className="flex flex-col justify-end gap-2 min-w-0">
          <h1 className="text-4xl font-bold text-dark leading-tight">{detail.name}</h1>
          <p className="text-sm text-charcoal/50">
            {trackCount} {trackCount === 1 ? 'track' : 'tracks'} • {totalDuration}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={onStartPlaylist}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-sm font-medium hover:bg-brand/80 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>

            <button
              className="w-10 h-10 rounded-full bg-charcoal/8 flex items-center justify-center text-charcoal/60 hover:bg-charcoal/15 hover:text-dark transition-colors"
              title="Shuffle"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Track table */}
      {detail.tracks.length === 0 ? (
        <p className="text-base text-charcoal/50 px-6 py-4">This playlist is empty.</p>
      ) : (
        <div className="flex flex-col">
          <div className="grid grid-cols-[3rem_1fr_5rem_6rem] px-4 pb-2 border-b border-charcoal/10 text-xs font-medium text-charcoal/40 uppercase tracking-wider">
            <span className="text-center">#</span>
            <span>Title</span>
            <span className="text-right">Duration</span>
            <span className="text-right">Menu</span>
          </div>

          {detail.tracks.map((track, i) => (
            <TrackRow
              key={track.uri}
              index={i + 1}
              track={track}
              onPlay={() => onPlayTrack(track.uri)}
              onAdd={() => onAddToQueue(track.uri)}
            />
          ))}

          {hasMore && (
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="mt-2 mx-4 py-2 text-sm text-charcoal/50 hover:text-charcoal disabled:opacity-40"
            >
              {isLoadingMore ? 'Loading…' : 'Load more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
