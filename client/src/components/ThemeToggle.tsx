import { Moon, Sun, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps = {}) {
  const [theme, setTheme] = useState("light");
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  function toggleTheme() {
    setIsAnimating(true);
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    
    setTimeout(() => setIsAnimating(false), 600);
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "absolute z-50",
        "w-10 h-10 rounded-full",
        "bg-background/60 backdrop-blur-xl",
        "border border-border/30",
        "shadow-md shadow-black/5 dark:shadow-black/10",
        "transition-all duration-300",
        "group",
        "flex items-center justify-center",
        "overflow-hidden",
        "opacity-50 hover:opacity-100",
        "hover:bg-background/80 hover:border-border/50",
        "hover:shadow-lg",
        "active:scale-95",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative flex items-center justify-center">
        {theme === "light" ? (
          <Moon 
            className={cn(
              "h-4 w-4 text-purple-600",
              isAnimating && "animate-spin-once"
            )} 
          />
        ) : (
          <Sun 
            className={cn(
              "h-4 w-4 text-yellow-500",
              isAnimating && "animate-spin-once"
            )} 
          />
        )}
        <Sparkles 
          className={cn(
            "absolute -top-1 -right-1 h-3 w-3 text-yellow-400",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300",
            isAnimating && "animate-ping"
          )} 
        />
      </div>
    </button>
  );
}