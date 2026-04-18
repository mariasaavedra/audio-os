'use client';

import Link from 'next/link';
import type { PlaylistSummary } from '@m7/audio-os/shared/types';
import { encodeUri } from '@m7/audio-os/shared/utils';

interface PlaylistRowProps {
  playlist: PlaylistSummary;
  onPlay: () => void;
}

export function PlaylistRow({ playlist, onPlay }: PlaylistRowProps) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-charcoal/5 group">
      <Link
        href={`/playlists/${encodeUri(playlist.uri)}`}
        className="flex-1 min-w-0"
      >
        <span className="text-sm font-medium text-dark truncate block hover:underline">
          {playlist.name}
        </span>
      </Link>

      <button
        onClick={onPlay}
        className="text-xs px-2 py-1 rounded-lg bg-brand text-white hover:bg-brand/80 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Play
      </button>
    </div>
  );
}
