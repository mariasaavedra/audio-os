'use client';

import type { PlaybackActionRequest, PlaybackSnapshot } from '@m7/audio-os/shared/types';
import Image from 'next/image';
import { ControlButton } from '../control-button';
import { ProgressBar } from '../progress-bar';

interface PlayerBarProps {
  snapshot: PlaybackSnapshot | undefined;
  onAction: (req: PlaybackActionRequest) => void;
}

export function PlayerBar({ snapshot, onAction }: PlayerBarProps) {
  const state = snapshot?.state ?? 'stopped';
  const track = snapshot?.track ?? null;
  const position = snapshot?.position ?? null;
  const artworkUrl = snapshot?.artworkUrl ?? null;
  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-light/90 backdrop-blur-md border-t border-charcoal/10 z-50 flex items-center px-4 gap-4">
      {/* Left: artwork + track info */}
      <div className="flex items-center gap-3 w-52 shrink-0">
        <div className="w-11 h-11 rounded-lg overflow-hidden bg-charcoal/10 flex items-center justify-center shrink-0">
          {artworkUrl ? (
            <Image
              src={artworkUrl}
              alt={track?.name ?? ''}
              width={44}
              height={44}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <Image src="/icons/svg/music.svg" alt="" width={18} height={18} className="opacity-30" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-dark truncate">{track?.name ?? 'Select a song'}</p>
          {track && <p className="text-xs text-charcoal/60 truncate">{track.artist}</p>}
        </div>
      </div>

      {/* Center: controls + progress */}
      <div className="flex-1 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          <ControlButton
            icon="/icons/svg/shuffle 1.svg"
            alt="Shuffle"
            onClick={() => onAction({ action: 'shuffle' })}
          />
          <ControlButton
            icon="/icons/svg/skip-back.svg"
            alt="Previous"
            onClick={() => onAction({ action: 'previous' })}
          />
          <ControlButton
            icon={isPlaying ? '/icons/svg/pause.svg' : '/icons/svg/play.svg'}
            alt={isPlaying ? 'Pause' : 'Play'}
            onClick={() => onAction({ action: isPlaying ? 'pause' : isPaused ? 'resume' : 'play' })}
            size="lg"
            variant="white"
          />
          <ControlButton
            icon="/icons/svg/skip-forward.svg"
            alt="Next"
            onClick={() => onAction({ action: 'next' })}
          />
          <ControlButton
            icon="/icons/svg/repeat.svg"
            alt="Repeat"
            onClick={() => {}}
          />
        </div>
        <ProgressBar
          position={position}
          duration={track?.duration ?? null}
          onSeek={(ms) => onAction({ action: 'seek', position: ms })}
        />
      </div>

      {/* Right: volume (static placeholder) */}
      <div className="w-52 shrink-0 flex justify-end items-center gap-2">
        <Image src="/icons/svg/music.svg" alt="Volume" width={15} height={15} className="opacity-40" />
        <div className="w-20 h-1.5 bg-charcoal/15 rounded-full overflow-hidden">
          <div className="w-3/4 h-full bg-charcoal/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
