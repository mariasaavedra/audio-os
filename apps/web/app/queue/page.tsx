'use client';

import { usePlaybackAction, useQueue } from '@/lib/audio/hooks';
import {
  Badge,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@m7/audio-os/ui/primitives';

function formatMs(ms: number | null): string {
  if (ms == null) return '--:--';
  const totalSecs = Math.floor(ms / 1000);
  return `${String(Math.floor(totalSecs / 60)).padStart(2, '0')}:${String(totalSecs % 60).padStart(2, '0')}`;
}

export default function QueuePage() {
  const { data, error, isLoading } = useQueue();
  const action = usePlaybackAction();
  const items = data?.items ?? [];

  return (
    <main className="px-6 py-5">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Queue
          {items.length > 0 && (
            <Badge variant="secondary" className="ml-3 align-middle">
              {items.length}
            </Badge>
          )}
        </h1>
        <Button
          variant="outline"
          disabled={items.length === 0 || action.isPending}
          onClick={() => action.mutate({ action: 'clearQueue' })}
        >
          Clear queue
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {error && <p className="text-destructive">{(error as Error).message}</p>}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-muted-foreground">
          Your queue is empty. Add tracks from Browse or Tracks.
        </p>
      )}

      {items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="w-40" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(({ tlid, track }, i) => {
              const isCurrent = tlid === data?.currentTlid;
              return (
                <TableRow key={tlid} data-state={isCurrent ? 'selected' : undefined}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium">
                    {track.name}
                    {isCurrent && <Badge className="ml-2">Playing</Badge>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{track.artist}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {formatMs(track.duration)}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="xs" onClick={() => action.mutate({ action: 'playQueueItem', tlid })}>
                      Play
                    </Button>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => action.mutate({ action: 'removeFromQueue', tlid })}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
