import type { NormalizedTrack, PlaybackSnapshot } from '@/lib/audio/contract';
import { createMopidyClient } from '@/lib/mopidy';
import type { MopidyTrackRaw } from '@m7/mopidy';

function normalizeTrack(raw: MopidyTrackRaw): NormalizedTrack {
  return {
    uri: raw.uri,
    name: raw.name ?? 'Unknown track',
    artist: raw.artists?.[0]?.name ?? 'Unknown artist',
    duration: raw.length ?? null,
  };
}

export async function getPlaybackSnapshot(): Promise<PlaybackSnapshot> {
  const mopidy = createMopidyClient();
  const [state, track, timePosition] = await Promise.all([
    mopidy.playback.getState(),
    mopidy.playback.getCurrentTrack(),
    mopidy.playback.getTimePosition(),
  ]);

  let artworkUrl: string | null = null;
  if (track?.uri) {
    const images = await mopidy.library.getImages([track.uri]);
    const candidates = images[track.uri] ?? [];
    const best = candidates.sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];
    artworkUrl = best?.uri ?? null;
  }

  return {
    state,
    track: track ? normalizeTrack(track) : null,
    position: timePosition,
    artworkUrl,
  };
}
