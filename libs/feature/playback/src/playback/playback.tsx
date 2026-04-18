'use client';

import type { PlaybackActionRequest, PlaybackSnapshot } from '@m7/audio-os/shared/types';
import Image from 'next/image';
import { ControlButton } from '../control-button';
import { ProgressBar } from '../progress-bar';

interface PlaybackProps {
  playback: PlaybackSnapshot;
  onPlaybackAction: (action: PlaybackActionRequest) => void;
}

export function Playback({ playback, onPlaybackAction }: PlaybackProps) {
  const { state, track, position, artworkUrl } = playback;
  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';
  const title = track?.name ?? 'No track';
  const artist = track?.artist ?? 'Unknown artist';
  const duration = track?.duration ?? null;

  return (
    <div className="bg-slate-200/80 rounded-3xl p-6 flex flex-col gap-6 w-100 shadow-2xl">
      {/* Top row: artwork + title/artist */}
      <div className="flex items-center gap-4">
        {/* Artwork */}
        <div className="w-20 h-20 shadow-md rounded-2xl overflow-hidden shrink-0 bg-charcoal/20 flex items-center justify-center">
          {artworkUrl ? (
            <Image
              src={artworkUrl}
              alt={title}
              width={100}
              height={100}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <Image
              src="/icons/svg/music.svg"
              alt="No artwork"
              width={36}
              height={36}
              className="opacity-40"
            />
          )}
        </div>

        {/* Title / artist */}
        <div className="flex flex-col self-center leading-tight tracking-tighter gap-1 min-w-0">
          <span className="text-lg font-bold text-dark truncate">{title}</span>
          <span className="text-lg text-charcoal truncate">{artist}</span>
        </div>
      </div>

      {/* Progress */}
      <ProgressBar
        position={position}
        duration={duration}
        onSeek={(ms) => onPlaybackAction({ action: 'seek', position: ms })}
      />

      {/* Controls */}
      <div className="flex items-center justify-between">
        <ControlButton
          icon="/icons/svg/shuffle 1.svg"
          alt="Shuffle"
          onClick={() => onPlaybackAction({ action: 'shuffle' })}
        />
        <ControlButton
          icon="/icons/svg/skip-back.svg"
          alt="Previous"
          onClick={() => onPlaybackAction({ action: 'previous' })}
        />
        <ControlButton
          icon={isPlaying ? '/icons/svg/pause.svg' : '/icons/svg/play.svg'}
          alt={isPlaying ? 'Pause' : 'Play'}
          onClick={() => onPlaybackAction({ action: isPlaying ? 'pause' : isPaused ? 'resume' : 'play' })}
          size="lg"
          variant="white"
        />
        <ControlButton
          icon="/icons/svg/skip-forward.svg"
          alt="Next"
          onClick={() => onPlaybackAction({ action: 'next' })}
        />
        <ControlButton
          icon="/icons/svg/repeat.svg"
          alt="Repeat"
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
