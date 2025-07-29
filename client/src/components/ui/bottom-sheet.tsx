import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  className,
}: BottomSheetProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragY, setDragY] = React.useState(0);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // Handle drag gestures
  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    } else {
      setDragY(0);
    }
    setIsDragging(false);
  };

  // Prevent body scroll when sheet is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: dragY }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "bg-background rounded-t-2xl",
              "shadow-xl",
              "max-h-[90vh] min-h-[200px]",
              "safe-bottom",
              isDragging ? "cursor-grabbing" : "cursor-grab",
              className
            )}
          >
            {/* Drag Handle */}
            <div className="w-full pt-3 pb-2">
              <div className="mx-auto w-12 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 pb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors touch-target"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="px-4 pb-4 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}