import type { NormalizedTrack, SearchResults } from '@/lib/audio/contract';
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

export async function getAllTracks(offset: number, limit: number): Promise<SearchResults> {
  const mopidy = createMopidyClient();

  const playlists = await mopidy.playlists.list();

  const itemLists = await Promise.all(
    playlists.map((p) => mopidy.playlists.getItems(p.uri))
  );

  const seen = new Set<string>();
  const allUris: string[] = [];

  for (const items of itemLists) {
    for (const ref of items ?? []) {
      if (!seen.has(ref.uri)) {
        seen.add(ref.uri);
        allUris.push(ref.uri);
      }
    }
  }

  const total = allUris.length;
  const pageUris = allUris.slice(offset, offset + limit);
  const lookupResult = pageUris.length > 0 ? await mopidy.library.lookup(pageUris) : {};

  const tracks: NormalizedTrack[] = pageUris.flatMap((uri) => {
    const matches = lookupResult[uri] ?? [];
    return matches.length > 0 ? [normalizeTrack(matches[0])] : [];
  });

  return { query: '', tracks, total, offset, limit };
}
