import type { HistoryItem, NormalizedTrack } from '@/lib/audio/contract';
import { createMopidyClient } from '@/lib/mopidy';
import 'server-only';
import { normalizeTrack } from './tracks';

const HISTORY_LIMIT = 50;

export async function getHistory(): Promise<HistoryItem[]> {
  const mopidy = createMopidyClient();
  const history = (await mopidy.history.getHistory()).slice(0, HISTORY_LIMIT);
  if (history.length === 0) return [];

  const uris = [...new Set(history.map(([, ref]) => ref.uri))];
  const lookup = await mopidy.library.lookup(uris);

  return history.map(([playedAt, ref]) => {
    const match = lookup[ref.uri]?.[0];
    const track: NormalizedTrack = match
      ? normalizeTrack(match)
      : { uri: ref.uri, name: ref.name, artist: 'Unknown artist', duration: null };
    return { playedAt, track };
  });
}
