import { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Search, Loader2, Sparkles, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useVirtualKeyboard } from '@/hooks/useVirtualKeyboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  autoFocus?: boolean;
  large?: boolean;
}

export function SearchInput({ 
  onSearch, 
  isLoading = false,
  initialValue = '',
  autoFocus = false,
  large = false,
}: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const { hideKeyboard } = useVirtualKeyboard();
  
  // Speech recognition setup
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechSupported,
    toggleListening,
  } = useSpeechRecognition({
    onResult: (text) => {
      setQuery(text);
    },
    language: 'ko-KR',
  });

  // Update query when transcript changes
  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  // Update initial value
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
      if (isMobile) {
        hideKeyboard();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex w-full items-center gap-2 sm:gap-3">
      <div className="relative flex-1 group">
        <Search className={cn(
          "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200",
          large ? "h-5 w-5" : "h-4 w-4",
          isFocused && "text-primary"
        )} />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isListening ? "듣고 있습니다..." : "무엇이든 물어보세요..."}
          className={cn(
            "w-full pl-9 sm:pl-12 pr-10 sm:pr-12 py-3 glass-input rounded-2xl",
            "transition-all duration-200",
            large && "py-4 text-lg",
            "focus:ring-4 focus:ring-primary/30 outline-none",
            "touch-target touch-manipulation",
            "placeholder:text-muted-foreground/50",
            isListening && "ring-2 ring-red-500/50"
          )}
          disabled={isLoading || isListening}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          enterKeyHint="search"
        />
        
        {/* Voice search button for mobile */}
        {isMobile && isSpeechSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg",
              "transition-all duration-200 touch-target",
              isListening 
                ? "text-red-500 bg-red-50 dark:bg-red-900/20" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            {isListening ? (
              <MicOff className="h-4 w-4 animate-pulse" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
        )}
        
        {/* Sparkles for desktop */}
        {!isMobile && isFocused && query && (
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-yellow-400 animate-pulse" />
        )}
        
        {/* Listening indicator with interim transcript */}
        <AnimatePresence>
          {isListening && (interimTranscript || transcript) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 p-3 bg-background/95 backdrop-blur rounded-xl shadow-lg border"
            >
              <p className="text-sm text-muted-foreground">
                {interimTranscript || transcript}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voice search button for desktop */}
      {!isMobile && isSpeechSupported && (
        <button
          type="button"
          onClick={toggleListening}
          className={cn(
            "p-3 rounded-2xl",
            "glass-button glass-hover glass-active touch-feedback",
            "transition-all duration-200",
            large && "p-4",
            "touch-target",
            isListening && "ring-2 ring-red-500/50 bg-red-50 dark:bg-red-900/20"
          )}
        >
          {isListening ? (
            <MicOff className={cn("animate-pulse text-red-500", large ? "h-5 w-5" : "h-4 w-4")} />
          ) : (
            <Mic className={cn(large ? "h-5 w-5" : "h-4 w-4")} />
          )}
        </button>
      )}

      <button 
        onClick={handleSubmit}
        disabled={!query.trim() || isLoading}
        className={cn(
          "px-4 sm:px-6 py-3 rounded-2xl font-medium",
          "glass-button glass-hover glass-active touch-feedback",
          "transition-all duration-200",
          large && "px-6 sm:px-8 py-4 text-lg",
          "disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-none",
          "touch-target flex items-center gap-2",
          "whitespace-nowrap"
        )}
      >
        {isLoading ? (
          <Loader2 className={cn("animate-spin", large ? "h-5 w-5" : "h-4 w-4")} />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}