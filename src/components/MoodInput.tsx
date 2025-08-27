import { useState, useEffect, useRef } from 'react';
import { moodKeywords } from '@/data/mood-keywords';

type MoodInputTypes = {
  handleEnter: (inputString: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  onInputChange?: (inputString: string) => void;
  onSuggestionsVisibility?: (isVisible: boolean) => void;
};

export default function MoodInput({
  handleEnter,
  placeholder,
  isLoading,
  className,
  onInputChange,
  onSuggestionsVisibility,
}: MoodInputTypes) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Don't show suggestions when user is selecting from dropdown
    if (isSelecting) return;

    if (input.trim()) {
      const filtered = moodKeywords
        .filter((keyword) =>
          keyword.toLowerCase().includes(input.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(filtered);
      const shouldShow = filtered.length > 0;
      setShowSuggestions(shouldShow);
      onSuggestionsVisibility?.(shouldShow);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
      onSuggestionsVisibility?.(false);
    }
  }, [input, onSuggestionsVisibility, isSelecting]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        handleEnter(input);
        setInput('');
        onInputChange?.('');
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selectedSuggestion = suggestions[selectedIndex];
          console.log('selectedSuggestion: ', selectedSuggestion);
          // Set selecting flag to prevent useEffect from interfering
          setIsSelecting(true);
          // First, update input to show selected suggestion
          setInput(selectedSuggestion);
          onInputChange?.(selectedSuggestion);
          setShowSuggestions(false);
          onSuggestionsVisibility?.(false);

          // Brief delay to let user see the selected word, then trigger search
          setTimeout(() => {
            handleEnter(selectedSuggestion);
            // Clear input after triggering search
            setTimeout(() => {
              setInput('');
              onInputChange?.('');
              setIsSelecting(false);
            }, 100);
          }, 200);
        } else {
          handleEnter(input);
          setInput('');
          onInputChange?.('');
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        onSuggestionsVisibility?.(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('handleSuggestionClick');
    // Set selecting flag to prevent useEffect from interfering
    setIsSelecting(true);
    // First, update input to show selected suggestion
    setInput(suggestion);
    onInputChange?.(suggestion);
    setShowSuggestions(false);
    onSuggestionsVisibility?.(false);

    // Brief delay to let user see the selected word, then trigger search
    setTimeout(() => {
      handleEnter(suggestion);
      // Clear input after triggering search
      setTimeout(() => {
        setInput('');
        onInputChange?.('');
        setIsSelecting(false);
      }, 100);
    }, 200);
  };

  return (
    <div className='relative'>
      <input
        ref={inputRef}
        type='text'
        placeholder={placeholder}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          onInputChange?.(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (input.trim() && suggestions.length > 0) {
            setShowSuggestions(true);
            onSuggestionsVisibility?.(true);
          }
        }}
        onBlur={(e) => {
          setTimeout(() => {
            if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
              setShowSuggestions(false);
              onSuggestionsVisibility?.(false);
            }
          }, 100);
        }}
        className={`w-full bg-white/25 backdrop-blur-md border-2 border-white/40 rounded-2xl px-6 py-4 text-white font-medium text-center placeholder-white/85 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 focus:border-white/60 transition-all duration-300 disabled:opacity-50 drop-shadow-sm ${className}`}
        disabled={isLoading}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className='mt-4 bg-transparent rounded-xl overflow-hidden max-h-48 overflow-y-auto scrollbar-hide'
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-6 py-3 text-white cursor-pointer transition-all duration-200 rounded-xl mb-2 ${
                index === selectedIndex
                  ? 'bg-white/20'
                  : 'hover:bg-white/15'
              }`}
              onMouseDown={(e) => {
                // Prevent blur event from firing before click
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
