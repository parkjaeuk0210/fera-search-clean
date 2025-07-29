import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/components/SearchResults';
import { FollowUpInput } from '@/components/FollowUpInput';
import { SearchHistory } from '@/components/SearchHistory';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SourceList } from '@/components/SourceList';
import { useSearchHistory } from '@/hooks/useSearchHistory';

export function Search() {
  const [location, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentResults, setCurrentResults] = useState<any>(null);
  const [originalQuery, setOriginalQuery] = useState<string | null>(null);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState<string | null>(null);
  
  // Search history hook
  const {
    history,
    createSession,
    addToSession,
    getCurrentSession,
    setCurrentSession,
    deleteSession,
    clearHistory,
    getConversationHistory,
  } = useSearchHistory();
  
  // Extract query from URL, handling both initial load and subsequent navigation
  const getQueryFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('q') || '';
  };
  
  const [searchQuery, setSearchQuery] = useState(getQueryFromUrl);
  const [refetchCounter, setRefetchCounter] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery, refetchCounter],
    queryFn: async () => {
      if (!searchQuery) return null;
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      const result = await response.json();
      console.log('Search API Response:', JSON.stringify(result, null, 2));
      
      // Create new session in local storage
      const session = createSession(searchQuery, result.summary, result.sources);
      setSessionId(session.id);
      setCurrentResults(result);
      if (!originalQuery) {
        setOriginalQuery(searchQuery);
      }
      setIsFollowUp(false);
      
      return result;
    },
    enabled: !!searchQuery,
  });

  // Follow-up mutation
  const followUpMutation = useMutation({
    mutationFn: async (followUpQuery: string) => {
      if (!sessionId) {
        const response = await fetch(`/api/search?q=${encodeURIComponent(followUpQuery)}`);
        if (!response.ok) throw new Error('Search failed');
        const result = await response.json();
        console.log('New Search API Response:', JSON.stringify(result, null, 2));
        
        // Create new session if no session exists
        const session = createSession(followUpQuery, result.summary, result.sources);
        setSessionId(session.id);
        setOriginalQuery(searchQuery);
        setIsFollowUp(false);
        
        return result;
      }

      // Get conversation history for context
      const conversationHistory = getConversationHistory(sessionId);
      
      const response = await fetch('/api/follow-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: followUpQuery,
          conversationHistory,
        }),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          const newResponse = await fetch(`/api/search?q=${encodeURIComponent(followUpQuery)}`);
          if (!newResponse.ok) throw new Error('Search failed');
          const result = await newResponse.json();
          console.log('Fallback Search API Response:', JSON.stringify(result, null, 2));
          
          // Create new session for the fallback search
          const session = createSession(followUpQuery, result.summary, result.sources);
          setSessionId(session.id);
          setOriginalQuery(searchQuery);
          setIsFollowUp(false);
          
          return result;
        }
        throw new Error('Follow-up failed');
      }
      
      const result = await response.json();
      console.log('Follow-up API Response:', JSON.stringify(result, null, 2));
      
      // Add to session history
      if (sessionId) {
        addToSession(sessionId, followUpQuery, result.summary, result.sources);
      }
      
      return result;
    },
    onSuccess: (result) => {
      setCurrentResults(result);
      setIsFollowUp(true);
    },
  });

  const handleSearch = async (newQuery: string) => {
    if (newQuery === searchQuery) {
      // If it's the same query, increment the refetch counter to trigger a new search
      setRefetchCounter(c => c + 1);
    } else {
      setSessionId(null); // Clear session on new search
      setOriginalQuery(null); // Clear original query
      setIsFollowUp(false); // Reset follow-up state
      setSearchQuery(newQuery);
    }
    // Update URL without triggering a page reload
    const newUrl = `/search?q=${encodeURIComponent(newQuery)}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleFollowUp = async (newFollowUpQuery: string) => {
    setFollowUpQuery(newFollowUpQuery);
    await followUpMutation.mutateAsync(newFollowUpQuery);
  };

  // Automatically start search when component mounts or URL changes
  useEffect(() => {
    const query = getQueryFromUrl();
    if (query && query !== searchQuery) {
      setSessionId(null); // Clear session on URL change
      setOriginalQuery(null); // Clear original query
      setIsFollowUp(false); // Reset follow-up state
      setSearchQuery(query);
    }
  }, [location]);

  // Use currentResults if available, otherwise fall back to data from useQuery
  const displayResults = currentResults || data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen relative overflow-hidden safe-area-padding"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-bg-light dark:gradient-bg opacity-50" />
      
      {/* Floating orbs for decoration - smaller on mobile */}
      <div className="absolute top-10 right-10 w-32 sm:w-48 h-32 sm:h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-40 animate-float" />
      <div className="absolute bottom-20 left-10 sm:left-20 w-48 sm:w-64 h-48 sm:h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 sm:opacity-40 animate-float" style={{ animationDelay: '3s' }} />
      
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto p-3 sm:p-4 relative z-10"
      >
        <motion.div 
          className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/')}
            className="glass-button glass-hover rounded-xl touch-target touch-feedback flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="w-full max-w-2xl flex-1">
            <SearchInput
              onSearch={handleSearch}
              initialValue={searchQuery}
              isLoading={isLoading}
              autoFocus={false}
              large={false}
            />
          </div>
          
          <SearchHistory
            sessions={history.sessions}
            currentSessionId={history.currentSessionId}
            onSelectSession={(session) => {
              // Load session and display the conversation
              setSessionId(session.id);
              setCurrentSession(session.id);
              setOriginalQuery(session.originalQuery);
              
              // Display the latest conversation from the session
              const lastConversation = session.conversations[session.conversations.length - 1];
              setCurrentResults({
                summary: lastConversation.response,
                sources: lastConversation.sources,
              });
              
              // Update the search input with the original query
              setSearchQuery(session.originalQuery);
              setIsFollowUp(session.conversations.length > 1);
              if (session.conversations.length > 1) {
                setFollowUpQuery(lastConversation.query);
              }
            }}
            onDeleteSession={deleteSession}
            onClearHistory={clearHistory}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-stretch"
          >
            <SearchResults
              query={isFollowUp ? (followUpQuery || '') : searchQuery}
              results={displayResults}
              isLoading={isLoading || followUpMutation.isPending}
              error={error || followUpMutation.error || undefined}
              isFollowUp={isFollowUp}
              originalQuery={originalQuery || ''}
            />

            {displayResults && !isLoading && !followUpMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-6 max-w-2xl"
              >
                <FollowUpInput
                  onSubmit={handleFollowUp}
                  isLoading={followUpMutation.isPending}
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}