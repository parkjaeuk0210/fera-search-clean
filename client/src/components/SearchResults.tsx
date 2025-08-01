import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { SourceList } from '@/components/SourceList';
import { Logo } from '@/components/Logo';

interface SearchResultsProps {
  query: string;
  results: any;
  isLoading: boolean;
  error?: Error;
  isFollowUp?: boolean;
  originalQuery?: string;
}

export function SearchResults({ 
  query,
  results,
  isLoading,
  error,
  isFollowUp,
  originalQuery
}: SearchResultsProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (results && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results]);

  if (error) {
    return (
      <Alert variant="destructive" className="animate-in fade-in-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message || 'An error occurred while searching. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-in fade-in-50">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Logo animate className="w-12 h-12" />
            <div className="absolute inset-0 w-12 h-12 bg-primary/20 rounded-full animate-ping" />
          </div>
        </div>
        <Card className="p-6">
          <Skeleton className="h-4 w-3/4 mb-4 glass rounded-lg" />
          <Skeleton className="h-4 w-full mb-2 glass rounded-lg" />
          <Skeleton className="h-4 w-full mb-2 glass rounded-lg" />
          <Skeleton className="h-4 w-2/3 glass rounded-lg" />
        </Card>
        <div className="space-y-2">
          <Skeleton className="h-[100px] w-full glass rounded-xl" />
          <Skeleton className="h-[100px] w-full glass rounded-xl" />
        </div>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div ref={contentRef} className="space-y-6 animate-in fade-in-50">
      {/* Search Query Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        {isFollowUp && originalQuery && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground/70">
              <span>원래 검색:</span>
              <span className="font-medium">"{originalQuery}"</span>
            </div>
            <div className="h-px bg-border w-full" />
          </>
        )}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm sm:text-base text-muted-foreground">
          <span>{isFollowUp ? '후속 질문:' : ''}</span>
          <h1 className="font-serif text-fluid-lg sm:text-3xl text-foreground">"{query}"</h1>
        </div>
      </motion.div>

      {/* Sources Section */}
      {results.sources && results.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SourceList sources={results.sources} />
        </motion.div>
      )}

      {/* Main Content */}
      <Card className="overflow-hidden shadow-md touch-feedback">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="py-4 px-4 sm:px-6 md:px-8"
        >
          <div
            className={cn(
              "prose prose-slate max-w-none",
              "dark:prose-invert",
              // Mobile-optimized typography
              "prose-sm sm:prose-base",
              "prose-headings:font-bold prose-headings:mb-3 sm:prose-headings:mb-4",
              "prose-h2:text-lg sm:prose-h2:text-2xl prose-h2:mt-6 sm:prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2 prose-h2:border-border",
              "prose-h3:text-base sm:prose-h3:text-xl prose-h3:mt-4 sm:prose-h3:mt-6",
              "prose-p:text-sm sm:prose-p:text-base prose-p:leading-6 sm:prose-p:leading-7 prose-p:my-3 sm:prose-p:my-4",
              "prose-ul:my-4 sm:prose-ul:my-6 prose-ul:list-disc prose-ul:pl-4 sm:prose-ul:pl-6",
              "prose-li:my-1 sm:prose-li:my-2 prose-li:marker:text-muted-foreground",
              "prose-strong:font-semibold",
              "prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80",
              // Mobile-specific optimizations
              "prose-code:text-xs sm:prose-code:text-sm",
              "prose-pre:text-xs sm:prose-pre:text-sm",
              "prose-blockquote:text-sm sm:prose-blockquote:text-base",
            )}
            dangerouslySetInnerHTML={{ 
              __html: results.summary
            }}
          />
        </motion.div>
      </Card>
    </div>
  );
}