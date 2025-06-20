export type Recommendation = {
  type: 'song' | 'movie';
  title: string;
  subtitle?: string;
  reason: string;
  imageUrl?: string;
  previewUrl?: string;
  spotifyId?: string;
  year?: number;
};
