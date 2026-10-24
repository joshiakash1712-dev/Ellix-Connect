import { useEffect, useState, useCallback } from 'react';

/**
 * useScrollLock hook that toggles the `overflow: hidden` property on the document.body element
 * only when the specified condition is active/true, ensuring the page does not scroll
 * while the user is interacting with the active component.
 *
 * Automatically restores original body overflow on unlock or unmount.
 */
export function useScrollLock(initialLocked: boolean = false) {
  const [isLocked, setIsLocked] = useState(initialLocked);

  useEffect(() => {
    setIsLocked(initialLocked);
  }, [initialLocked]);

  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);

  const lock = useCallback(() => setIsLocked(true), []);
  const unlock = useCallback(() => setIsLocked(false), []);

  return { isLocked, lock, unlock, setIsLocked };
}

export default useScrollLock;
