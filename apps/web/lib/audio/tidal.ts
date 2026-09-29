import type { NormalizedTrack, TidalMixDetail, TidalMixSummary } from '@/lib/audio/contract';
import { createMopidyClient } from '@/lib/mopidy';
import type { MopidyTrackRaw } from '@m7/mopidy';
import 'server-only';

const MIXES_URI = 'tidal:my_mixes';

function normalizeTrack(raw: MopidyTrackRaw): NormalizedTrack {
  return {
    uri: raw.uri,
    name: raw.name ?? 'Unknown track',
    artist: raw.artists?.[0]?.name ?? 'Unknown artist',
    duration: raw.length ?? null,
  };
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHLY_RE = new RegExp(`^(${MONTHS.join('|')}) (\\d{4})$`);

// Mix names look like "Title (artist, artist and more)".
function parseMixName(raw: string): { title: string; subtitle: string } {
  const m = raw.match(/^(.*?)\s*\((.*)\)$/);
  return m ? { title: m[1], subtitle: m[2] } : { title: raw, subtitle: '' };
}

// Sort key: My Most Listened first, then monthly mixes newest-first, then My Mix N.
function mixOrder(title: string): number {
  if (title === 'My Most Listened') return 0;
  const month = title.match(MONTHLY_RE);
  if (month) return 1000 - (Number(month[2]) * 12 + MONTHS.indexOf(month[1])) / 100000;
  return 2000 + Number(title.replace(/\D/g, ''));
}

export async function getTidalMixes(): Promise<TidalMixSummary[]> {
  const mopidy = createMopidyClient();
  const refs = await mopidy.library.browse(MIXES_URI);
  const wanted = refs
    .map((r) => ({ ref: r, ...parseMixName(r.name) }))
    .filter(({ title }) => title === 'My Most Listened' || MONTHLY_RE.test(title) || /^My Mix \d+$/.test(title))
    .sort((a, b) => mixOrder(a.title) - mixOrder(b.title));
  if (wanted.length === 0) return [];

  const images = await mopidy.library.getImages(wanted.map((w) => w.ref.uri)).catch(() => ({}) as Record<string, { uri: string; width?: number | null }[]>);
  return wanted.map(({ ref, title, subtitle }) => {
    const best = [...(images[ref.uri] ?? [])].sort((x, y) => (y.width ?? 0) - (x.width ?? 0))[0];
    return {
      uri: ref.uri,
      name: title,
      subtitle,
      kind: title.startsWith('My Mix ') ? 'mix' : 'history',
      artworkUrl: best?.uri ?? null,
    };
  });
}

export async function getTidalMixDetail(uri: string, offset: number, limit: number): Promise<TidalMixDetail> {
  const mopidy = createMopidyClient();
  const [allRefs, mixes] = await Promise.all([
    mopidy.library.browse(uri),
    mopidy.library.browse(MIXES_URI),
  ]);

  const name = mixes.find((m) => m.uri === uri)?.name ?? '';
  const trackRefs = (allRefs ?? []).filter((r) => r.type === 'track');
  const total = trackRefs.length;
  const pageRefs = trackRefs.slice(offset, offset + limit);
  const pageUris = pageRefs.map((r) => r.uri);
  const nameMap = Object.fromEntries(pageRefs.map((r) => [r.uri, r.name]));

  const lookupResult = pageUris.length > 0 ? await mopidy.library.lookup(pageUris) : {};

  const tracks: NormalizedTrack[] = pageUris.flatMap((trackUri) => {
    const matches = lookupResult[trackUri] ?? [];
    if (matches.length > 0) return [normalizeTrack(matches[0])];
    return [{ uri: trackUri, name: nameMap[trackUri] ?? 'Unknown track', artist: '', duration: null }];
  });

  return { uri, name, tracks, total, offset, limit };
}
