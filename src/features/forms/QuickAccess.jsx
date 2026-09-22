'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardListIcon, FolderOpenIcon } from 'lucide-react';

import { Skeleton } from '../../components/ui/skeleton';
import useFormGroups from './useFormGroups';

/**
 * The forms feature as it appears on the hub: one tile per category, so the
 * task a student repeats most is one tap from the home page, plus a tile for
 * the full list. The row scrolls sideways when the university adds categories.
 *
 * `m_group` needs a session, so the caller only mounts this signed in. If the
 * request fails the row still offers "همه فرم‌ها" rather than an error — the
 * hub should not break because one of its blocks did.
 */
export default function QuickAccess() {
  const router = useRouter();
  const { groups, isLoading } = useFormGroups();

  return (
    <section aria-label="دسترسی سریع" className="space-y-3">
      <h2 className="text-sm font-semibold text-grey-800">دسترسی سریع</h2>

      <div className="-mx-4">
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <TileSkeleton key={i} />)
            : groups.map((group) => (
                <GroupTile
                  key={group.idg}
                  group={group}
                  onClick={() => router.push(`/forms/${group.idg}`)}
                />
              ))}

          <Tile title="همه فرم‌ها" onClick={() => router.push('/forms')}>
            <span className="flex size-full items-center justify-center rounded-2xl border border-dashed border-primary-200 bg-primary-100/40 text-primary-600">
              <ClipboardListIcon className="size-6" strokeWidth={1.75} />
            </span>
          </Tile>
        </div>
      </div>
    </section>
  );
}

function GroupTile({ group, onClick }) {
  // Titles arrive from the API with stray leading spaces.
  const title = (group.title || '').trim();
  // Category art often points at a file the backend cannot serve, so a broken
  // image degrades to the icon rather than leaving an empty tile.
  const [imageOk, setImageOk] = useState(true);
  const showImage = !!group.img && imageOk;

  return (
    <Tile title={title} onClick={onClick}>
      <span className="flex size-full items-center justify-center overflow-hidden rounded-2xl bg-primary-100/50 text-primary-500">
        {showImage ? (
          <img
            src={group.img}
            alt=""
            loading="lazy"
            className="size-full object-contain p-2"
            onError={() => setImageOk(false)}
          />
        ) : (
          <FolderOpenIcon className="size-6" strokeWidth={1.5} />
        )}
      </span>
    </Tile>
  );
}

function Tile({ title, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-20 shrink-0 flex-col items-center gap-2 outline-none"
    >
      <span className="block size-20 transition-transform group-active:scale-95 group-focus-visible:rounded-2xl group-focus-visible:ring-2 group-focus-visible:ring-primary-300">
        {children}
      </span>
      <span className="line-clamp-2 w-full text-center text-[11px] font-medium leading-snug text-grey-700">
        {title}
      </span>
    </button>
  );
}

function TileSkeleton() {
  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-2">
      <Skeleton className="size-20 rounded-2xl" />
      <Skeleton className="h-3 w-12" />
    </div>
  );
}
