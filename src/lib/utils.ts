import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTagFromInput(input: string): string {
  if (!input) return 'happy';

  const cleaned = input.toLowerCase().trim();

  const tagKeywords: { [tag: string]: string[] } = {
    happy: ['happy', 'joy', 'cheer', 'joyful', 'cheerful', 'excited', 'upbeat', 'optimistic', 'content'],
    relaxing: ['relax', 'peace', 'unwind', 'slow', 'chill', 'peaceful', 'tranquil', 'soothing', 'zen'],
    rainy: ['rain', 'sad', 'gray', 'gloom', 'moody', 'stormy', 'melancholic', 'grey', 'overcast'],
    calm: ['calm', 'quiet', 'still', 'serene', 'meditative', 'mindful'],
    focus: ['focus', 'study', 'concentrate', 'work', 'productive', 'sharp'],
    breeze: ['light', 'ease', 'dance', 'twirl', 'breeze', 'air', 'gentle', 'airy', 'flowing', 'dreamy'],
  };

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some((word) => cleaned.includes(word))) {
      return tag;
    }
  }

  return 'happy'; // fallback
}
