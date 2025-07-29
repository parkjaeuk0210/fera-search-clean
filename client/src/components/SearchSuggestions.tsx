import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  suggestions: string[];
  recentSearches: string[];
  isVisible: boolean;
  onSelect: (query: string) => void;
  currentQuery?: string;
}

export function SearchSuggestions({
  suggestions,
  recentSearches,
  isVisible,
  onSelect,
  currentQuery = '',
}: SearchSuggestionsProps) {
  if (!isVisible || (suggestions.length === 0 && recentSearches.length === 0)) {
    return null;
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="font-semibold text-primary">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 z-50"
      >
        <div className="bg-background/95 backdrop-blur-lg border rounded-2xl shadow-lg overflow-hidden">
          {/* Recent searches */}
          {recentSearches.length > 0 && !currentQuery && (
            <div className="p-3 border-b">
              <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Clock className="h-3 w-3" />
                최근 검색
              </h3>
              <div className="space-y-1">
                {recentSearches.slice(0, 3).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(search)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg",
                      "hover:bg-muted/50 transition-colors",
                      "text-sm touch-target",
                      "flex items-center gap-2"
                    )}
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && currentQuery && (
            <div className="p-3">
              <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                추천 검색어
              </h3>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(suggestion)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg",
                      "hover:bg-muted/50 transition-colors",
                      "text-sm touch-target",
                      "flex items-center gap-2"
                    )}
                  >
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">
                      {highlightMatch(suggestion, currentQuery)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}