import { NextRequest } from 'next/server';
import { searchTrackFromSpotify } from '@/lib/spotify-api';

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get('title');
  const artist = req.nextUrl.searchParams.get('artist');

  console.log('music search title:', title, 'artist:', artist);

  if (!title) {
    return Response.json({ error: 'Missing title' }, { status: 400 });
  }

  const result = await searchTrackFromSpotify(title, artist ?? undefined);
  console.log('Spotify API search result:', result);

  return Response.json(
    result ?? {
      imageUrl: `https://placehold.co/300x200?text=${encodeURIComponent(
        title
      )}`,
      previewUrl: null,
      artist: artist ?? null,
    }
  );
}
