export async function enrichItem(item) {
  if (item.type === 'song') {
    try {
      const res = await fetch(
        `/api/music/search?title=${encodeURIComponent(
          item.title
        )}&artist=${encodeURIComponent(item.subtitle ?? '')}`
      );
      const data = await res.json();
      return {
        ...item,
        imageUrl: data.imageUrl ?? item.imageUrl,
        previewUrl: data.previewUrl,
        spotifyId: data.spotifyId,
        subtitle: data.artist ?? item.subtitle,
      };
    } catch (error) {
      console.error('Error enriching song:', error);
      return item;
    }
  }

  if (item.type === 'movie') {
    try {
      const res = await fetch(
        `/api/movie/poster?title=${encodeURIComponent(item.title)}&year=${
          item.year ?? ''
        }`
      );
      const data = await res.json();

      if (
        !data.imageUrl ||
        !data.englishTitle ||
        data.englishTitle.includes('Forged')
      ) {
        // fallback
        return {
          ...item,
          imageUrl: `https://placehold.co/300x200?text=${encodeURIComponent(
            item.title
          )}`,
        };
      }

      return {
        ...item,
        imageUrl: data.imageUrl,
        title: data.englishTitle ?? item.title,
      };
    } catch (error) {
      console.error('Error enriching movie:', error);
      return {
        ...item,
        imageUrl: `https://placehold.co/300x200?text=${encodeURIComponent(
          item.title
        )}`,
      };
    }
  }

  return item;
}
