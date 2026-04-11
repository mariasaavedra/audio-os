import type { PlaybackState, Track, TlTrack } from '@m7/mopidy';

// Local aliases
export type AudioCriteria = Record<string, unknown>;
export type AudioQuery = Record<string, string[]>;

// Snapshot
export interface AudioSnapshot {
  state: PlaybackState;
  track: Track | null;
  tlTrack: TlTrack | null;
  tlid: number | null;
  timePosition: number | null;
  artworkUrl: string | null;
}

// Action union
export type AudioActionRequest =
  | { action: 'play'; tlid?: number }
  | { action: 'pause' }
  | { action: 'resume' }
  | { action: 'stop' }
  | { action: 'next' }
  | { action: 'previous' }
  | { action: 'seek'; timePosition: number }
  | { action: 'queue.add'; uris: string[]; atPosition?: number }
  | { action: 'queue.clear' }
  | { action: 'queue.remove'; criteria: AudioCriteria }
  | { action: 'queue.getTlTracks' }
  | { action: 'queue.shuffle'; start?: number; end?: number }
  | { action: 'playlists.list' }
  | { action: 'playlists.getItems'; uri: string }
  | { action: 'history.getHistory' }
  | { action: 'history.getLength' }
  | { action: 'library.browse'; uri?: string }
  | { action: 'library.search'; query: AudioQuery; uris?: string[]; exact?: boolean };

// Response envelope
export interface AudioSuccess<T = undefined> {
  ok: true;
  data?: T;
}

export interface AudioFailure {
  ok: false;
  error: string;
}

export type AudioResponse<T = undefined> = AudioSuccess<T> | AudioFailure;
