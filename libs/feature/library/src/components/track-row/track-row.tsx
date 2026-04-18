'use client';

import { Button } from '@m7/audio-os/ui/primitives';
import type { NormalizedTrack } from '@m7/audio-os/shared/types';

function formatMs(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface TrackRowProps {
  track: NormalizedTrack;
  index?: number;
  onPlay: () => void;
  onAdd: () => void;
}

export function TrackRow({ track, index, onPlay, onAdd }: TrackRowProps) {
  return (
    <div className="grid grid-cols-[3rem_1fr_5rem_6rem] items-center px-4 py-3 hover:bg-charcoal/5 group border-b border-charcoal/5 last:border-0">
      <span className="text-sm tabular-nums text-charcoal/40 text-center">{index}</span>

      <div className="flex flex-col min-w-0 pr-4">
        <span className="text-sm font-medium text-dark truncate">{track.name}</span>
        <span className="text-xs text-charcoal/50 truncate">{track.artist}</span>
      </div>

      <span className="text-sm tabular-nums text-charcoal/40 text-right">
        {track.duration != null ? formatMs(track.duration) : '—'}
      </span>

      <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" onPress={onPlay}>
          Play
        </Button>
        <Button size="sm" variant="secondary" onPress={onAdd}>
          +
        </Button>
      </div>
    </div>
  );
}
