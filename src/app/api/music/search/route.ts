import { NextRequest } from 'next/server';
import { searchTrackFromSpotify } from '@/lib/spotify-api';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const spotifyPreviewFinder = require('spotify-preview-finder');

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get('title');
  const artist = req.nextUrl.searchParams.get('artist');

  console.log('music search title:', title, 'artist:', artist);

  if (!title) {
    return Response.json({ error: 'Missing title' }, { status: 400 });
  }

  const result = await searchTrackFromSpotify(title, artist ?? undefined);
  console.log('Spotify API search result:', result);

  // If official API didn't return a preview URL, try spotify-preview-finder
  if (result && !result.previewUrl) {
    try {
      const query = artist ? `${title} ${artist}` : title;
      const finderResult = await spotifyPreviewFinder(query, 1);
      if (finderResult.success && finderResult.results?.[0]?.previewUrls?.[0]) {
        result.previewUrl = finderResult.results[0].previewUrls[0];
      }
    } catch (err) {
      console.error('spotify-preview-finder error:', err);
    }
  }

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
