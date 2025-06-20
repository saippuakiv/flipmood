const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchMoviePosterAndTitle(
  title: string,
  year?: number
): Promise<{ imageUrl: string | null; englishTitle?: string }> {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
        title
      )}&api_key=${TMDB_API_KEY}&language=en-US`
    );

    const data = await res.json();
    const results = data?.results ?? [];

    console.log('TMDB raw results:', JSON.stringify(results, null, 2));

    const normalizedInput = title.trim().toLowerCase();

    // Multi-strategy matching priority:
    const result =
      // 1. Exact match for English title + year
      results.find(
        (r: any) =>
          r.release_date?.startsWith(year?.toString() ?? '') &&
          (r.title?.toLowerCase() === normalizedInput ||
            r.original_title?.toLowerCase() === normalizedInput)
      ) ||
      // 2. Fuzzy match for title contains
      results.find(
        (r: any) =>
          r.title?.toLowerCase().includes(normalizedInput) ||
          r.original_title?.toLowerCase().includes(normalizedInput)
      ) ||
      // 3. Fallback to first result
      results[0];

    if (!result) return { imageUrl: null };

    const posterPath = result.poster_path;
    const englishTitle = result.title;

    return {
      imageUrl: posterPath
        ? `https://image.tmdb.org/t/p/w500${posterPath}`
        : null,
      englishTitle,
    };
  } catch (err) {
    console.error('TMDB fetch failed:', err);
    return { imageUrl: null };
  }
}
