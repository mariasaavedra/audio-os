'use client';

import { Slider } from '@m7/audio-os/ui/primitives';

function formatMs(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface ProgressBarProps {
  position: number | null;
  duration: number | null;
  onSeek: (ms: number) => void;
}

export function ProgressBar({ position, duration, onSeek }: ProgressBarProps) {
  const pos = position ?? 0;
  const dur = duration ?? 0;

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-sm tabular-nums text-muted-foreground w-10 text-right">
        {formatMs(pos)}
      </span>

      <Slider
        value={[pos]}
        min={0}
        max={dur || 1}
        step={1}
        onValueChange={([val]) => onSeek(val)}
        disabled={dur === 0}
        aria-label="Playback position"
        className="flex-1"
      />

      <span className="text-sm tabular-nums text-muted-foreground w-10">
        {dur > 0 ? formatMs(dur) : '--:--'}
      </span>
    </div>
  );
}
