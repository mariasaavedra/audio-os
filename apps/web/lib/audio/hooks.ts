'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAudioSnapshot, postAudioAction } from './api';
import type { AudioActionRequest } from './contract';

export function useAudio() {
  return useQuery({
    queryKey: ['audio'],
    queryFn: getAudioSnapshot,
    refetchInterval: 2000,
  });
}

export function useAudioAction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: AudioActionRequest) =>
      postAudioAction(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audio'] });
    },
  });
}