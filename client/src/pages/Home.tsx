import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function Home() {
  const [query, setQuery] = useState('');
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-bg-light dark:gradient-bg" />
      
      {/* Floating orbs for decoration - smaller on mobile */}
      <div className="absolute top-20 left-10 md:left-20 w-48 md:w-72 h-48 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 md:opacity-70 animate-float" />
      <div className="absolute bottom-20 right-10 md:right-20 w-48 md:w-72 h-48 md:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 md:opacity-70 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-10 md:left-40 w-48 md:w-72 h-48 md:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 md:opacity-70 animate-float hidden md:block" style={{ animationDelay: '4s' }} />
      
      <div className="w-full max-w-3xl px-4 md:px-6 animate-fade-in relative z-10">
        <div className="glass-card p-6 sm:p-8 md:p-12 relative">
          <ThemeToggle 
            className={cn(
              isMobile 
                ? "-bottom-16 left-1/2 -translate-x-1/2" 
                : "-top-14 -right-14"
            )} 
          />
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
              
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder=""
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
                         glass-button glass-active touch-feedback
                         transition-all duration-150 ease-out
                         hover:bg-primary/10 hover:shadow-md
                         disabled:opacity-50 disabled:hover:bg-transparent
                         disabled:hover:shadow-none touch-target"
              >
                <Search className={cn(
                  "w-5 h-5 transition-all duration-150 ease-out",
                  isHovered ? "text-primary scale-110" : "text-muted-foreground",
                  !query && !isHovered && "animate-pulse-soft"
                )} />
              </button>
              
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
}
