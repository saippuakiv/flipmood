import React, { useState } from 'react';
import SwipeCard from './SwipeCard';
import DotProgressIndicator from './DotProgressIndicator';

type Recommendation = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  reason?: string;
  type: 'song' | 'movie';
  spotifyId?: string;
};

type SwipeCardsProps = {
  cards: Recommendation[];
  onSwipe?: (
    direction: 'left' | 'right',
    card: Recommendation,
    index: number
  ) => void;
  onComplete?: () => void;
};

export default function SwipeCards({
  cards,
  onSwipe,
  onComplete,
}: SwipeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCards, setViewedCards] = useState(new Set([0]));
  const stackCount = 1;

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentCard = cards[currentIndex];

    if (direction === 'right') {
      // Swipe right - go to next card
      if (onSwipe) onSwipe(direction, currentCard, currentIndex);

      const nextIndex = currentIndex + 1;

      // Only proceed if there are more cards
      if (nextIndex < cards.length) {
        setCurrentIndex(nextIndex);
        // Mark the new card as viewed
        setViewedCards((prev) => new Set([...prev, nextIndex]));
      } else {
        // We've reached the end
        if (onComplete) {
          onComplete();
        }
      }
    } else if (direction === 'left') {
      // Swipe left - go to previous card (only if not at first card)
      if (currentIndex > 0) {
        if (onSwipe) onSwipe(direction, currentCard, currentIndex);
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        // When going back, we don't need to modify viewedCards since
        // we're going to a previously viewed card
      }
      // If currentIndex === 0, do nothing (prevent swipe left on first card)
    }
  };

  // Track swipe direction for dynamic background
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null
  );

  // Get the visible cards for proper stacking effect
  const getVisibleCards = () => {
    const visibleCardData = [];

    // Always show current card as the top card
    if (currentIndex < cards.length) {
      visibleCardData.push({
        card: cards[currentIndex],
        actualIndex: currentIndex,
        stackIndex: 0,
        isActive: true,
      });
    }

    // Determine which cards to show in background based on swipe direction
    if (swipeDirection === 'left' && currentIndex > 0) {
      // When swiping left, prioritize showing the previous card
      const prevIndex = currentIndex - 1;
      visibleCardData.push({
        card: cards[prevIndex],
        actualIndex: prevIndex,
        stackIndex: 1,
        isActive: false,
        isPrevious: true,
      });

      // Add next card if available and we have space
      if (currentIndex + 1 < cards.length && visibleCardData.length < 3) {
        visibleCardData.push({
          card: cards[currentIndex + 1],
          actualIndex: currentIndex + 1,
          stackIndex: 2,
          isActive: false,
        });
      }
    } else {
      // Default behavior: show next cards behind (for right swipe or no swipe)
      for (let i = 1; i <= 2; i++) {
        const nextIndex = currentIndex + i;
        if (nextIndex < cards.length) {
          visibleCardData.push({
            card: cards[nextIndex],
            actualIndex: nextIndex,
            stackIndex: i,
            isActive: false,
          });
        }
      }

      // Add previous card if available and we have fewer than 3 cards
      if (currentIndex > 0 && visibleCardData.length < 3) {
        const prevIndex = currentIndex - 1;
        visibleCardData.push({
          card: cards[prevIndex],
          actualIndex: prevIndex,
          stackIndex: visibleCardData.length,
          isActive: false,
          isPrevious: true,
        });
      }
    }

    return visibleCardData;
  };

  const visibleCardData = getVisibleCards();

  // If no more cards to show, don't render anything
  if (currentIndex >= cards.length) {
    return null;
  }

  return (
    <div className='relative w-full h-full flex-1 overflow-hidden'>
      {visibleCardData
        .filter(
          (cardData) =>
            cardData.actualIndex >= currentIndex - 1 &&
            cardData.actualIndex <= currentIndex + stackCount
        )
        .map((cardData) => {
          const { card, actualIndex, stackIndex, isActive, isPrevious } =
            cardData;

          // Calculate styling for card stacking effect
          let cardStyle: React.CSSProperties = {};
          let zIndex = visibleCardData.length - stackIndex;

          if (!isActive) {
            const scale = 1 - stackIndex * 0.04;
            let translateY = stackIndex * 8;
            let opacity = 1 - stackIndex * 0.2;

            // For previous cards, make them slightly more transparent and offset differently
            if (isPrevious) {
              opacity = 0.6;
              translateY = stackIndex * 6;
            }
            cardStyle = {
              transform: `scale(${scale}) translateY(${translateY}px)`,
              opacity,
              filter: 'blur(30px)',
              pointerEvents: 'none',
            };
          }

          return (
            <SwipeCard
              key={`card-${actualIndex}-${currentIndex}`} // Include currentIndex to force re-render when navigating
              recommendation={card}
              onSwipe={isActive ? handleSwipe : undefined} // Only active card can be swiped
              onSwipeMove={isActive ? setSwipeDirection : undefined} // Track swipe direction
              style={cardStyle}
              zIndex={zIndex}
              canSwipeLeft={currentIndex > 0} // Pass boundary information
            />
          );
        })}

      {/* Progress indicator */}
      <DotProgressIndicator
        totalCards={cards.length}
        currentIndex={currentIndex}
        viewedCards={viewedCards}
      />
    </div>
  );
}
