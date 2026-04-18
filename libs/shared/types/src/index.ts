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
