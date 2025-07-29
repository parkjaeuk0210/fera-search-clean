import { Card } from '@/components/ui/card';
import { ExternalLink, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  return (
    <div className="animate-in fade-in-50">
      <ScrollArea className="w-full whitespace-nowrap rounded-md touch-pan-x">
        <motion.div 
          className="flex space-x-2 sm:space-x-3 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, staggerChildren: 0.1 }}
        >
          {sources.map((source, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="shrink-0"
            >
              <Card 
                className="w-[240px] sm:w-[280px] group overflow-hidden transition-all hover:shadow-md cursor-pointer bg-card/50 hover:bg-card touch-feedback"
                onClick={() => window.open(source.url, '_blank')}
              >
                <div className="p-3 sm:p-4 hover:bg-muted/30 touch-manipulation">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-xs sm:text-sm text-foreground line-clamp-1 mb-1">
                        {source.title.replace(/\*\*/g, '')}
                      </h3>

                      {source.snippet && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                          {source.snippet.replace(/\*\*/g, '')}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                        <span className="truncate max-w-[150px] sm:max-w-[200px]">
                          {new URL(source.url).hostname.replace('www.', '')}
                        </span>
                      </div>
                    </div>

                    <ExternalLink className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-muted-foreground 
                      opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}