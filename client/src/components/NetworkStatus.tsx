import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function NetworkStatus() {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const [showStatus, setShowStatus] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isOnline || isSlowConnection) {
      setShowStatus(true);
    } else {
      // Hide status after a delay when connection is restored
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, isSlowConnection]);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed z-40",
            isMobile ? "top-4 left-1/2 -translate-x-1/2" : "top-12 left-1/2 -translate-x-1/2",
            "px-4 py-2 rounded-full",
            "backdrop-blur-lg shadow-lg",
            "flex items-center gap-2",
            "text-sm font-medium",
            !isOnline 
              ? "bg-destructive/20 text-destructive border border-destructive/30" 
              : isSlowConnection 
              ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30"
              : "bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30"
          )}
        >
          {!isOnline ? (
            <>
              <WifiOff className="h-4 w-4" />
              <span>오프라인</span>
            </>
          ) : isSlowConnection ? (
            <>
              <AlertCircle className="h-4 w-4" />
              <span>느린 연결</span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" />
              <span>연결됨</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}