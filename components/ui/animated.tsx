'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  delay = 0,
  className,
  onClick,
}: AnimatedCardProps) {
  const motionProps: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
  };

  return (
    <motion.div
      {...motionProps}
      className={cn(
        'bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
