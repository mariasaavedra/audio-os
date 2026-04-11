'use client';

import { useAudio, useAudioAction } from '@/lib/audio/hooks';

export default function Home() {
  const { data, isLoading, error } = useAudio();
  const action = useAudioAction();

  const track = data?.track;
  const artist = track?.artists?.[0]?.name;
  const state = data?.state;

  return (
    <div>
      <div>Status: {state}</div>
      <div>Track: {track?.name}</div>
      <div>Artist: {artist}</div>

      {error && <div>{(error as Error).message}</div>}

      <button onClick={() => action.mutate({ action: 'previous' })}>
        ⏮
      </button>

      <button onClick={() => action.mutate({ action: 'play' })}>
        ▶
      </button>

      <button onClick={() => action.mutate({ action: 'pause' })}>
        ⏸
      </button>

      <button onClick={() => action.mutate({ action: 'next' })}>
        ⏭
      </button>

      {isLoading && <div>Loading...</div>}
    </div>
  );
}