import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTagFromInput(input: string): string {
  if (!input) return 'happy';

  const cleaned = input.toLowerCase().trim();

  const tagKeywords: { [tag: string]: string[] } = {
    happy: ['happy', 'joy', 'cheer'],
    relaxing: ['relax', 'peace', 'unwind', 'slow'],
    rainy: ['rain', 'sad', 'gray', 'gloom', 'moody'],
    calm: ['calm', 'quiet', 'still'],
    focus: ['focus', 'study', 'concentrate'],
    breeze: ['light', 'ease', 'dance', 'twirl', 'breeze', 'air'],
  };

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some((word) => cleaned.includes(word))) {
      return tag;
    }
  }

  return 'happy'; // fallback
}
