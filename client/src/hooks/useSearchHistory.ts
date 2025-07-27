import { useState, useEffect, useCallback } from 'react';

export interface ConversationEntry {
  query: string;
  response: string;
  sources: any[];
  timestamp: number;
}

export interface SearchSession {
  id: string;
  originalQuery: string;
  conversations: ConversationEntry[];
  createdAt: number;
  lastUpdated: number;
}

export interface SearchHistory {
  sessions: SearchSession[];
  currentSessionId?: string;
}

const STORAGE_KEY = 'fera-search-history';
const MAX_SESSIONS = 50; // Maximum number of sessions to keep

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistory>({
    sessions: [],
  });

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // Create a new search session
  const createSession = useCallback((query: string, response: string, sources: any[]) => {
    const newSession: SearchSession = {
      id: Math.random().toString(36).substring(7),
      originalQuery: query,
      conversations: [{
        query,
        response,
        sources,
        timestamp: Date.now(),
      }],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };

    setHistory(prev => {
      const sessions = [newSession, ...prev.sessions];
      // Keep only the most recent sessions
      if (sessions.length > MAX_SESSIONS) {
        sessions.splice(MAX_SESSIONS);
      }
      return {
        sessions,
        currentSessionId: newSession.id,
      };
    });

    return newSession;
  }, []);

  // Add a follow-up to an existing session
  const addToSession = useCallback((sessionId: string, query: string, response: string, sources: any[]) => {
    setHistory(prev => {
      const sessions = prev.sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            conversations: [
              ...session.conversations,
              {
                query,
                response,
                sources,
                timestamp: Date.now(),
              },
            ],
            lastUpdated: Date.now(),
          };
        }
        return session;
      });

      return {
        ...prev,
        sessions,
      };
    });
  }, []);

  // Get current session
  const getCurrentSession = useCallback(() => {
    if (!history.currentSessionId) return null;
    return history.sessions.find(s => s.id === history.currentSessionId) || null;
  }, [history]);

  // Get session by ID
  const getSession = useCallback((sessionId: string) => {
    return history.sessions.find(s => s.id === sessionId) || null;
  }, [history.sessions]);

  // Set current session
  const setCurrentSession = useCallback((sessionId: string | undefined) => {
    setHistory(prev => ({
      ...prev,
      currentSessionId: sessionId,
    }));
  }, []);

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    setHistory(prev => ({
      sessions: prev.sessions.filter(s => s.id !== sessionId),
      currentSessionId: prev.currentSessionId === sessionId ? undefined : prev.currentSessionId,
    }));
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory({
      sessions: [],
      currentSessionId: undefined,
    });
  }, []);

  // Get conversation history for API
  const getConversationHistory = useCallback((sessionId: string) => {
    const session = getSession(sessionId);
    if (!session) return [];
    
    // Return only query and response for API
    return session.conversations.map(conv => ({
      query: conv.query,
      response: conv.response,
    }));
  }, [getSession]);

  return {
    history,
    createSession,
    addToSession,
    getCurrentSession,
    getSession,
    setCurrentSession,
    deleteSession,
    clearHistory,
    getConversationHistory,
  };
}