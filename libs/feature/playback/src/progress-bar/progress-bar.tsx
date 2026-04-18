'use client';

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
  const pct = dur > 0 ? (pos / dur) * 100 : 0;

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs tabular-nums text-charcoal/70 w-10 text-right">
        {formatMs(pos)}
      </span>

      <div className="relative flex-1 h-2 flex items-center">
        <input
          type="range"
          min={0}
          max={dur || 1}
          value={pos}
          disabled={dur === 0}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-2  shadow-xl appearance-none rounded-full cursor-pointer disabled:cursor-default
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-brand
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:[box-shadow:0_4px_10px_rgba(0,0,0,0.3)]"
          style={{
            background: `linear-gradient(to right, var(--color-brand) ${pct}%, color-mix(in srgb, var(--color-charcoal) 20%, transparent) ${pct}%)`,
          }}
        />
      </div>

      <span className="text-xs tabular-nums text-charcoal/70 w-10">
        {dur > 0 ? formatMs(dur) : '--:--'}
      </span>
    </div>
  );
}
