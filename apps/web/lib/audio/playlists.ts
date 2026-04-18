import type { NormalizedTrack, PlaylistDetail, PlaylistSummary } from '@/lib/audio/contract';
import { createMopidyClient } from '@/lib/mopidy';
import type { MopidyTrackRaw } from '@m7/mopidy';
import 'server-only';

function normalizeTrack(raw: MopidyTrackRaw): NormalizedTrack {
  return {
    uri: raw.uri,
    name: raw.name ?? 'Unknown track',
    artist: raw.artists?.[0]?.name ?? 'Unknown artist',
    duration: raw.length ?? null,
  };
}

export async function getPlaylists(): Promise<PlaylistSummary[]> {
  const mopidy = createMopidyClient();
  const refs = await mopidy.playlists.list();
  return refs.map((r) => ({ uri: r.uri, name: r.name }));
}

export async function getPlaylistDetail(uri: string, offset: number, limit: number): Promise<PlaylistDetail> {
  const mopidy = createMopidyClient();
  const [refs, allPlaylists] = await Promise.all([
    mopidy.playlists.getItems(uri),
    mopidy.playlists.list(),
  ]);

  const meta = allPlaylists.find((p) => p.uri === uri);

  if (!refs) {
    return { uri, name: meta?.name ?? '', tracks: [], total: 0, offset, limit };
  }

  const total = refs.length;
  const pageRefs = refs.slice(offset, offset + limit);
  const pageUris = pageRefs.map((r) => r.uri);
  const nameMap = Object.fromEntries(pageRefs.map((r) => [r.uri, r.name]));

  const lookupResult = pageUris.length > 0 ? await mopidy.library.lookup(pageUris) : {};

  const tracks: NormalizedTrack[] = pageUris.flatMap((trackUri) => {
    const matches = lookupResult[trackUri] ?? [];
    if (matches.length > 0) return [normalizeTrack(matches[0])];
    return [{ uri: trackUri, name: nameMap[trackUri] ?? 'Unknown track', artist: '', duration: null }];
  });

  return { uri, name: meta?.name ?? '', tracks, total, offset, limit };
}
