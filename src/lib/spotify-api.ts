const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

async function getAccessToken(): Promise<string> {
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  return data.access_token;
}

export async function searchTrackFromSpotify(title: string, artist?: string) {
  try {
    const token = await getAccessToken();
    const query = artist ? `${title} ${artist}` : title;

    const res = await fetch(
      `${SPOTIFY_SEARCH_URL}?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    const track = data.tracks?.items?.[0];

    if (!track) return null;

    return {
      spotifyId: track.id,
      imageUrl: track.album.images?.[0]?.url ?? null,
      previewUrl: track.preview_url ?? null,
      artist: track.artists?.[0]?.name ?? artist ?? null,
    };
  } catch (err) {
    console.error('Spotify API error:', err);
    return null;
  }
}
