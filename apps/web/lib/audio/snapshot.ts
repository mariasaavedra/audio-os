import { mopidy } from '@/lib/mopidy';
import type { AudioSnapshot } from '@/lib/audio/contract';

export async function getAudioSnapshot(): Promise<AudioSnapshot> {
  const [state, track, tlTrack, tlid, timePosition] = await Promise.all([
    mopidy.playback.getState(),
    mopidy.playback.getCurrentTrack(),
    mopidy.playback.getCurrentTlTrack(),
    mopidy.playback.getCurrentTlid(),
    mopidy.playback.getTimePosition(),
  ]);

  let artworkUrl: string | null = null;
  if (track?.uri) {
    const images = await mopidy.library.getImages([track.uri]);
    const candidates = images[track.uri] ?? [];
    const best = candidates.sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];
    artworkUrl = best?.uri ?? null;
  }

  return { state, track, tlTrack, tlid, timePosition, artworkUrl };
}
