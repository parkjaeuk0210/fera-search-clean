import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  animate?: boolean;
}

export function Logo({ className, animate = false }: LogoProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      className={cn("w-[60px] h-[60px]", className)}
      initial={animate ? { rotate: 0 } : undefined}
      animate={animate ? { rotate: 360 } : undefined}
      transition={animate ? {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      } : undefined}
    >
      {/* Main circle */}
      <motion.circle
        cx="30"
        cy="30"
        r="20"
        stroke="url(#gradient)"
        strokeWidth="3"
        fill="none"
        initial={!animate ? { scale: 0.8, opacity: 0 } : undefined}
        animate={!animate ? { scale: 1, opacity: 1 } : undefined}
        transition={!animate ? {
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        } : undefined}
      />
      
      {/* Vertical line */}
      <motion.line
        x1="30"
        y1="0"
        x2="30"
        y2="60"
        stroke="url(#gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={!animate ? { scaleY: 0, opacity: 0 } : undefined}
        animate={!animate ? { scaleY: 1, opacity: 1 } : undefined}
        transition={!animate ? {
          duration: 0.8,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1]
        } : undefined}
      />
      
      {/* Horizontal line */}
      <motion.line
        x1="0"
        y1="30"
        x2="60"
        y2="30"
        stroke="url(#gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={!animate ? { scaleX: 0, opacity: 0 } : undefined}
        animate={!animate ? { scaleX: 1, opacity: 1 } : undefined}
        transition={!animate ? {
          duration: 0.8,
          delay: 0.3,
          ease: [0.16, 1, 0.3, 1]
        } : undefined}
      />
      
      <defs>
        <linearGradient
          id="gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <motion.stop
            offset="0%"
            animate={{
              stopColor: ["#64B5F6", "#81C9FA", "#B3E5FC", "#81C9FA", "#64B5F6"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.stop
            offset="50%"
            animate={{
              stopColor: ["#81C9FA", "#B3E5FC", "#64B5F6", "#B3E5FC", "#81C9FA"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.stop
            offset="100%"
            animate={{
              stopColor: ["#B3E5FC", "#64B5F6", "#81C9FA", "#64B5F6", "#B3E5FC"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}