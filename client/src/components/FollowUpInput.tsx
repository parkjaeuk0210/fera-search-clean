import { useState, KeyboardEvent } from 'react';
import { MessageSquarePlus, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowUpInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
}

export function FollowUpInput({ 
  onSubmit,
  isLoading = false,
}: FollowUpInputProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquarePlus className="h-5 w-5 text-primary" />
        <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
        {/* Optional: Typing animation dots */}
        {!query && !isFocused && (
          <div className="animate-typing-dots text-muted-foreground/50 ml-auto">
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </div>
        )}
      </div>
      
      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? "" : "..."} // Hide placeholder when focused
            className={cn(
              "w-full px-4 py-3 glass-input rounded-xl",
              "transition-all duration-200",
              "focus:ring-4 focus:ring-primary/30 outline-none",
              "placeholder:text-muted-foreground/50",
              "touch-target",
              !isFocused && !query && "animate-input-glow" // Glow effect when empty and not focused
            )}
            disabled={isLoading}
          />
          {isFocused && query && (
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-yellow-400 animate-pulse" />
          )}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className={cn(
            "px-6 py-3 rounded-xl font-medium",
            "glass-button glass-hover glass-active",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-none",
            "touch-target flex items-center gap-2 w-full sm:w-auto justify-center"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Ask</span>
              <Sparkles className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
} 