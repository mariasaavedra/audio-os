export type MopidyPlaybackStateRaw = 'playing' | 'paused' | 'stopped';

export interface MopidyRefRaw {
  __model__?: 'Ref';
  uri: string;
  name: string;
  type?: string | null;
}

export interface MopidyArtistRaw {
  __model__?: 'Artist';
  uri?: string | null;
  name?: string | null;
  sortname?: string | null;
  musicbrainz_id?: string | null;
}

export interface MopidyAlbumRaw {
  __model__?: 'Album';
  uri?: string | null;
  name?: string | null;
  artists?: MopidyArtistRaw[] | null;
  num_tracks?: number | null;
  num_discs?: number | null;
  date?: string | null;
  musicbrainz_id?: string | null;
}

export interface MopidyTrackRaw {
  __model__?: 'Track';
  uri: string;
  name?: string | null;
  artists?: MopidyArtistRaw[] | null;
  album?: MopidyAlbumRaw | null;
  composers?: MopidyArtistRaw[] | null;
  performers?: MopidyArtistRaw[] | null;
  genre?: string | null;
  track_no?: number | null;
  disc_no?: number | null;
  date?: string | null;
  length?: number | null;
  bitrate?: number | null;
  comment?: string | null;
  musicbrainz_id?: string | null;
  last_modified?: number | null;
}

export interface MopidyTlTrackRaw {
  __model__?: 'TlTrack';
  tlid: number;
  track: MopidyTrackRaw;
}

export interface MopidyPlaylistRaw {
  __model__?: 'Playlist';
  uri: string;
  name: string;
  tracks?: MopidyTrackRaw[] | null;
  last_modified?: number | null;
}

export interface MopidyImageRaw {
  __model__?: 'Image';
  uri: string;
  width?: number | null;
  height?: number | null;
}

export interface MopidySearchResultRaw {
  __model__?: 'SearchResult';
  uri?: string | null;
  tracks?: MopidyTrackRaw[] | null;
  artists?: MopidyArtistRaw[] | null;
  albums?: MopidyAlbumRaw[] | null;
}

export interface MopidyMethodMap {
  // Playback control
  'core.playback.play': {
    params: { tlid?: number | null } | undefined;
    result: null;
  };
  'core.playback.pause': {
    params: undefined;
    result: null;
  };
  'core.playback.resume': {
    params: undefined;
    result: null;
  };
  'core.playback.stop': {
    params: undefined;
    result: null;
  };
  'core.playback.next': {
    params: undefined;
    result: null;
  };
  'core.playback.previous': {
    params: undefined;
    result: null;
  };
  'core.playback.seek': {
    params: { time_position: number };
    result: boolean;
  };
  // Current track
  'core.playback.get_state': {
    params: undefined;
    result: MopidyPlaybackStateRaw;
  };
  'core.playback.get_current_track': {
    params: undefined;
    result: MopidyTrackRaw | null;
  };
  'core.playback.get_current_tl_track': {
    params: undefined;
    result: MopidyTlTrackRaw | null;
  };
  'core.playback.get_current_tlid': {
    params: undefined;
    result: number | null;
  };
  'core.playback.get_time_position': {
    params: undefined;
    result: number | null;
  };
  // Tracklist (queue)
  'core.tracklist.get_tl_tracks': {
    params: undefined;
    result: MopidyTlTrackRaw[];
  };
  'core.tracklist.add': {
    params: { uris: string[]; at_position?: number | null };
    result: MopidyTlTrackRaw[];
  };
  'core.tracklist.remove': {
    params: { criteria: Record<string, unknown> };
    result: MopidyTlTrackRaw[];
  };
  'core.tracklist.clear': {
    params: undefined;
    result: null;
  };
  'core.tracklist.shuffle': {
    params: { start?: number | null; end?: number | null } | undefined;
    result: null;
  };
  // Playlists
  'core.playlists.as_list': {
    params: undefined;
    result: MopidyRefRaw[];
  };
  'core.playlists.get_items': {
    params: { uri: string };
    result: MopidyRefRaw[] | null;
  };
  // History
  'core.history.get_history': {
    params: undefined;
    result: Array<[number, MopidyRefRaw]>;
  };
  'core.history.get_length': {
    params: undefined;
    result: number;
  };
  // Library
  'core.library.browse': {
    params: { uri?: string | null };
    result: MopidyRefRaw[];
  };
  'core.library.get_images': {
    params: { uris: string[] };
    result: Record<string, MopidyImageRaw[]>;
  };
  'core.library.search': {
    params: {
      query: Record<string, string[]>;
      uris?: string[] | null;
      exact?: boolean | null;
    };
    result: MopidySearchResultRaw[];
  };
}

export type MethodName = keyof MopidyMethodMap;
export type MethodParams<TMethod extends MethodName> = MopidyMethodMap[TMethod]['params'];
export type MethodResult<TMethod extends MethodName> = MopidyMethodMap[TMethod]['result'];
