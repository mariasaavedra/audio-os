// Domain types live in libs/shared — re-exported here for backwards compat during migration
export type { NormalizedTrack, PlaybackSnapshot, PlaybackActionRequest, PlaylistSummary, PlaylistDetail } from '@m7/audio-os/shared/types';

import type { NormalizedTrack } from '@m7/audio-os/shared/types';

// Response envelope types — app-layer only
export interface SearchResults {
  query: string;
  tracks: NormalizedTrack[];
  total: number;
  offset: number;
  limit: number;
}

export interface AudioSuccess<T = undefined> {
  ok: true;
  data?: T;
}

export interface AudioFailure {
  ok: false;
  error: string;
}

export type AudioResponse<T = undefined> = AudioSuccess<T> | AudioFailure;
