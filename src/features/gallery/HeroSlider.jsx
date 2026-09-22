'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ImageOffIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import { Skeleton } from '../../components/ui/skeleton';
import ImageViewer from './ImageViewer';

const AUTOPLAY_MS = 4000;

/**
 * The gallery as it appears on the hub: one full-width image at a time that
 * moves on by itself, with a swipe taking over whenever the student wants.
 * Swiper does the touch, loop and RTL work (it reads the page direction on its
 * own); the dots and the counter are rendered here so they use the app's
 * tokens and follow the theme like everything else on the page.
 */
export default function HeroSlider({ images = [], loading = false }) {
  const swiperRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(null);
  const count = images.length;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // The viewer covers the slider, so it has no reason to keep moving underneath.
  useEffect(() => {
    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) return;
    if (viewerIndex !== null) autoplay.stop();
    else if (!reducedMotion) autoplay.start();
  }, [viewerIndex, reducedMotion]);

  if (loading) return <SliderSkeleton />;
  if (count === 0) return null;

  return (
    <section aria-label="گالری تصاویر" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-grey-800">گالری تصاویر</h2>
        <Link
          href="/gallery"
          className="flex items-center gap-0.5 rounded-md text-xs font-medium text-primary-600 outline-none transition-colors hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-300"
        >
          مشاهده همه
          <ChevronLeftIcon className="size-3.5" />
        </Link>
      </div>

      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setIndex(swiper.realIndex)}
        loop={count > 1}
        speed={600}
        autoplay={
          count > 1 && !reducedMotion
            ? { delay: AUTOPLAY_MS, disableOnInteraction: false, pauseOnMouseEnter: true }
            : false
        }
        className="aspect-16/10 w-full overflow-hidden rounded-2xl bg-grey-100"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <button
              type="button"
              onClick={() => setViewerIndex(i)}
              aria-label={`تصویر ${i + 1} از ${count}`}
              className="relative block size-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-300"
            >
              <SlideImage src={src} eager={i === 0} />
              {count > 1 && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/45 to-transparent"
                  />
                  {/* "۱ از ۳" rather than "1 / 3": under RTL bidi the slash
                      form renders with the numbers swapped and reads as
                      three-of-one. */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2.5 left-3 rounded-full bg-black/35 px-2 py-0.5 text-[11px] font-medium text-white tabular-nums backdrop-blur-sm"
                  >
                    {i + 1} از {count}
                  </span>
                </>
              )}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`رفتن به تصویر ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => swiperRef.current?.slideToLoop(i)}
              className="group rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-5 bg-primary-500' : 'w-1.5 bg-grey-200 group-hover:bg-grey-300'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {viewerIndex !== null && (
        <ImageViewer
          images={images}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </section>
  );
}

function SliderSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="aspect-16/10 w-full rounded-2xl" />
      <span className="sr-only">در حال بارگذاری...</span>
    </div>
  );
}

/**
 * One slide's picture. A URL the browser refuses to load (the file endpoint
 * has served images without an image content type, which the browser blocks)
 * falls back to a quiet placeholder instead of the broken-image glyph.
 */
function SlideImage({ src, eager }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="flex size-full items-center justify-center text-grey-300">
        <ImageOffIcon className="size-8" strokeWidth={1.5} />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="size-full object-cover"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
