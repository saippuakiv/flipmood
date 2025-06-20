import { searchTrackFromSpotify } from '@/lib/spotify-api';
import { fetchMoviePosterAndTitle } from '@/lib/tmdb';
import fs from 'fs';
import path from 'path';
import { rawRecommendations } from '../data/raw-recommendations';

type RawItem = {
  type: 'song' | 'movie';
  title: string;
  subtitle?: string;
  reason: string;
};

type EnrichedItem = RawItem & {
  imageUrl?: string;
  previewUrl?: string;
  spotifyId?: string;
};

async function enrichOne(item: RawItem): Promise<EnrichedItem> {
  if (item.type === 'song') {
    const result = await searchTrackFromSpotify(item.title, item.subtitle);
    return {
      ...item,
      imageUrl:
        result?.imageUrl ??
        `https://placehold.co/300x200?text=${encodeURIComponent(item.title)}`,
      previewUrl: result?.previewUrl ?? null,
      spotifyId: result?.spotifyId ?? null,
      subtitle: result?.artist ?? item.subtitle,
    };
  }

  if (item.type === 'movie') {
    const result = await fetchMoviePosterAndTitle(item.title, item.year);
    return {
      ...item,
      imageUrl:
        result.imageUrl ??
        `https://placehold.co/300x200?text=${encodeURIComponent(item.title)}`,
      subtitle: result?.englishTitle ?? item.subtitle,
    };
  }

  return item;
}

async function run() {
  const enriched: Record<string, EnrichedItem[]> = {};

  for (const tag in rawRecommendations) {
    const group = rawRecommendations[tag];
    enriched[tag] = [];

    for (const item of group) {
      console.log(`Enriching [${tag}] "${item.title}"...`);
      const enrichedItem = await enrichOne(item);
      enriched[tag].push(enrichedItem);
    }
  }

  const outPath = path.resolve(__dirname, '../data/enriched-mood-mapping.json');
  fs.writeFileSync(outPath, JSON.stringify(enriched, null, 2));
  console.log(`Finished! Output written to ${outPath}`);
}

run();
