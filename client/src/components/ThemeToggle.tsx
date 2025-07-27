
import { Moon, Sun, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [isAnimating, setIsAnimating] = useState(false);

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
        "fixed top-4 right-4 z-50",
        "p-3 rounded-2xl",
        "glass-button glass-hover glass-active",
        "touch-target",
        "transition-all duration-300",
        "group"
      )}
      aria-label="Toggle theme"
    >
      <div className="relative">
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
