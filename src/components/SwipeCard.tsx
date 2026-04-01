import { useEffect, useRef, useState } from 'react';
import { Film, Music, ChevronLeft, ChevronRight, Play, Pause, ExternalLink } from 'lucide-react';

type Recommendation = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  reason?: string;
  type: 'song' | 'movie';
  spotifyId?: string;
  previewUrl?: string;
};

type SwipeCardProps = {
  recommendation: Recommendation;
  onSwipe?: (direction: 'left' | 'right') => void;
  onSwipeMove?: (direction: 'left' | 'right' | null) => void;
  style?: React.CSSProperties;
  zIndex: number;
  canSwipeLeft?: boolean;
  mood?: string;
};

const moodBarColor: Record<string, string> = {
  happy: '#FFA502',
  relaxing: '#A8E6CF',
  rainy: '#74B9FF',
  calm: '#A29BFE',
  focus: '#6C5CE7',
  breeze: '#00CEC9',
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function EqualizerBars({ isPlaying, mood }: { isPlaying: boolean; mood?: string }) {
  const color = moodBarColor[mood ?? ''] ?? '#ffffff';
  return (
    <div className='flex items-center gap-[3px] h-5'>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className='w-[3px] rounded-full'
          style={{
            background: color,
            height: isPlaying ? undefined : '3px',
            animation: isPlaying
              ? `equalizerMirror ${0.35 + i * 0.12}s ease-in-out infinite alternate`
              : 'none',
            transition: 'height 0.2s ease',
          }}
        />
      ))}
    </div>
  );
}

function MusicPlayer({
  previewUrl,
  spotifyId,
  title,
  artist,
  imageUrl,
  mood,
}: {
  previewUrl?: string;
  spotifyId: string;
  title: string;
  artist?: string;
  imageUrl?: string;
  mood?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    // Update timestamp display every second (lightweight)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.pause();
    };
  }, []);

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const remainingDuration = isPlaying && duration ? duration - currentTime : 0;

  return (
    <div className='mt-4 rounded-2xl bg-black/40 p-3 space-y-2'>
      {previewUrl && <audio ref={audioRef} src={previewUrl} preload='metadata' />}

      {/* Album art with play overlay + info + equalizer */}
      <div className='flex items-center gap-3'>
        <div
          className='w-11 h-11 rounded-lg overflow-hidden bg-white/10 shrink-0 relative cursor-pointer group'
          onClick={previewUrl ? togglePlay : undefined}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={title} className='w-full h-full object-cover' draggable={false} />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <Music size={16} className='text-white/40' />
            </div>
          )}
          {previewUrl && (
            <div className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
              {isPlaying ? (
                <Pause size={18} className='text-white' fill='white' />
              ) : (
                <Play size={18} className='text-white ml-0.5' fill='white' />
              )}
            </div>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <div className='text-white text-sm font-semibold truncate'>{title}</div>
          {artist && <div className='text-white/50 text-xs truncate'>{artist}</div>}
        </div>
        <EqualizerBars isPlaying={isPlaying} mood={mood} />
        <a
          href={`https://open.spotify.com/track/${spotifyId}`}
          target='_blank'
          rel='noopener noreferrer'
          className='shrink-0 text-white/40 hover:text-green-400 transition-colors'
          title='Open in Spotify'
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Progress bar */}
      {previewUrl && (
        <div className='space-y-0.5'>
          <div
            className='h-1 bg-white/15 rounded-full overflow-hidden cursor-pointer'
            onClick={handleProgressClick}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div
              className='h-full bg-white/80 rounded-full'
              style={{
                width: isPlaying ? '100%' : `${progress}%`,
                transition: isPlaying
                  ? `width ${remainingDuration}s linear`
                  : 'none',
              }}
            />
          </div>
          <div className='flex justify-between text-[10px] text-white/40'>
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? `-${formatTime(duration - currentTime)}` : '0:00'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SwipeCard({
  recommendation,
  onSwipe,
  onSwipeMove,
  style,
  zIndex,
  canSwipeLeft = true,
  mood,
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
          <div className='bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl transition-shadow duration-300 overflow-hidden relative will-change-transform'
            style={{ transform: 'translateZ(0)' }}
          >
            {/* Swipe direction indicators */}
            {showLeftIndicator && (
              <div className='absolute inset-0 bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl flex items-center justify-center z-10'>
                <div className='bg-blue-500/20 px-4 py-2 rounded-full border border-blue-400/30 flex items-center gap-2'>
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
                <div className='bg-green-500/20 px-4 py-2 rounded-full border border-green-400/30 flex items-center gap-2'>
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
                <div className='bg-red-500/20 px-4 py-2 rounded-full border border-red-400/30 flex items-center gap-2'>
                  <span className='text-red-100 font-medium text-sm drop-shadow-sm'>
                    Can't go back
                  </span>
                </div>
              </div>
            )}

            <div className='relative h-48 sm:h-64 w-full bg-white/5 flex items-center justify-center'>
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
                className='flex-col items-center justify-center h-full w-full text-white/80 absolute inset-0'
                style={{ display: recommendation.imageUrl ? 'none' : 'flex' }}
              >
                {recommendation.type === 'song' ? (
                  <Music size={48} className='drop-shadow-lg' />
                ) : (
                  <Film size={48} className='drop-shadow-lg' />
                )}
                <span className='mt-3 text-lg text-center px-4 font-medium drop-shadow-lg'>
                  {recommendation.title}
                </span>
                <span className='text-sm text-white/60 mt-1 drop-shadow-md'>
                  (No cover available)
                </span>
              </div>
            </div>

            <div className='p-4 sm:p-6 bg-white/20'>
              <div className='flex items-center mb-4'>
                <span className='text-xs font-semibold text-white uppercase tracking-wider bg-white/30 px-3 py-1 rounded-xl shadow-lg'>
                  {recommendation.type}
                </span>
              </div>

              <h3 className='font-bold text-white text-lg sm:text-xl leading-tight mb-3 drop-shadow-lg'>
                {recommendation.title}
              </h3>

              {recommendation.subtitle && (
                <p className='text-white/95 text-sm sm:text-base mb-4 drop-shadow-lg'>
                  {recommendation.subtitle}
                </p>
              )}

              {recommendation.reason && (
                <div className='border-l-4 border-white/50 pl-3 mb-4 rounded-r-lg bg-white/15 py-2'>
                  <p className='text-white/90 italic text-sm leading-relaxed drop-shadow-md'>
                    "{recommendation.reason}"
                  </p>
                </div>
              )}

              {recommendation.type === 'song' && recommendation.spotifyId && (
                <MusicPlayer
                  previewUrl={recommendation.previewUrl}
                  spotifyId={recommendation.spotifyId}
                  title={recommendation.title}
                  artist={recommendation.subtitle}
                  imageUrl={recommendation.imageUrl}
                  mood={mood}
                />
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
