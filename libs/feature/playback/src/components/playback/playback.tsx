'use client';

import {
  MusicNote01Icon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PreviousIcon,
  RepeatIcon,
  ShuffleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { PlaybackActionRequest, PlaybackSnapshot } from '@m7/audio-os/shared/types';
import { Card, CardContent } from '@m7/audio-os/ui/primitives';
import Image from 'next/image';
import { ControlButton } from '../control-button';
import { ProgressBar } from '../progress-bar';

interface PlaybackProps {
  playback: PlaybackSnapshot;
  onPlaybackAction: (action: PlaybackActionRequest) => void;
  className?: string;
}

export function Playback({ playback, onPlaybackAction, className }: PlaybackProps) {
  const { state, track, position, artworkUrl } = playback;
  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';
  const title = track?.name ?? 'Select a song';
  const artist = track?.artist ?? null;
  const duration = track?.duration ?? null;

  return (
    <Card size="sm" className={className}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {/* Artwork */}
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {artworkUrl ? (
              <Image
                src={artworkUrl}
                alt={title}
                width={96}
                height={96}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <HugeiconsIcon icon={MusicNote01Icon} size={32} className="text-muted-foreground" />
            )}
          </div>

          {/* Title / artist */}
          <div className="flex min-w-0 flex-1 flex-col gap-1 leading-tight">
            <span className="truncate font-heading text-2xl font-bold text-foreground">{title}</span>
            {artist && <span className="truncate text-lg text-muted-foreground">{artist}</span>}
          </div>

          {/* Controls */}
          <div className="flex shrink-0 items-center">
            <ControlButton
              icon={ShuffleIcon}
              alt="Shuffle"
              tone="muted"
              onClick={() => onPlaybackAction({ action: 'shuffle' })}
            />
            <ControlButton
              icon={PreviousIcon}
              alt="Previous"
              onClick={() => onPlaybackAction({ action: 'previous' })}
            />
            <ControlButton
              icon={isPlaying ? PauseIcon : PlayIcon}
              alt={isPlaying ? 'Pause' : 'Play'}
              size="lg"
              tone="primary"
              onClick={() => onPlaybackAction({ action: isPlaying ? 'pause' : isPaused ? 'resume' : 'play' })}
            />
            <ControlButton icon={NextIcon} alt="Next" onClick={() => onPlaybackAction({ action: 'next' })} />
            <ControlButton icon={RepeatIcon} alt="Repeat" tone="muted" onClick={() => {}} />
          </div>
        </div>

        {/* Progress */}
        <ProgressBar
          position={position}
          duration={duration}
          onSeek={(ms) => onPlaybackAction({ action: 'seek', position: ms })}
        />
      </CardContent>
    </Card>
  );
}
