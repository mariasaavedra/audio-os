'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlaybackSnapshot, postPlaybackAction } from './api';
import type {
  PlaybackActionRequest,
  PlaylistDetail,
  HistoryItem,
  PlaylistSummary,
  QueueSnapshot,
  SearchResults,
  TidalMixDetail,
  TidalMixSummary,
} from './contract';

const TRACK_LIMIT = 50;

export function usePlayback() {
  return useQuery({
    queryKey: ['playback'],
    queryFn: getPlaybackSnapshot,
    refetchInterval: 2000,
  });
}

export function usePlaybackAction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: PlaybackActionRequest) => postPlaybackAction(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['playback'] });
      qc.invalidateQueries({ queryKey: ['queue'] });
    },
  });
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error ?? 'Request failed');
  return json.data;
}

export function useQueue() {
  return useQuery<QueueSnapshot>({
    queryKey: ['queue'],
    queryFn: () => fetchJson('/api/queue'),
    refetchInterval: 2000,
  });
}

export function useHistory() {
  return useQuery<HistoryItem[]>({
    queryKey: ['history'],
    queryFn: () => fetchJson('/api/history'),
    refetchInterval: 5000,
  });
}

export function usePlaylists() {
  return useQuery<PlaylistSummary[]>({
    queryKey: ['playlists'],
    queryFn: () => fetchJson('/api/playlists'),
  });
}

export function usePlaylistDetail(encodedUri: string) {
  return useInfiniteQuery<PlaylistDetail>({
    queryKey: ['playlists', encodedUri],
    queryFn: ({ pageParam }) =>
      fetchJson(`/api/playlists/${encodedUri}?offset=${pageParam}&limit=${TRACK_LIMIT}`),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.offset + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },
    enabled: encodedUri.length > 0,
  });
}

export function useTidalMixes() {
  return useQuery<TidalMixSummary[]>({
    queryKey: ['tidal', 'mixes'],
    queryFn: () => fetchJson('/api/tidal/mixes'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTidalMixDetail(encodedUri: string) {
  return useInfiniteQuery<TidalMixDetail>({
    queryKey: ['tidal', 'mixes', encodedUri],
    queryFn: ({ pageParam }) =>
      fetchJson(`/api/tidal/mixes/${encodedUri}?offset=${pageParam}&limit=${TRACK_LIMIT}`),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.offset + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },
    enabled: encodedUri.length > 0,
  });
}

export function useSearch(q: string) {
  return useInfiniteQuery<SearchResults>({
    queryKey: ['search', q],
    queryFn: ({ pageParam }) =>
      fetchJson(`/api/search?q=${encodeURIComponent(q)}&offset=${pageParam}&limit=${TRACK_LIMIT}`),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.offset + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },
    enabled: q.length > 0,
  });
}

export function useAllTracks() {
  return useInfiniteQuery<SearchResults>({
    queryKey: ['tracks'],
    queryFn: ({ pageParam }) =>
      fetchJson(`/api/tracks?offset=${pageParam}&limit=${TRACK_LIMIT}`),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.offset + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },
  });
}
