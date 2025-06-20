import { NextRequest } from 'next/server';
import { fetchMoviePosterAndTitle } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get('title');
  const year = req.nextUrl.searchParams.get('year');

  if (!title) return Response.json({ error: 'Missing title' }, { status: 400 });

  const parsedYear = year ? parseInt(year) : undefined;

  console.log(`movie API request: title="${title}", year=${parsedYear}`);

  const result = await fetchMoviePosterAndTitle(title, parsedYear);

  return Response.json(
    result ?? {
      imageUrl: `https://placehold.co/300x200?text=${encodeURIComponent(
        title
      )}`,
    }
  );
}
