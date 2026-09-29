import { NextResponse } from 'next/server';
import { getHistory } from '@/lib/audio/history';
import { toAudioError } from '@/lib/audio/errors';

export async function GET() {
  try {
    const data = await getHistory();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    const { body, status } = toAudioError(err);
    return NextResponse.json(body, { status });
  }
}
