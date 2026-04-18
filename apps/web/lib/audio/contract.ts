// Normalized domain types — no raw Mopidy imports

export interface NormalizedTrack {
  uri: string;
  name: string;
  artist: string;
  duration: number | null;
}

export interface PlaybackSnapshot {
  state: 'playing' | 'paused' | 'stopped';
  track: NormalizedTrack | null;
  position: number | null;
  artworkUrl: string | null;
}

export interface PlaylistSummary {
  uri: string;
  name: string;
}

export interface PlaylistDetail {
  uri: string;
  name: string;
  tracks: NormalizedTrack[];
  total: number;
  offset: number;
  limit: number;
}

export interface SearchResults {
  query: string;
  tracks: NormalizedTrack[];
  total: number;
  offset: number;
  limit: number;
}

// Playback action union (app-oriented)
export type PlaybackActionRequest =
  | { action: 'play' }
  | { action: 'pause' }
  | { action: 'resume' }
  | { action: 'previous' }
  | { action: 'next' }
  | { action: 'seek'; position: number }
  | { action: 'playTrack'; uri: string }
  | { action: 'addToQueue'; uri: string }
  | { action: 'startPlaylist'; uri: string }
  | { action: 'shuffle' };

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
