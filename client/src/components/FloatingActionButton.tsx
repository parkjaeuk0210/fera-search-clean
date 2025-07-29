import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: "plus" | "search";
  className?: string;
}

export function FloatingActionButton({ 
  onClick, 
  icon = "plus",
  className 
}: FloatingActionButtonProps) {
  const Icon = icon === "search" ? Search : Plus;
  
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "w-14 h-14 rounded-full",
        "bg-primary text-primary-foreground",
        "shadow-lg hover:shadow-xl",
        "flex items-center justify-center",
        "transition-shadow duration-200",
        "touch-target touch-feedback",
        "safe-bottom",
        className
      )}
    >
      <Icon className="h-6 w-6" />
    </motion.button>
  );
}