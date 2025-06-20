'use client';

import { useEffect, useRef, useState } from 'react';
import SwipeCards from '@/components/SwipeCards';
import MoodInput from '@/components/MoodInput';
import { useRecommendation } from '@/lib/hooks/useRecommendation';
import { RefreshCw, Shuffle } from 'lucide-react';

export default function Home() {
  const [viewMode, setViewMode] = useState<'input' | 'swiping' | 'completed'>(
    'input'
  );

  const { handleRecommend, handleShuffle, results, isLoading, currentTag } =
    useRecommendation();

  const handleGetCards = async (mood?: string) => {
    await handleRecommend(mood);
    setViewMode('swiping');
  };

  const handleSwipe = (direction, card, index) => {};

  const handleComplete = () => {
    setViewMode('completed');
  };

  const handleStartOver = () => {
    setViewMode('swiping');
  };

  const handleNewMood = async (mood: string) => {
    await handleGetCards(mood);
  };

  const handleShuffleCard = async () => {
    setViewMode('swiping');
    await handleShuffle();
  };

  // get classname
  const getMoodClass = (tag: string) => {
    const validTags = ['happy', 'relaxing', 'rainy', 'calm', 'focus', 'breeze'];
    return validTags.includes(tag) ? `tag-${tag}` : 'tag-default';
  };

  return (
    <div className='h-full relative overflow-hidden'>
      {/* aurora layer */}
      <div className='aurora absolute inset-0 z-[-10]' />
      <div
        className={`aurora-overlay absolute inset-0 z-[-5] ${getMoodClass(
          currentTag
        )}`}
      />

      {/* frosted glass */}
      <div className='absolute inset-0 bg-black/5 backdrop-blur-[0.5px] z-0'></div>

      {/* Main Content */}
      <div className='relative z-50 min-h-screen flex flex-col'>
        {/* Input Mode */}
        {viewMode === 'input' && (
          <div className='flex-1 flex items-center justify-center p-8'>
            {isLoading ? (
              <div className='text-center'>
                <div className='w-12 h-12 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto mb-4'></div>
                <p className='text-white font-medium drop-shadow-lg'>
                  finding your vibe...
                </p>
              </div>
            ) : (
              <div className='max-w-md mx-auto text-center'>
                {/* enhanced frosted glass effect for cards */}
                <div className='bg-white/25 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/40 shadow-2xl'>
                  {/* <h1 className='text-3xl text-black mb-8 drop-shadow-sm'>
                      mood flow
                    </h1> */}

                  <div className='space-y-4'>
                    <MoodInput
                      placeholder='how are you feeling?'
                      handleEnter={handleGetCards}
                      isLoading={isLoading}
                    />

                    <button
                      onClick={() => handleGetCards()}
                      disabled={isLoading}
                      className='w-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium drop-shadow-sm px-6 py-4 
                                 rounded-2xl transition-all duration-300 border border-white/30
                                 hover:border-white/50 disabled:opacity-50 hover:shadow-lg hover:scale-[1.02]m'
                    >
                      get cards
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Swiping Mode */}
        {viewMode === 'swiping' && (
          <>
            {isLoading || results.length === 0 ? (
              <div className='flex-1 flex items-center justify-center'>
                <div className='text-center'>
                  <div className='w-12 h-12 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto mb-4'></div>
                  <p className='text-white font-medium drop-shadow-lg'>
                    finding your vibe...
                  </p>
                </div>
              </div>
            ) : (
              <SwipeCards
                cards={results}
                onSwipe={handleSwipe}
                onComplete={handleComplete}
              />
            )}
          </>
        )}

        {/* Completed Mode */}
        {viewMode === 'completed' && (
          <div className='flex-1 flex items-center justify-center p-8'>
            <div className='bg-white/25 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/40 text-center max-w-sm mx-auto shadow-2xl'>
              <div className='text-3xl mb-6'>🌳</div>

              <div className='space-y-4 mb-6'>
                <div className='flex gap-3'>
                  <button
                    onClick={handleStartOver}
                    className='flex-1 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-3 
                 rounded-2xl transition-all duration-300 border border-white/30
                 hover:border-white/50 flex items-center justify-center gap-2 hover:scale-[1.02]'
                  >
                    <RefreshCw className='w-4 h-4' />
                    again
                  </button>

                  <button
                    onClick={handleShuffleCard}
                    className='flex-1 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white/90 px-4 py-3 
                 rounded-2xl transition-all duration-300 border border-white/25
                 hover:border-white/40 flex items-center justify-center gap-2 hover:scale-[1.02]'
                  >
                    <Shuffle className='w-4 h-4' />
                    shuffle
                  </button>
                </div>
              </div>

              <MoodInput
                handleEnter={handleNewMood}
                placeholder='new feeling?'
                className='text-sm'
              />
            </div>
          </div>
        )}

        {/* Minimal footer */}
        {currentTag && viewMode !== 'input' && (
          <div className='absolute bottom-0 left-0 right-0 pb-6 text-center z-50'>
            <div className='bg-white/25 backdrop-blur-md rounded-xl px-4 py-2 inline-block border-2 border-white/40'>
              <span className='text-white/90 text-sm font-medium drop-shadow-sm'>
                {currentTag}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
