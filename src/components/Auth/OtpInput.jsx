'use client';

import { useEffect, useRef, useState } from 'react';

import { digitsOnly } from '../../lib/utils/digits';

/** A fixed-length array of single digits; '' marks an empty box. */
function toSlots(value, length) {
  const chars = digitsOnly(value).slice(0, length).split('');
  return Array.from({ length }, (_, i) => chars[i] || '');
}

/**
 * Fixed-length SMS code entry. Boxes are held as a fixed-length array rather
 * than a string, so clearing a digit empties that box instead of collapsing the
 * code and shifting every later digit one place left.
 *
 * The row is explicitly `dir="ltr"`: a numeric code reads left-to-right even in
 * a Persian layout, so box 0 is the leftmost and the arrow keys follow suit.
 */
export default function OtpInput({ length, value, onChange, onComplete, disabled, autoFocus }) {
  const boxes = useRef([]);
  const [slots, setSlots] = useState(() => toSlots(value, length));

  const focusBox = (index) => boxes.current[Math.max(0, Math.min(index, length - 1))]?.focus();

  useEffect(() => {
    if (autoFocus) focusBox(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  // Resync when the parent replaces the value — notably clearing it after a
  // rejected code, which should also put the caret back in the first box.
  useEffect(() => {
    setSlots((current) => {
      if (value === current.join('')) return current;
      if (value === '') focusBox(0);
      return toSlots(value, length);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, length]);

  const commit = (next) => {
    setSlots(next);
    const joined = next.join('');
    onChange(joined);
    if (next.every((digit) => digit !== '')) onComplete?.(joined);
  };

  const handleChange = (index, raw) => {
    // maxLength is 1 and focus selects the box, so a keystroke replaces what is
    // there; taking the last character keeps that true on browsers that append.
    const digit = digitsOnly(raw).slice(-1);
    if (!digit) return;

    const next = [...slots];
    next[index] = digit;
    commit(next);
    if (index < length - 1) focusBox(index + 1);
  };

  // Pasting the whole code from the SMS fills every box from here onwards.
  const handlePaste = (index, e) => {
    const pasted = digitsOnly(e.clipboardData?.getData('text') || '');
    if (!pasted) return;
    e.preventDefault();

    const next = [...slots];
    for (let i = 0; i < pasted.length && index + i < length; i += 1) {
      next[index + i] = pasted[i];
    }
    commit(next);
    focusBox(index + pasted.length);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...slots];
      if (next[index]) {
        next[index] = '';
        commit(next);
        return;
      }
      if (index > 0) {
        next[index - 1] = '';
        commit(next);
        focusBox(index - 1);
      }
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusBox(index - 1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusBox(index + 1);
    }
  };

  return (
    <div dir="ltr" role="group" aria-label="کد تایید" className="flex justify-center gap-2">
      {slots.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            boxes.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onPaste={(e) => handlePaste(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          aria-label={`رقم ${index + 1} از ${length}`}
          className="size-12 rounded-xl border border-stroke bg-surface text-center text-lg font-bold text-grey-800 shadow-xs transition-all outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
        />
      ))}
    </div>
  );
}
