import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/audio/queue';
import { toAudioError } from '@/lib/audio/errors';

export async function GET() {
  try {
    const data = await getQueue();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    const { body, status } = toAudioError(err);
    return NextResponse.json(body, { status });
  }
}
