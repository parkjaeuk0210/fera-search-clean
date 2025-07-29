import { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { 
  History, 
  Search, 
  Trash2, 
  MessageSquare,
  Clock,
  X
} from 'lucide-react';
import { SearchSession } from '@/hooks/useSearchHistory';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchHistoryProps {
  sessions: SearchSession[];
  currentSessionId?: string;
  onSelectSession: (session: SearchSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onClearHistory: () => void;
}

export function SearchHistory({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onClearHistory,
}: SearchHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(session => {
    const query = searchQuery.toLowerCase();
    return (
      session.originalQuery.toLowerCase().includes(query) ||
      session.conversations.some(conv => 
        conv.query.toLowerCase().includes(query) ||
        conv.response.toLowerCase().includes(query)
      )
    );
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)}분 전`;
    } else if (diff < 86400000) { // Less than 1 day
      return `${Math.floor(diff / 3600000)}시간 전`;
    } else if (diff < 604800000) { // Less than 1 week
      return `${Math.floor(diff / 86400000)}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const handleSelectSession = (session: SearchSession) => {
    onSelectSession(session);
    setIsOpen(false);
  };

  const HistoryContent = () => (
    <>
      <div className="mt-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="검색 기록 찾기..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 glass"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Sessions List */}
        <ScrollArea className={isMobile ? "h-[50vh]" : "h-[calc(100vh-200px)]"}>
          <AnimatePresence>
            {filteredSessions.length > 0 ? (
              <div className="space-y-3">
                {filteredSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={cn(
                        "p-3 sm:p-4 cursor-pointer transition-all hover:shadow-md glass touch-feedback",
                        currentSessionId === session.id && "ring-2 ring-primary"
                      )}
                      onClick={() => handleSelectSession(session)}
                    >
                      <div className="space-y-2">
                        {/* Original Query */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-sm line-clamp-2 flex-1">
                            {session.originalQuery}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 -mt-1 -mr-2 touch-target"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(session.lastUpdated)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {session.conversations.length} 대화
                          </span>
                        </div>

                        {/* Preview of last conversation */}
                        {session.conversations.length > 1 && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              마지막: {session.conversations[session.conversations.length - 1].query}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? '일치하는 검색이 없습니다' : '아직 검색 기록이 없습니다'}
                </p>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  검색 기록이 여기에 표시됩니다
                </p>
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </>
  );

  // Mobile: Use BottomSheet
  if (isMobile) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(true)}
          className="relative glass touch-target touch-feedback"
          title="검색 기록"
        >
          <History className="h-5 w-5" />
          {sessions.length > 0 && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
          )}
        </Button>
        
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="검색 기록"
        >
          {sessions.length > 0 && (
            <div className="flex justify-end -mt-8 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearHistory}
                className="text-destructive hover:text-destructive/80"
              >
                모두 삭제
              </Button>
            </div>
          )}
          <HistoryContent />
        </BottomSheet>
      </>
    );
  }

  // Desktop: Use Sheet
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative glass"
          title="검색 기록"
        >
          <History className="h-5 w-5" />
          {sessions.length > 0 && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md glass">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <History className="h-5 w-5" />
              검색 기록
            </span>
            {sessions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearHistory}
                className="text-destructive hover:text-destructive/80"
              >
                모두 삭제
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <HistoryContent />
      </SheetContent>
    </Sheet>
  );
}