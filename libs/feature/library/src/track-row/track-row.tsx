'use client';

import type { NormalizedTrack } from '@m7/audio-os/shared/types';

function formatMs(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface TrackRowProps {
  track: NormalizedTrack;
  onPlay: () => void;
  onAdd: () => void;
}

export function TrackRow({ track, onPlay, onAdd }: TrackRowProps) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-charcoal/5 group">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-medium text-dark truncate">{track.name}</span>
        <span className="text-xs text-charcoal/70 truncate">{track.artist}</span>
      </div>

      {track.duration != null && (
        <span className="text-xs tabular-nums text-charcoal/50 shrink-0">
          {formatMs(track.duration)}
        </span>
      )}

      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onPlay}
          className="text-xs px-2 py-1 rounded-lg bg-brand text-white hover:bg-brand/80"
        >
          Play
        </button>
        <button
          onClick={onAdd}
          className="text-xs px-2 py-1 rounded-lg bg-charcoal/10 text-charcoal hover:bg-charcoal/20"
        >
          Add
        </button>
      </div>
    </div>
  );
}
