import { useState } from 'react';
import { getTagFromInput } from '../utils';
import { moodRecommendations } from '../mood-mapping';
import { enrichItem } from '@/lib/enrichItem';

export function useRecommendation() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');

  const handleRecommend = async (mood: string) => {
    //console.log('handleRecommend', mood);
    setIsLoading(true);
    setResults([]);

    try {
      const tag = getTagFromInput(mood);
      setCurrentTag(tag);
      const all = moodRecommendations[tag] || [];
      const enriched = await Promise.all(all.map(enrichItem));
      setResults(enriched);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffle = async () => {
    //clear states
    setResults([]);
    setIsLoading(true);

    const availableTags = Object.keys(moodRecommendations);
    const otherTags = availableTags.filter((tag) => tag !== currentTag);
    const tagsToChooseFrom = otherTags.length > 0 ? otherTags : availableTags;
    const randomTag =
      tagsToChooseFrom[Math.floor(Math.random() * tagsToChooseFrom.length)];

    await handleRecommend(randomTag);
  };

  return {
    isLoading,
    results,
    currentTag,
    handleRecommend,
    handleShuffle,
    setResults,
    setCurrentTag,
  };
}
