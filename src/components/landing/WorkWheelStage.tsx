import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

export interface WorkWheelItemDef {
  id: string;
  number: string;
  title: string;
  tagline?: string;
  icon: React.ElementType;
}

export interface WorkWheelStageProps {
  items: WorkWheelItemDef[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  label?: string;
  sublabel?: string;
  className?: string;
}

/**
 * Interactive Work Wheel Rotary Dial
 * Completely self-contained, 100% SVG & CSS vector graphics (zero external images).
 * Features smooth rotational angle alignment, drag-to-spin, wheel event scrolling,
 * and a mobile-optimized sorted navigation bar.
 */
export const WorkWheelStage: React.FC<WorkWheelStageProps> = ({
  items,
  activeIndex,
  onActiveChange,
  label = 'Workflow',
  sublabel = 'Continuous Cycle',
  className = '',
}) => {
  const count = items.length;
  const prefersReducedMotion = useReducedMotion();
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const wheelAccumulatorRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate target rotation angle so active item aligns at the top (or 12 o'clock / -90 deg)
  const anglePerItem = 360 / count;
  const targetRotation = -(activeIndex * anglePerItem);

  const handleNext = useCallback(() => {
    onActiveChange((activeIndex + 1) % count);
  }, [activeIndex, count, onActiveChange]);

  const handlePrev = useCallback(() => {
    onActiveChange((activeIndex - 1 + count) % count);
  }, [activeIndex, count, onActiveChange]);

  // Handle wheel events directly on the wheel dial
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (Math.abs(e.deltaY) < 4) return;
      const now = performance.now();
      if (now - lastWheelTimeRef.current < 80) return;

      wheelAccumulatorRef.current += e.deltaY;
      const threshold = 30;

      if (Math.abs(wheelAccumulatorRef.current) >= threshold) {
        lastWheelTimeRef.current = now;
        if (wheelAccumulatorRef.current > 0) {
          if (activeIndex < count - 1) {
            e.preventDefault();
            onActiveChange(activeIndex + 1);
          }
        } else {
          if (activeIndex > 0) {
            e.preventDefault();
            onActiveChange(activeIndex - 1);
          }
        }
        wheelAccumulatorRef.current = 0;
      }
    },
    [activeIndex, count, onActiveChange]
  );

  return (
    <div
      ref={wheelContainerRef}
      onWheel={handleWheel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-900/40 shadow-sm overflow-hidden select-none ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300">
            {label} Work Wheel
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <RotateCw className="w-3.5 h-3.5 text-blue-500 animate-[spin_10s_linear_infinite]" />
          <span>Interactive Dial</span>
        </div>
      </div>

      {/* Center 2D/3D Wheel Visual Stage */}
      <div className="relative flex-1 min-h-[340px] sm:min-h-[400px] flex items-center justify-center p-4 overflow-hidden">
        {/* Background subtle radial rings & mesh */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 dark:opacity-30">
          <div className="w-[380px] h-[380px] rounded-full border border-dashed border-blue-400/40 dark:border-sky-500/30" />
          <div className="w-[280px] h-[280px] rounded-full border border-slate-300 dark:border-slate-700" />
          <div className="w-[180px] h-[180px] rounded-full border border-blue-500/20 dark:border-sky-400/20" />
        </div>

        {/* The Rotating Wheel Assembly */}
        <div className="relative w-[300px] sm:w-[340px] h-[300px] sm:h-[340px] flex items-center justify-center">
          
          {/* Animated Rotating Node Ring */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: targetRotation }}
            transition={
              prefersReducedMotion
                ? { duration: 0.1 }
                : { type: 'spring', stiffness: 180, damping: 24, mass: 0.8 }
            }
          >
            {/* Outer SVG Track connecting all nodes */}
            <svg className="w-full h-full pointer-events-none" viewBox="0 0 340 340">
              <circle
                cx="170"
                cy="170"
                r="130"
                fill="none"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
              {/* Active glow arc */}
              <circle
                cx="170"
                cy="170"
                r="130"
                fill="none"
                stroke="url(#blueGradient)"
                strokeWidth="3.5"
                strokeDasharray="80 300"
                strokeDashoffset={-activeIndex * (816 / count)}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Positioned Node Buttons along circular perimeter */}
            {items.map((item, idx) => {
              const nodeAngle = idx * anglePerItem - 90; // Start at 12 o'clock
              const rad = (nodeAngle * Math.PI) / 180;
              const radius = 130; // Radius in pixels
              const cx = 170 + radius * Math.cos(rad);
              const cy = 170 + radius * Math.sin(rad);
              const isActive = idx === activeIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  style={{
                    position: 'absolute',
                    left: `${cx}px`,
                    top: `${cy}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="z-20"
                >
                  {/* Keep the node upright by counter-rotating */}
                  <motion.div
                    animate={{ rotate: -targetRotation }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.1 }
                        : { type: 'spring', stiffness: 180, damping: 24, mass: 0.8 }
                    }
                  >
                    <button
                      type="button"
                      onClick={() => onActiveChange(idx)}
                      aria-label={`Jump to ${item.title}`}
                      className={`relative flex items-center justify-center rounded-2xl transition-all cursor-pointer group ${
                        isActive
                          ? 'w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-400/20 scale-110'
                          : 'w-11 h-11 sm:w-12 sm:h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-sky-400 shadow-sm hover:scale-105'
                      }`}
                    >
                      <Icon className={isActive ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'} />

                      {/* Number Tag Badge */}
                      <span
                        className={`absolute -bottom-1 -right-1 font-mono text-[9px] font-bold px-1 rounded-full ${
                          isActive
                            ? 'bg-slate-950 text-sky-300 border border-sky-400/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {item.number}
                      </span>
                    </button>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

          {/* Central Hub Emblem */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center p-2 text-center pointer-events-none">
            <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
              {items[activeIndex]?.number || '01'}
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-[85px] sm:max-w-[100px] leading-tight">
              {items[activeIndex]?.title}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 truncate max-w-[85px]">
              {sublabel}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sorted Navigation Bar (Supports mobile swipe & fast jumping) */}
      <div className="px-4 py-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm z-10 flex items-center justify-between gap-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous step"
          className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Center Progress Indicators */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[180px] sm:max-w-none">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onActiveChange(idx)}
              aria-label={`Jump to stage ${item.number}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === activeIndex
                  ? 'w-7 bg-blue-600'
                  : idx < activeIndex
                  ? 'w-2.5 bg-blue-300 dark:bg-blue-800'
                  : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next step"
          className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-sm transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
