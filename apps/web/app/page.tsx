'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Playback } from '@m7/audio-os/feature/playback';
import { usePlayback, usePlaybackAction } from '@/lib/audio/hooks';

export default function Home() {
  const { data, isLoading, error } = usePlayback();
  const action = usePlaybackAction();

  if (isLoading || !data) return null;
  if (error) return <div className="text-sm text-red-500">{(error as Error).message}</div>;

  const state = data.state;
  const dotColor = state === 'playing' ? 'bg-accent' : state === 'paused' ? 'bg-brand' : 'bg-charcoal/40';
  const artworkUrl = data.artworkUrl;

  return (
    <main className="min-h-screen flex items-center justify-center">
      {artworkUrl && (
        <div
          className="fixed inset-0 -z-10 scale-150 blur-[50px] opacity-50 saturate-200"
          style={{ backgroundImage: `url(${artworkUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}

      <Playback playback={data} onPlaybackAction={action.mutate} />

      {/* Bottom nav */}
      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-dark/60 backdrop-blur-md rounded-2xl px-4 py-2">
        <Link
          href="/playlists"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
        >
          <Image src="/icons/svg/music.svg" alt="Playlists" width={14} height={14} className="invert opacity-70" />
          <span className="text-[11px] font-medium text-white/70 tracking-wide">Playlists</span>
        </Link>

        <div className="w-px h-4 bg-white/10" />

        <Link
          href="/search"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
        >
          <Image src="/icons/svg/search.svg" alt="Search" width={14} height={14} className="invert opacity-70" />
          <span className="text-[11px] font-medium text-white/70 tracking-wide">Search</span>
        </Link>
      </nav>

      {/* Playback status */}
      <div className="fixed bottom-5 right-5 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${state === 'playing' ? 'animate-pulse' : ''}`} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">
          {state}
        </span>
      </div>
    </main>
  );
}
