import { useEffect, useRef, useState } from 'react';
import { Film, Music, ChevronLeft, ChevronRight } from 'lucide-react';

type Recommendation = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  reason?: string;
  type: 'song' | 'movie';
  spotifyId?: string;
};

type SwipeCardProps = {
  recommendation: Recommendation;
  onSwipe?: (direction: 'left' | 'right') => void;
  onSwipeMove?: (direction: 'left' | 'right' | null) => void;
  style?: React.CSSProperties;
  zIndex: number;
  canSwipeLeft?: boolean;
};

export default function SwipeCard({
  recommendation,
  onSwipe,
  onSwipeMove,
  style,
  zIndex,
  canSwipeLeft = true,
}: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- Mouse handlers ---
  const handleMouseDown = (e) => {
    e.preventDefault();
    if (isExiting || isBouncing || !onSwipe) return;
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isExiting || isBouncing || !onSwipe) return;
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging || isExiting || isBouncing || !onSwipe) return;
    finishDrag();
  };

  // --- Touch handlers ---
  const handleTouchStart = (e) => {
    if (isExiting || isBouncing || !onSwipe) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPosition({ x: touch.clientX, y: touch.clientY });
    setPosition({ x: 0, y: 0 });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isExiting || isBouncing || !onSwipe) return;
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isExiting || isBouncing || !onSwipe) return;
    finishDrag();
  };

  // --- Shared drag logic ---
  function handleDragMove(clientX: number, clientY: number) {
    const deltaX = clientX - startPosition.x;
    const deltaY = clientY - startPosition.y;
    let resistedX = deltaX;
    if (deltaX < 0 && !canSwipeLeft) {
      resistedX = Math.max(deltaX * 0.2, -50);
    }
    setPosition({ x: resistedX, y: deltaY });
    if (onSwipeMove) {
      if (Math.abs(resistedX) > 10) {
        const direction = resistedX > 0 ? 'right' : 'left';
        onSwipeMove(direction);
      } else {
        onSwipeMove(null);
      }
    }
  }

  function finishDrag() {
    setIsDragging(false);
    if (onSwipeMove) onSwipeMove(null);
    const threshold = 100;
    const absX = Math.abs(position.x);
    if (absX > threshold) {
      const direction = position.x > 0 ? 'right' : 'left';
      if (direction === 'left' && !canSwipeLeft) {
        triggerBounceEffect(direction);
        return;
      }
      const exitX =
        direction === 'right' ? window.innerWidth : -window.innerWidth;
      setIsExiting(true);
      setPosition({ x: exitX, y: position.y });
      setTimeout(() => {
        onSwipe(direction);
      }, 250);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  }

  // Trigger bounce effect for blocked swipes
  function triggerBounceEffect(direction) {
    setIsBouncing(true);
    const bounceDistance = direction === 'left' ? -40 : 40;
    setPosition({ x: bounceDistance, y: 0 });
    if (cardRef.current) cardRef.current.classList.add('animate-shake');
    setTimeout(() => {
      setPosition({ x: 0, y: 0 });
      setTimeout(() => {
        setIsBouncing(false);
        if (cardRef.current) cardRef.current.classList.remove('animate-shake');
      }, 300);
    }, 100);
  }

  // Global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [
    isDragging,
    startPosition.x,
    startPosition.y,
    position.x,
    canSwipeLeft,
    onSwipe,
    onSwipeMove,
  ]);

  const rotation = position.x * 0.08; // Slightly less rotation for smoother feel
  const opacity = Math.max(0.8, 1 - Math.abs(position.x) / 300); // Adjusted opacity curve

  // Calculate swipe direction indicators
  const showLeftIndicator = position.x < -30 && canSwipeLeft;
  const showRightIndicator = position.x > 30;
  const showBlockedIndicator = position.x < -20 && !canSwipeLeft;

  return (
    <>
      <div
        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] sm:max-w-sm flex items-center justify-center p-4'
        style={{ zIndex }}
      >
        <div
          ref={cardRef}
          className={`relative w-full max-w-[90vw] sm:max-w-sm max-h-[80vh] select-none transition-transform ${
            onSwipe
              ? isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-default'
          } ${!onSwipe ? 'animate-fadeIn' : ''}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
            opacity,
            transition: isDragging
              ? 'none'
              : isExiting
              ? 'all 0.25s ease-out'
              : isBouncing
              ? 'all 0.3s ease-out'
              : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            ...style,
          }}
          onMouseDown={onSwipe ? handleMouseDown : undefined}
          onTouchStart={onSwipe ? handleTouchStart : undefined}
        >
          <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden relative'>
            {/* Swipe direction indicators */}
            {showLeftIndicator && (
              <div className='absolute inset-0 bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl flex items-center justify-center z-10'>
                <div className='bg-blue-500/20 px-4 py-2 rounded-full backdrop-blur-sm border border-blue-400/30 flex items-center gap-2'>
                  <ChevronLeft
                    size={20}
                    className='text-blue-100 drop-shadow-sm'
                  />
                  <span className='text-blue-100 font-medium text-sm drop-shadow-sm'>
                    Previous
                  </span>
                </div>
              </div>
            )}

            {showRightIndicator && (
              <div className='absolute inset-0 bg-green-500/10 border-2 border-green-500/30 rounded-2xl flex items-center justify-center z-10'>
                <div className='bg-green-500/20 px-4 py-2 rounded-full backdrop-blur-sm border border-green-400/30 flex items-center gap-2'>
                  <span className='text-green-100 font-medium text-sm drop-shadow-sm'>
                    Next
                  </span>
                  <ChevronRight
                    size={20}
                    className='text-green-100 drop-shadow-sm'
                  />
                </div>
              </div>
            )}

            {/* Blocked swipe overlay */}
            {showBlockedIndicator && (
              <div className='absolute inset-0 bg-red-500/10 border-2 border-red-500/30 rounded-2xl flex items-center justify-center z-10'>
                <div className='bg-red-500/20 px-4 py-2 rounded-full backdrop-blur-sm border border-red-400/30 flex items-center gap-2'>
                  <span className='text-red-100 font-medium text-sm drop-shadow-sm'>
                    Can't go back
                  </span>
                </div>
              </div>
            )}

            <div className='relative h-48 sm:h-64 w-full bg-gray-100 flex items-center justify-center'>
              {recommendation.imageUrl ? (
                <img
                  src={recommendation.imageUrl}
                  alt={`Cover for ${recommendation.title}`}
                  className='w-full h-full object-cover'
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextSibling instanceof HTMLElement) {
                      target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div
                className='flex-col items-center justify-center h-full w-full text-gray-400 absolute inset-0'
                style={{ display: recommendation.imageUrl ? 'none' : 'flex' }}
              >
                {recommendation.type === 'song' ? (
                  <Music size={48} />
                ) : (
                  <Film size={48} />
                )}
                <span className='mt-3 text-lg text-center px-4 font-medium'>
                  {recommendation.title}
                </span>
                <span className='text-sm text-gray-400 mt-1'>
                  (No cover available)
                </span>
              </div>
            </div>

            <div className='p-4 sm:p-6'>
              <div className='flex items-center mb-4'>
                <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-xl'>
                  {recommendation.type}
                </span>
              </div>

              <h3 className='font-bold text-gray-900 text-lg sm:text-xl leading-tight mb-3'>
                {recommendation.title}
              </h3>

              {recommendation.subtitle && (
                <p className='text-gray-600 text-sm sm:text-base mb-4'>
                  {recommendation.subtitle}
                </p>
              )}

              {recommendation.reason && (
                <div className='border-l-4 border-blue-400 pl-4 mb-4 rounded-r-lg'>
                  <p className='text-gray-700 italic text-sm leading-relaxed'>
                    "{recommendation.reason}"
                  </p>
                </div>
              )}

              {recommendation.type === 'song' && recommendation.spotifyId && (
                <div className='mt-4'>
                  <iframe
                    style={{ borderRadius: '16px' }}
                    src={`https://open.spotify.com/embed/track/${recommendation.spotifyId}?utm_source=generator&theme=0`}
                    width='100%'
                    height='120'
                    className='sm:h-[152px] h-[120px]'
                    frameBorder='0'
                    allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                    loading='lazy'
                  />
                </div>
              )}

              {/* Swipe indicators - only show for active cards
              {onSwipe && (
                <div className='flex justify-center items-center'>
                  <div className='text-xs bg-gray-50 px-2 py-1 rounded-full'>
                    <span className='text-gray-500'>Swipe to navigate</span>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
