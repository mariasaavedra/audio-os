import type {
    AudioActionRequest,
    AudioActionResponse,
    AudioSnapshot,
} from './contract';

export async function getAudioSnapshot(): Promise<AudioSnapshot> {
  const res = await fetch('/api/audio');

  if (!res.ok) throw new Error(`Failed: ${res.status}`);

  const json = await res.json();

  if (!json.ok) throw new Error(json.error);

  return json.data;
}

export async function postAudioAction(
  input: AudioActionRequest
): Promise<AudioActionResponse> {
  const res = await fetch('/api/audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const json = await res.json();

  if (!res.ok || !json.ok) {
    throw new Error(json.error ?? 'Request failed');
  }

  return json;
}