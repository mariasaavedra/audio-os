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

export async function searchTracks(q: string, offset: number, limit: number): Promise<SearchResults> {
  const mopidy = createMopidyClient();
  const results = await mopidy.library.search({ any: [q] });

  const seen = new Set<string>();
  const allTracks: NormalizedTrack[] = [];

  for (const result of results) {
    for (const track of result.tracks ?? []) {
      if (!seen.has(track.uri)) {
        seen.add(track.uri);
        allTracks.push(normalizeTrack(track));
      }
    }
  }

  return {
    query: q,
    tracks: allTracks.slice(offset, offset + limit),
    total: allTracks.length,
    offset,
    limit,
  };
}
