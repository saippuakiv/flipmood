import { useState } from 'react';

type MoodInputTypes = {
  handleEnter: (inputString: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
};

export default function MoodInput({
  handleEnter,
  placeholder,
  isLoading,
  className,
}: MoodInputTypes) {
  const [input, setInput] = useState('');
  return (
    <div>
      <input
        type='text'
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            //console.log('enter.input: ', input);
            handleEnter(input);
            setInput(''); // Clear input after submitting
          }
        }}
        className={`w-full bg-white/25 backdrop-blur-md border-2 border-white/40 rounded-2xl px-6 py-4 text-white font-medium text-center placeholder-white/85 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 focus:border-white/60 transition-all duration-300 disabled:opacity-50 drop-shadow-sm ${className}`}
        disabled={isLoading}
      />
    </div>
  );
}
