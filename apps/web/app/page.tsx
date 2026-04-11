'use client';

import { useAudio, useAudioAction } from '@/lib/audio/hooks';
import { PlayerCard } from '@/components/PlayerCard';

export default function Home() {
  const { data, isLoading, error } = useAudio();
  const action = useAudioAction();

  if (isLoading || !data) return null;
  if (error) return <div className="text-sm text-red-500">{(error as Error).message}</div>;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <PlayerCard snapshot={data} onAction={action.mutate} />
    </main>
  );
}
