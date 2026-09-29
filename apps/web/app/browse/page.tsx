'use client';

import { useAllTracks, usePlaybackAction, usePlaylists } from '@/lib/audio/hooks';
import { encodeUri } from '@m7/audio-os/shared/utils';
import {
  Badge,
  Button,
  Card,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@m7/audio-os/ui/primitives';
import Link from 'next/link';

function formatMs(ms: number | null): string {
  if (ms == null) return '--:--';
  const totalSecs = Math.floor(ms / 1000);
  return `${String(Math.floor(totalSecs / 60)).padStart(2, '0')}:${String(totalSecs % 60).padStart(2, '0')}`;
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

function TracksPanel() {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useAllTracks();
  const action = usePlaybackAction();
  const tracks = data?.pages.flatMap((p) => p.tracks) ?? [];

  if (isLoading) return <ListSkeleton />;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;

  return (
    <div className="flex flex-col gap-4">
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
          {tracks.map((track, i) => (
            <TableRow key={track.uri}>
              <TableCell className="text-muted-foreground">{i + 1}</TableCell>
              <TableCell className="font-medium">{track.name}</TableCell>
              <TableCell className="text-muted-foreground">{track.artist}</TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {formatMs(track.duration)}
              </TableCell>
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
      {hasNextPage && (
        <Button variant="outline" className="self-center" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </Button>
      )}
    </div>
  );
}

function PlaylistsPanel() {
  const { data, error, isLoading } = usePlaylists();

  if (isLoading) return <ListSkeleton />;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;
  if (!data?.length) return <p className="text-muted-foreground">No playlists found.</p>;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((playlist) => (
        <Card key={playlist.uri} className="flex flex-row items-center justify-between gap-3 p-4">
          <span className="truncate font-medium">{playlist.name}</span>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/playlists/${encodeUri(playlist.uri)}`}>Open</Link>
          </Button>
        </Card>
      ))}
    </div>
  );
}

export default function BrowsePage() {
  const { data: playlists } = usePlaylists();

  return (
    <main className="px-6 py-5">
      <h1 className="mb-6 text-2xl font-bold">Browse</h1>
      <Tabs defaultValue="tracks">
        <TabsList>
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
          <TabsTrigger value="playlists">
            Playlists
            {playlists && <Badge variant="secondary">{playlists.length}</Badge>}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tracks" className="mt-4">
          <TracksPanel />
        </TabsContent>
        <TabsContent value="playlists" className="mt-4">
          <PlaylistsPanel />
        </TabsContent>
      </Tabs>
    </main>
  );
}
