import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export interface UseCardWheelScrollOptions {
  totalItems: number;
  activeIndex: number;
  onActiveChange: (index: number) => void;
  wheelThreshold?: number;
  debounceMs?: number;
  sectionId?: string;
  enableAnchor?: boolean;
}

/**
 * Viewport-Aware Section Anchoring and Scroll-Lock Hook for Ellic Work Wheel
 * 
 * Capabilities:
 * - Dynamically calculates visible browser viewport height (accounting for sticky header).
 * - Centers the Work Wheel section within the visible viewport when it fits; anchors just below
 *   the header with scroll-safe containment when the window is compact or zoomed.
 * - Pins the section when the user enters the section, preventing the document from moving vertically
 *   while intermediate cards (0 to totalItems - 1) are rotated/navigated.
 * - Releases the scroll-lock naturally on the LAST card when scrolling DOWN, smoothly continuing to the next section.
 * - Releases the scroll-lock naturally on the FIRST card when scrolling UP, smoothly returning to the previous section.
 * - Adapts cleanly across 100% zoom, 80% zoom, resized windows, reduced-height screens, and mobile.
 */
export function useCardWheelScroll({
  totalItems,
  activeIndex,
  onActiveChange,
  wheelThreshold = 38,
  debounceMs = 260,
  sectionId,
  enableAnchor = true,
}: UseCardWheelScrollOptions) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isAnchored, setIsAnchored] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const isLastItem = activeIndex === totalItems - 1;
  const isFirstItem = activeIndex === 0;

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const totalItemsRef = useRef(totalItems);
  totalItemsRef.current = totalItems;

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const isPinnedRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const lastDockTimeRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);

  // Dynamically compute the optimal viewport scroll position for this section
  const calculateTargetScrollY = useCallback((el: HTMLElement): number => {
    const rect = el.getBoundingClientRect();
    const headerEl = document.querySelector('header');
    const headerHeight = headerEl ? Math.round(headerEl.getBoundingClientRect().height) : 68;
    const vh = window.innerHeight;
    const availableHeight = Math.max(200, vh - headerHeight);
    const sectionHeight = Math.round(rect.height);

    let targetTop: number;
    if (sectionHeight <= availableHeight) {
      // Center the complete section vertically in the visible space under the sticky header
      targetTop = headerHeight + Math.max(8, (availableHeight - sectionHeight) / 2);
    } else {
      // Section is taller than visible viewport: anchor top just under sticky header
      targetTop = headerHeight + 8;
    }

    return Math.round(window.scrollY + rect.top - targetTop);
  }, []);

  // Determine if this section is the dominant focused Work Wheel section in the viewport
  const isDominantSection = useCallback((): boolean => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) return false;
    const el = sectionRef.current;
    if (!el) return false;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const headerEl = document.querySelector('header');
    const headerHeight = headerEl ? Math.round(headerEl.getBoundingClientRect().height) : 68;

    // Must be in active view
    if (rect.top >= vh * 0.78 || rect.bottom <= headerHeight + 40) {
      return false;
    }

    const viewportCenter = headerHeight + (vh - headerHeight) / 2;
    const sectionCenter = rect.top + rect.height / 2;
    const myDistance = Math.abs(sectionCenter - viewportCenter);

    // Multi-section arbitration: compare distance with other Work Wheel sections
    const allWorkSections = Array.from(document.querySelectorAll<HTMLElement>('section[data-work-wheel="true"]'));
    if (allWorkSections.length <= 1) return true;

    for (const other of allWorkSections) {
      if (other === el) continue;
      const otherRect = other.getBoundingClientRect();
      const otherCenter = otherRect.top + otherRect.height / 2;
      const otherDistance = Math.abs(otherCenter - viewportCenter);
      if (otherDistance < myDistance) {
        return false;
      }
    }

    return true;
  }, []);

  // Smoothly dock section to its optimal viewport position
  const ensureDocked = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      if (!enableAnchor) return;
      if (typeof window === 'undefined' || window.innerWidth < 1024) return;
      const el = sectionRef.current;
      if (!el) return;

      const targetY = calculateTargetScrollY(el);
      const diff = Math.abs(window.scrollY - targetY);
      if (diff > 5) {
        window.scrollTo({
          top: targetY,
          behavior: prefersReducedMotion ? 'instant' : behavior,
        });
      }
    },
    [enableAnchor, calculateTargetScrollY, prefersReducedMotion]
  );

  // Step active card by delta (-1 or +1) while keeping viewport stationary
  const stepBy = useCallback(
    (delta: number): boolean => {
      const now = performance.now();
      if (now - lastStepTimeRef.current < debounceMs) {
        return false;
      }

      const current = activeIndexRef.current;
      const total = totalItemsRef.current;
      const next = Math.max(0, Math.min(total - 1, current + delta));

      if (next !== current) {
        lastStepTimeRef.current = now;
        wheelAccumulatorRef.current = 0;
        onActiveChangeRef.current(next);
        return true;
      }
      return false;
    },
    [debounceMs]
  );

  // Programmatically scroll down to the next section or element
  const scrollToNextSection = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const nextEl = el.nextElementSibling as HTMLElement | null;
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  }, []);

  // Programmatically scroll up to previous section
  const scrollToPrevSection = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prevEl = el.previousElementSibling as HTMLElement | null;
    if (prevEl) {
      prevEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
    }
  }, []);

  // Main wheel event handler
  const handleWheelNative = useCallback(
    (e: WheelEvent, source: 'section' | 'window') => {
      // On mobile viewports (< 1024px) where wheel dial is hidden, allow natural fluid scroll
      if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

      // Ignore pure horizontal gestures
      if (Math.abs(e.deltaY) < 3 && Math.abs(e.deltaX) > 10) return;

      const dy = e.deltaY;
      if (Math.abs(dy) < 3) return;

      const el = sectionRef.current;
      if (!el) return;

      // If from window listener, only handle if this section is the dominant focused section
      if (source === 'window' && !isDominantSection()) {
        return;
      }

      const direction = dy > 0 ? 1 : -1;
      const current = activeIndexRef.current;
      const total = totalItemsRef.current;

      // BOUNDARY 1: Scrolling DOWN and on the LAST card -> Release lock and let website scroll down!
      if (direction > 0 && current >= total - 1) {
        isPinnedRef.current = false;
        setIsAnchored(false);
        wheelAccumulatorRef.current = 0;
        return;
      }

      // BOUNDARY 2: Scrolling UP and on the FIRST card -> Release lock and let website scroll up!
      if (direction < 0 && current <= 0) {
        isPinnedRef.current = false;
        setIsAnchored(false);
        wheelAccumulatorRef.current = 0;
        return;
      }

      // WITHIN WORK WHEEL RANGE: Pin section in viewport and step cards in-place
      e.preventDefault();
      e.stopPropagation();

      const now = performance.now();
      // Ensure section is nicely docked in viewport when starting to step
      if (!isPinnedRef.current || now - lastDockTimeRef.current > 1200) {
        ensureDocked('smooth');
        lastDockTimeRef.current = now;
      }
      isPinnedRef.current = true;
      setIsAnchored(true);

      const isDiscreteTick = e.deltaMode !== 0 || Math.abs(dy) >= 35;

      if (isDiscreteTick) {
        stepBy(direction);
      } else {
        // Continuous trackpad gesture accumulation
        wheelAccumulatorRef.current += dy;
        if (Math.abs(wheelAccumulatorRef.current) >= wheelThreshold) {
          const step = Math.sign(wheelAccumulatorRef.current);
          const stepped = stepBy(step);
          if (stepped) {
            wheelAccumulatorRef.current = 0;
          }
        }
      }
    },
    [isDominantSection, ensureDocked, stepBy, wheelThreshold]
  );

  // Touch swipe support for touchscreens on desktop/tablet preview (>= 1024px)
  const handleTouchStartNative = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
    }
  }, []);

  const handleTouchMoveNative = useCallback(
    (e: TouchEvent) => {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
      if (e.touches.length === 0) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartYRef.current - currentY; // positive = swipe up (scroll down)
      const deltaX = currentX - touchStartXRef.current;

      if (Math.abs(deltaY) < 25) return;
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.6) return;

      if (!isDominantSection()) return;

      const direction = deltaY > 0 ? 1 : -1;
      const current = activeIndexRef.current;
      const total = totalItemsRef.current;

      if (direction > 0 && current >= total - 1) return;
      if (direction < 0 && current <= 0) return;

      if (e.cancelable) {
        e.preventDefault();
      }

      const stepped = stepBy(direction);
      if (stepped) {
        touchStartYRef.current = currentY;
      }
    },
    [isDominantSection, stepBy]
  );

  // Attach non-passive native event listeners
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const onSectionWheel = (e: WheelEvent) => handleWheelNative(e, 'section');
    const onWindowWheel = (e: WheelEvent) => handleWheelNative(e, 'window');

    sectionEl.addEventListener('wheel', onSectionWheel, { passive: false });
    sectionEl.addEventListener('touchstart', handleTouchStartNative, { passive: true });
    sectionEl.addEventListener('touchmove', handleTouchMoveNative, { passive: false });
    window.addEventListener('wheel', onWindowWheel, { passive: false });

    return () => {
      sectionEl.removeEventListener('wheel', onSectionWheel);
      sectionEl.removeEventListener('touchstart', handleTouchStartNative);
      sectionEl.removeEventListener('touchmove', handleTouchMoveNative);
      window.removeEventListener('wheel', onWindowWheel);
    };
  }, [handleWheelNative, handleTouchStartNative, handleTouchMoveNative]);

  // Recalculate and re-anchor on window resize, zoom change, or section dimension change
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let resizeTimer: number;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (isPinnedRef.current && isDominantSection()) {
          ensureDocked('instant');
        }
      }, 50);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        handleResize();
      });
      observer.observe(el);
    }

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (observer) observer.disconnect();
    };
  }, [isDominantSection, ensureDocked]);

  // Keyboard navigation when focused
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const current = activeIndexRef.current;
      const total = totalItemsRef.current;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (current < total - 1) {
          e.preventDefault();
          onActiveChangeRef.current(current + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (current > 0) {
          e.preventDefault();
          onActiveChangeRef.current(current - 1);
        }
      }
    },
    []
  );

  return {
    sectionRef,
    cardRef,
    isAnchored,
    isLastItem,
    isFirstItem,
    scrollToNextSection,
    scrollToPrevSection,
    scrollProps: {
      onKeyDown: handleKeyDown,
      tabIndex: 0,
      'aria-label': `${sectionId || 'work-wheel'} card, item ${activeIndex + 1} of ${totalItems}`,
    },
  };
}
