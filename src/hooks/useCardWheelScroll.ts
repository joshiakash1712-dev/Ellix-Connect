import React, { useRef, useCallback, useEffect, useState } from 'react';

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
 * Hook to anchor work-wheel sections when they reach the middle of the screen
 * and intercept mouse wheel, trackpad, and touch gestures.
 * 
 * Behavior:
 * - When the section is centered in the viewport, downward wheel gestures
 *   advance through the work-wheel cards in-place while keeping the section anchored.
 * - The website is PREVENTED from scrolling down until the user reaches the LAST card.
 * - Once on the last card, scrolling down naturally releases the anchor and scrolls
 *   the page down to the next section.
 * - Symmetrically, upward scrolling reverses the cards until card 0, at which point
 *   upward page scrolling resumes.
 */
export function useCardWheelScroll({
  totalItems,
  activeIndex,
  onActiveChange,
  wheelThreshold = 35,
  debounceMs = 260,
  sectionId,
  enableAnchor = true,
}: UseCardWheelScrollOptions) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isAnchored, setIsAnchored] = useState(false);

  const isLastItem = activeIndex === totalItems - 1;
  const isFirstItem = activeIndex === 0;

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const totalItemsRef = useRef(totalItems);
  totalItemsRef.current = totalItems;

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const wheelAccumulatorRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);

  // Smoothly center section in the viewport if it has entered the anchor zone (Desktop only)
  const anchorToCenter = useCallback(() => {
    if (!enableAnchor) return;
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = vh / 2;

    // If section center is slightly off from viewport center, gently snap it into center
    if (Math.abs(sectionCenter - viewportCenter) > 35) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [enableAnchor]);

  // Advance or reverse by delta (-1 or +1)
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
        anchorToCenter();
        return true;
      }
      return false;
    },
    [debounceMs, anchorToCenter]
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

  // Main native wheel event logic
  const handleWheelNative = useCallback(
    (e: WheelEvent, source: 'section' | 'window') => {
      // Only engage wheel scroll locking on desktop/PC preview (>= 1024px) where wheel dial is visible
      if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

      // Ignore horizontal trackpad swipes
      if (Math.abs(e.deltaY) < 3 && Math.abs(e.deltaX) > 10) return;

      const dy = e.deltaY;
      if (Math.abs(dy) < 3) return;

      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = vh / 2;
      const distFromCenter = Math.abs(sectionCenter - viewportCenter);

      // Check if section is the active/centered section in the viewport
      if (source === 'window') {
        const isDominant = distFromCenter < vh * 0.42 && rect.top < vh * 0.65 && rect.bottom > vh * 0.35;
        if (!isDominant) return;
      } else {
        const inView = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
        if (!inView) return;
      }

      const direction = dy > 0 ? 1 : -1;
      const current = activeIndexRef.current;
      const total = totalItemsRef.current;

      // BOUNDARY CHECK:
      // When scrolling DOWN and on the LAST card -> allow natural page scroll to next section!
      if (direction > 0 && current >= total - 1) {
        setIsAnchored(false);
        return; // Website scrolls down!
      }

      // When scrolling UP and on the FIRST card -> allow natural page scroll to previous section!
      if (direction < 0 && current <= 0) {
        setIsAnchored(false);
        return; // Website scrolls up!
      }

      // WITHIN WORK WHEEL RANGE:
      // Cancel native page scroll and step through work wheel cards!
      e.preventDefault();
      e.stopPropagation();
      setIsAnchored(true);

      const isDiscreteTick = e.deltaMode !== 0 || Math.abs(dy) >= 30;

      if (isDiscreteTick) {
        stepBy(direction);
      } else {
        // Continuous trackpad gesture accumulation
        wheelAccumulatorRef.current += dy;
        if (Math.abs(wheelAccumulatorRef.current) >= wheelThreshold) {
          const step = Math.sign(wheelAccumulatorRef.current);
          stepBy(step);
        }
      }
    },
    [wheelThreshold, stepBy]
  );

  // Touch swipe support on mobile devices
  const handleTouchStartNative = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
    }
  }, []);

  const handleTouchMoveNative = useCallback(
    (e: TouchEvent) => {
      // On mobile viewports (< 1024px) where wheel dial is hidden, allow natural fluid touch scroll
      if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

      if (e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartYRef.current - currentY; // positive = scroll down
      const deltaX = currentX - touchStartXRef.current;

      if (Math.abs(deltaY) < 25) return;
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.6) return;

      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const distFromCenter = Math.abs(rect.top + rect.height / 2 - vh / 2);
      if (distFromCenter > vh * 0.45) return;

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
    [stepBy]
  );

  // Attach non-passive event listeners to ensure preventDefault() works reliably
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

  // Keyboard navigation when card container has focus
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
