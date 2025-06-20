import React from 'react';

type DotProgressIndicatorProps = {
  totalCards: number;
  currentIndex: number;
  viewedCards: Set<number>;
};

export default function DotProgressIndicator({
  totalCards,
  currentIndex,
  viewedCards,
}: DotProgressIndicatorProps) {
  return (
    <div className='absolute top-8 left-1/2 transform -translate-x-1/2 z-50'>
      <div className='bg-white/25 backdrop-blur-md rounded-2xl px-4 py-3 border-2 border-white/40 shadow-lg'>
        <div className='flex items-center justify-center space-x-2'>
          {Array.from({ length: totalCards }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125 shadow-lg' // Current card - bright and larger
                  : viewedCards.has(index)
                  ? 'bg-white/80 shadow-sm' // Previously viewed cards - semi-bright
                  : 'bg-white/40' // Unviewed cards - dim
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
