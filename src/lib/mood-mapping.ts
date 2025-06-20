import data from '@data/enriched-mood-mapping.json';
import type { Recommendation } from '@/lib/types';

export const moodRecommendations = data as Record<string, Recommendation[]>;
