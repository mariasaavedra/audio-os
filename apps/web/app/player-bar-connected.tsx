'use client';

import { PlayerBar } from '@m7/audio-os/feature/playback';
import { usePlayback, usePlaybackAction } from '@/lib/audio/hooks';

export function PlayerBarConnected() {
  const { data } = usePlayback();
  const action = usePlaybackAction();
  return <PlayerBar snapshot={data} onAction={action.mutate} />;
}
