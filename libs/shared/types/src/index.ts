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

export interface HistoryItem {
  playedAt: number;
  track: NormalizedTrack;
}

export interface QueueItem {
  tlid: number;
  track: NormalizedTrack;
}

export interface QueueSnapshot {
  items: QueueItem[];
  currentTlid: number | null;
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

export interface TidalMixSummary {
  uri: string;
  name: string;
  subtitle: string;
  kind: 'history' | 'mix';
  artworkUrl: string | null;
}

export interface TidalMixDetail {
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
  | { action: 'shuffle' }
  | { action: 'playQueueItem'; tlid: number }
  | { action: 'removeFromQueue'; tlid: number }
  | { action: 'clearQueue' };
