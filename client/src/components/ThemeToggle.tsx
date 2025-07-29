import { Moon, Sun, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function ThemeToggle() {
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
        "fixed z-[60]",
        isMobile ? "bottom-20 left-4" : "top-4 left-4",
        "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl",
        "bg-background/80 backdrop-blur-xl",
        "border border-border/60",
        "shadow-lg shadow-black/10 dark:shadow-black/20",
        "transition-all duration-300",
        "group relative",
        "flex items-center justify-center",
        "overflow-hidden",
        "hover:bg-background/90 hover:border-border",
        "hover:shadow-xl hover:scale-105",
        "active:scale-95",
        isMobile && "safe-bottom"
      )}
      aria-label="Toggle theme"
    >
      <div className="relative flex items-center justify-center">
        {theme === "light" ? (
          <Moon 
            className={cn(
              "h-5 w-5 text-purple-600",
              isAnimating && "animate-spin"
            )} 
          />
        ) : (
          <Sun 
            className={cn(
              "h-5 w-5 text-yellow-500",
              isAnimating && "animate-spin"
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