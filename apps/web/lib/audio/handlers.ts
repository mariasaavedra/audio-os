import type { PlaybackActionRequest } from '@/lib/audio/contract';
import { createMopidyClient } from '@/lib/mopidy';

export async function handleAudioAction(
  input: PlaybackActionRequest
): Promise<{ ok: true; data?: unknown }> {
  const mopidy = createMopidyClient();
  switch (input.action) {
    case 'play':
      await mopidy.playback.play();
      return { ok: true };

    case 'pause':
      await mopidy.playback.pause();
      return { ok: true };

    case 'resume':
      await mopidy.playback.resume();
      return { ok: true };

    case 'previous':
      await mopidy.playback.previous();
      return { ok: true };

    case 'next':
      await mopidy.playback.next();
      return { ok: true };

    case 'seek':
      if (input.position < 0) throw new Error('position must be >= 0');
      await mopidy.playback.seek(input.position);
      return { ok: true };

    case 'playTrack': {
      const added = await mopidy.queue.add({ uris: [input.uri] });
      const tlid = added[0]?.tlid;
      if (tlid == null) throw new Error('Failed to add track to queue');
      await mopidy.playback.play(tlid);
      return { ok: true };
    }

    case 'addToQueue':
      await mopidy.queue.add({ uris: [input.uri] });
      return { ok: true };

    case 'startPlaylist': {
      const refs = await mopidy.playlists.getItems(input.uri);
      if (!refs || refs.length === 0) throw new Error('Playlist is empty or not found');
      await mopidy.queue.clear();
      await mopidy.queue.add({ uris: refs.map((r) => r.uri) });
      await mopidy.playback.play();
      return { ok: true };
    }

    case 'shuffle':
      await mopidy.queue.shuffle();
      return { ok: true };
  }
}
