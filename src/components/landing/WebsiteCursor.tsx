import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

type CursorMode = 'default' | 'hover' | 'card' | 'text' | 'clicking';

export const WebsiteCursor: React.FC = () => {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');

  // Exact mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for outer trailing aura ring (tuned for 120fps fluid response)
  const springConfig = { damping: 28, stiffness: 340, mass: 0.3 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse/trackpad, not touchscreens)
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    if (!mediaQuery.matches) {
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }

    // High-performance coordinate tracker: zero DOM queries, pure MotionValue update
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) {
        setIsVisible(true);
      }
    };

    // Hover state inspector: only runs on element boundary transitions (mouseover), not on every pixel
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) {
        setCursorMode('default');
        return;
      }

      if (target.closest('button, a, input, select, textarea, [role="button"], [data-cursor="hover"], label, summary')) {
        setCursorMode('hover');
      } else if (target.closest('[data-cursor="card"], .website-interactive-card, [data-spotlight="card"]')) {
        setCursorMode('card');
      } else {
        setCursorMode('default');
      }
    };

    const handleMouseDown = () => {
      setCursorMode('clicking');
    };

    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a, input, select, textarea, [role="button"], [data-cursor="hover"], label, summary')) {
        setCursorMode('hover');
      } else if (target?.closest('[data-cursor="card"], .website-interactive-card')) {
        setCursorMode('card');
      } else {
        setCursorMode('default');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isFinePointer) {
    return null;
  }

  // Determine size, color & scale based on cursor mode
  let auraSize = 34;
  let auraBorder = 'border-emerald-500/40 dark:border-emerald-400/50';
  let auraBg = 'bg-emerald-500/5 dark:bg-emerald-400/10';
  let auraShadow = 'shadow-[0_0_12px_rgba(16,185,129,0.12)]';
  let auraScale = 1;

  if (cursorMode === 'hover') {
    auraSize = 58;
    auraBorder = 'border-emerald-400 dark:border-emerald-300';
    auraBg = 'bg-emerald-400/15 dark:bg-emerald-400/20 backdrop-blur-[1px]';
    auraShadow = 'shadow-[0_0_24px_rgba(52,211,153,0.35)]';
    auraScale = 1.05;
  } else if (cursorMode === 'card') {
    auraSize = 68;
    auraBorder = 'border-teal-400/60 dark:border-emerald-400/60';
    auraBg = 'bg-emerald-500/8 dark:bg-emerald-400/12 backdrop-blur-[0.5px]';
    auraShadow = 'shadow-[0_0_28px_rgba(20,184,166,0.25)]';
    auraScale = 1.02;
  } else if (cursorMode === 'clicking') {
    auraSize = 26;
    auraBorder = 'border-emerald-300 dark:border-emerald-200';
    auraBg = 'bg-emerald-500/30 dark:bg-emerald-400/40';
    auraShadow = 'shadow-[0_0_16px_rgba(16,185,129,0.5)]';
    auraScale = 0.9;
  }

  return (
    <div
      id="website-custom-cursor-container"
      className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Precision Center Dot (Tracks directly without lag) */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-400 to-teal-200 shadow-[0_0_10px_rgba(16,185,129,0.9)] ring-1 ring-white/70"
        style={{
          x: mouseX,
          y: mouseY,
          willChange: 'transform',
          transform: 'translateZ(0)',
          opacity: isVisible ? (cursorMode === 'hover' ? 0.3 : 1) : 0,
          scale: cursorMode === 'clicking' ? 0.75 : 1,
        }}
        transition={{ duration: 0.08 }}
      />

      {/* 2. Outer Trailing Aura Ring with smooth spring lag & reactive styling */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full border transition-[border-color,background-color,box-shadow] duration-200 ${auraBorder} ${auraBg} ${auraShadow}`}
        style={{
          x: smoothX,
          y: smoothY,
          willChange: 'transform, width, height',
          transform: 'translateZ(0)',
          width: auraSize,
          height: auraSize,
          marginLeft: -auraSize / 2,
          marginTop: -auraSize / 2,
          opacity: isVisible ? 1 : 0,
          scale: auraScale,
        }}
        transition={{
          width: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
          height: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
          marginLeft: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
          marginTop: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.18 },
        }}
      >
        {/* Subtle inner ambient focus ring when hovering clickable item */}
        {cursorMode === 'hover' && (
          <div className="w-full h-full rounded-full opacity-30 border border-emerald-400 animate-pulse" />
        )}
      </motion.div>
    </div>
  );
};
