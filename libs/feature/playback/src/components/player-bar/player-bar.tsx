'use client';

import type { PlaybackActionRequest, PlaybackSnapshot } from '@m7/audio-os/shared/types';
import { Playback } from '../playback';

interface PlayerBarProps {
  snapshot: PlaybackSnapshot | undefined;
  onAction: (req: PlaybackActionRequest) => void;
}

const IDLE: PlaybackSnapshot = { state: 'stopped', track: null, position: null, artworkUrl: null };

export function PlayerBar({ snapshot, onAction }: PlayerBarProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 left-40 z-50 flex justify-center px-4">
      <Playback
        playback={snapshot ?? IDLE}
        onPlaybackAction={onAction}
        className="pointer-events-auto w-full max-w-2xl"
      />
    </div>
  );
}
