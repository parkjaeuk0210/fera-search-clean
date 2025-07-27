import { useState, KeyboardEvent } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="relative flex w-full items-center gap-3">
      <div className="relative flex-1 group">
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200",
          large ? "h-5 w-5" : "h-4 w-4",
          isFocused && "text-primary"
        )} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask anything..."
          className={cn(
            "w-full pl-12 pr-4 py-3 glass-input rounded-2xl",
            "transition-all duration-200",
            large && "py-4 text-lg",
            "focus:ring-4 focus:ring-primary/30 outline-none",
            "touch-target"
          )}
          disabled={isLoading}
          autoFocus={autoFocus}
        />
        
        {isFocused && query && (
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-yellow-400 animate-pulse" />
        )}
      </div>

      <button 
        onClick={handleSubmit}
        disabled={!query.trim() || isLoading}
        className={cn(
          "px-6 py-3 rounded-2xl font-medium",
          "glass-button glass-hover glass-active",
          "transition-all duration-200",
          large && "px-8 py-4 text-lg",
          "disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-none",
          "touch-target flex items-center gap-2"
        )}
      >
        {isLoading ? (
          <Loader2 className={cn("animate-spin", large ? "h-5 w-5" : "h-4 w-4")} />
        ) : (
          <>
            <span>Search</span>
            <Sparkles className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}