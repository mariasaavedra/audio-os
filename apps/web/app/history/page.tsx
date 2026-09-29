'use client';

import { useHistory, usePlaybackAction } from '@/lib/audio/hooks';
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@m7/audio-os/ui/primitives';

function timeAgo(ms: number): string {
  const secs = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} d ago`;
}

export default function HistoryPage() {
  const { data, error, isLoading } = useHistory();
  const action = usePlaybackAction();
  const items = data ?? [];

  return (
    <main className="px-6 py-5">
      <h1 className="mb-6 text-2xl font-bold">Recently played</h1>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {error && <p className="text-destructive">{(error as Error).message}</p>}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-muted-foreground">Nothing played yet.</p>
      )}

      {items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Played</TableHead>
              <TableHead className="w-40" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(({ playedAt, track }) => (
              <TableRow key={`${playedAt}-${track.uri}`}>
                <TableCell className="font-medium">{track.name}</TableCell>
                <TableCell className="text-muted-foreground">{track.artist}</TableCell>
                <TableCell className="text-muted-foreground">{timeAgo(playedAt)}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button size="xs" onClick={() => action.mutate({ action: 'playTrack', uri: track.uri })}>
                    Play
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => action.mutate({ action: 'addToQueue', uri: track.uri })}
                  >
                    Queue
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
