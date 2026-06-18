import { useCallback, useEffect, useRef } from 'react';

interface UseNfcScanOptions {
  onScan: (cardKey: string) => void;
  /**
   * Ignore anything shorter than this. Public keys are long strings,
   * not short card UIDs, so the floor is much higher than a typical
   * "is this a real scan" check would use.
   */
  minLength?: number;
  /**
   * Optional shape check once you know the exact key format —
   * e.g. /^[0-9a-f]{64}$/i for hex, or a base58 pattern.
   * Leave unset until you've seen a real sample.
   */
  validate?: (value: string) => boolean;
}

/**
 * Captures scans from keyboard-wedge style NFC readers — the kind
 * that "type" a card's key followed by Enter, exactly like a barcode
 * scanner. Confirmed working in keyboard-wedge mode (tested on Mac).
 */
export function useNfcScan({
  onScan,
  minLength = 20,
  validate,
}: UseNfcScanOptions) {
  const inputRef = useRef<HTMLInputElement>(null);

  // The reader "types" into whatever has focus, so keep this field
  // focused at all times on the kiosk screen.
  useEffect(() => {
    const refocus = () => inputRef.current?.focus();
    refocus();
    document.addEventListener('click', refocus);
    return () => document.removeEventListener('click', refocus);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      const value = e.currentTarget.value.trim();
      e.currentTarget.value = '';

      if (value.length < minLength) return;
      if (validate && !validate(value)) return;

      onScan(value);
    },
    [onScan, minLength, validate]
  );

  // Lets you test the whole flow before the format is fully pinned down.
  const simulateScan = useCallback(
    (fakeKey: string) => onScan(fakeKey),
    [onScan]
  );

  return {
    inputRef,
    inputProps: {
      ref: inputRef,
      onKeyDown: handleKeyDown,
      autoFocus: true,
      'aria-hidden': true,
      tabIndex: -1,
      style: {
        position: 'fixed',
        top: -1000,
        left: -1000,
        opacity: 0,
      } as React.CSSProperties,
    },
    simulateScan,
  };
}