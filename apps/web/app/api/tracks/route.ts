import { NextResponse } from 'next/server';
import { searchTracks } from '@/lib/audio/search';
import { toAudioError } from '@/lib/audio/errors';

const LIMIT = 50;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const offset = Math.max(0, Number(searchParams.get('offset')) || 0);
    const limit = Math.min(LIMIT, Math.max(1, Number(searchParams.get('limit')) || LIMIT));

    const data = await searchTracks('', offset, limit);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    const { body, status } = toAudioError(err);
    return NextResponse.json(body, { status });
  }
}
