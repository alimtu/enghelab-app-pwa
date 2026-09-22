'use client';

import { useState } from 'react';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

/**
 * Full-screen viewer shared by the hub slider and the gallery page.
 */
export default function ImageViewer({ images, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const total = images.length;

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* "۱ از ۳" rather than "1 / 3": under RTL bidi the slash form renders
            with the numbers swapped and reads as three-of-one. */}
        <span className="text-xs text-white/60 tabular-nums">
          {index + 1} از {total}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="size-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      <div
        className="flex-1 flex items-center justify-center px-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {total > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute right-2 z-10 size-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronRightIcon className="size-5" />
          </button>
        )}

        <img
          src={images[index]}
          alt={`تصویر ${index + 1}`}
          className="max-h-[80vh] max-w-full object-contain rounded-lg select-none"
          draggable={false}
        />

        {total > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="absolute left-2 z-10 size-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
