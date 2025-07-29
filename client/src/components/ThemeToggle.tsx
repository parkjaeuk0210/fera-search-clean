
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
        "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl", // 고정된 정사각형 크기, 모바일 약간 작게
        "glass-button glass-hover glass-active touch-feedback",
        "transition-all duration-300",
        "group",
        "flex items-center justify-center", // 중앙 정렬
        "overflow-hidden", // 오버플로우 숨김
        "aspect-square" // 정사각형 비율 강제
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
