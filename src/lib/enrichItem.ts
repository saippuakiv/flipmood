// All static data (imageUrl, spotifyId, title, etc.) comes from
// enriched-mood-mapping.json. Only fetch the preview URL at runtime
// since Spotify preview URLs expire and can't be cached statically.
export async function enrichItem(item) {
  if (item.type === 'song' && item.spotifyId && !item.previewUrl) {
    try {
      const res = await fetch(
        `/api/music/search?title=${encodeURIComponent(
          item.title
        )}&artist=${encodeURIComponent(item.subtitle ?? '')}`
      );
      const data = await res.json();
      return {
        ...item,
        previewUrl: data.previewUrl ?? null,
      };
    } catch (error) {
      console.error('Error fetching preview URL:', error);
      return item;
    }
  }

  return item;
}
