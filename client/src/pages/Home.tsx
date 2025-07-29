import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, Sparkles, MousePointerClick, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Home() {
  const [query, setQuery] = useState('');
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-bg-light dark:gradient-bg" />
      
      {/* Floating orbs for decoration - smaller on mobile */}
      <div className="absolute top-20 left-10 md:left-20 w-48 md:w-72 h-48 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 md:opacity-70 animate-float" />
      <div className="absolute bottom-20 right-10 md:right-20 w-48 md:w-72 h-48 md:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 md:opacity-70 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-10 md:left-40 w-48 md:w-72 h-48 md:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 md:opacity-70 animate-float hidden md:block" style={{ animationDelay: '4s' }} />
      
      <div className="w-full max-w-3xl px-4 md:px-6 animate-fade-in relative z-10">
        <div className="glass-card p-6 sm:p-8 md:p-12 touch-feedback">
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <div className="relative mb-4 md:mb-6">
              <Logo className="animate-pulse-soft w-16 h-16 md:w-20 md:h-20" />
              <Sparkles className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 text-yellow-400 animate-float" />
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="w-full">
            <div 
              className="relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Visual cue when input is empty - hidden on mobile */}
              {!query && !isFocused && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none hidden sm:flex">
                  <div className="flex items-center gap-3 animate-pulse">
                    <MousePointerClick className="w-5 h-5 text-muted-foreground/50" />
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="무엇이든 물어보세요..."
                className="w-full px-4 sm:px-6 py-4 md:py-5 text-base md:text-lg rounded-2xl glass-input
                         focus:ring-4 focus:ring-primary/30 outline-none 
                         transition-all duration-300 
                         group-hover:shadow-lg
                         pr-14 touch-target touch-manipulation
                         placeholder:text-muted-foreground/50"
                autoFocus={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <button 
                type="submit"
                disabled={!query.trim()}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl
                         glass-button glass-hover glass-active touch-feedback
                         disabled:opacity-50 disabled:hover:transform-none
                         disabled:hover:shadow-none touch-target"
              >
                <Search className={`w-5 h-5 transition-all duration-300 ${isHovered && query.trim() ? 'text-primary' : 'text-muted-foreground'}`} />
              </button>
              
              {/* Animated arrow hint when hovering - hidden on mobile */}
              {isHovered && !query && (
                <div className="absolute -right-16 top-1/2 -translate-y-1/2 animate-slide-in hidden md:block">
                  <ArrowRight className="w-6 h-6 text-primary/50 animate-pulse" />
                </div>
              )}
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
}
