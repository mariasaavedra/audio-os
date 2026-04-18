'use client';

import { Button } from '@m7/audio-os/ui/primitives';
import type { PlaylistSummary } from '@m7/audio-os/shared/types';
import { encodeUri } from '@m7/audio-os/shared/utils';
import Link from 'next/link';

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
        <span className="text-lg font-medium text-dark truncate block hover:underline">
          {playlist.name}
        </span>
      </Link>

      <Button
        size="sm"
        onPress={onPlay}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Play
      </Button>
    </div>
  );
}
