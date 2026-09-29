import { NextResponse } from 'next/server';
import { getTidalMixes } from '@/lib/audio/tidal';
import { toAudioError } from '@/lib/audio/errors';

export async function GET() {
  try {
    const data = await getTidalMixes();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    const { body, status } = toAudioError(err);
    return NextResponse.json(body, { status });
  }
}
