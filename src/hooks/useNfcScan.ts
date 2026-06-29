import { useCallback, useEffect, useRef } from 'react';

interface UseNfcScanOptions {
  onScan: (cardKey: string) => void;
  /**
   * Minimum length of the cleaned card ID.
   * Defaults to 5 — update if your card format changes.
   */
  minLength?: number;
  /**
   * Override the default validation logic entirely.
   * Receives the already-cleaned ID (framing chars stripped).
   */
  validate?: (value: string) => boolean;
}

/**
 * Normalizes raw NFC reader output to a clean card ID.
 *
 * Current hardware: keyboard-wedge reader outputting ;{digits}? format
 * e.g. ";2051028996?" → "2051028996"
 *
 * If the card format changes, update ONLY this function.
 */
function normalizeCardId(raw: string): string {
  return raw.replace(/^;/, '').replace(/\?$/, '');
}

/**
 * Returns true if the cleaned ID looks valid.
 *
 * Current format: numeric string, at least 5 digits.
 * Update this if cards switch to a different format (UUID, hex, etc).
 */
function isValidCardId(value: string): boolean {
  return /^\d{5,}$/.test(value);
}

/**
 * Captures scans from keyboard-wedge style NFC readers — the kind
 * that "type" a card's key followed by Enter, exactly like a barcode
 * scanner. Confirmed working in keyboard-wedge mode (tested on Mac).
 *
 * Card format confirmed from hardware: ;{digits}?
 * onScan always receives the clean numeric ID e.g. "2051028996".
 */
export function useNfcScan({
  onScan,
  minLength = 5,
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
      const raw = e.currentTarget.value.trim();
      e.currentTarget.value = '';

      const value = normalizeCardId(raw);

      if (value.length < minLength) return;

      // Use caller-supplied validation if provided, otherwise use default
      const valid = validate ? validate(value) : isValidCardId(value);
      if (!valid) return;

      onScan(value);
    },
    [onScan, minLength, validate]
  );

  // Lets you test the whole flow without physical hardware.
  // Pass a raw value (with or without framing chars) — it goes through
  // the same normalize + validate pipeline as a real scan.
  const simulateScan = useCallback(
    (fakeKey: string) => {
      const value = normalizeCardId(fakeKey);
      const valid = validate ? validate(value) : isValidCardId(value);
      if (!valid) return;
      onScan(value);
    },
    [onScan, validate]
  );

  return {
    inputRef,
    inputProps: {
      ref: inputRef,
      onKeyDown: handleKeyDown,
      autoFocus: true,
      // aria-hidden removed — conflicts with autoFocus (browser warning)
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