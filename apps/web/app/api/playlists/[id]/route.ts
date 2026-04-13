import { NextResponse } from 'next/server';
import { getPlaylistDetail } from '@/lib/audio/playlists';
import { toAudioError } from '@/lib/audio/errors';
import { decodeUri } from '@/lib/audio/encoding';

const LIMIT = 50;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const offset = Math.max(0, Number(searchParams.get('offset')) || 0);
    const limit = Math.min(LIMIT, Math.max(1, Number(searchParams.get('limit')) || LIMIT));
    const uri = decodeUri(id);
    const data = await getPlaylistDetail(uri, offset, limit);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    const { body, status } = toAudioError(err);
    return NextResponse.json(body, { status });
  }
}
