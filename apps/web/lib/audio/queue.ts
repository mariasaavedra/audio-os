import type { QueueSnapshot } from '@/lib/audio/contract';
import { createMopidyClient } from '@/lib/mopidy';
import 'server-only';
import { normalizeTrack } from './tracks';

export async function getQueue(): Promise<QueueSnapshot> {
  const mopidy = createMopidyClient();
  const [tlTracks, currentTlid] = await Promise.all([
    mopidy.queue.getTlTracks(),
    mopidy.playback.getCurrentTlid(),
  ]);

  return {
    items: tlTracks.map((t) => ({ tlid: t.tlid, track: normalizeTrack(t.track) })),
    currentTlid,
  };
}
