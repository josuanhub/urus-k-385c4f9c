import React from 'react';

const SkeletonBlock = ({ className = '' }) => (
  <div className={`bg-gradient-to-r from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] rounded ${className}`} />
);

const TableSkeleton = ({ rows, cols }) => (
  <div className="w-full overflow-x-auto">
    {/* Header */}
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#6C63FF]/20 mb-1">
      {Array.from({ length: cols }).map((_, ci) => (
        <SkeletonBlock
          key={ci}
          className={`h-4 ${ci === 0 ? 'w-32' : ci === cols - 1 ? 'w-20 ml-auto' : 'flex-1'}`}
        />
      ))}
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, ri) => (
      <div
        key={ri}
        className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 ${
          ri % 2 === 0 ? 'bg-white/[0.02]' : ''
        }`}
      >
        {/* Checkbox placeholder */}
        <SkeletonBlock className="h-4 w-4 rounded-sm flex-shrink-0" />

        {Array.from({ length: cols }).map((_, ci) => (
          <SkeletonBlock
            key={ci}
            className={`h-3 ${
              ci === 0
                ? 'w-28'
                : ci === cols - 1
                ? 'w-16 ml-auto'
                : `flex-1 max-w-[${Math.floor(Math.random() * 40) + 40}%]`
            }`}
            style={{ maxWidth: ci !== 0 && ci !== cols - 1 ? `${50 + (ri * 13 + ci * 17) % 40}%` : undefined }}
          />
        ))}

        {/* Action dots */}
        <div className="flex gap-1 flex-shrink-0">
          {[1, 2, 3].map((d) => (
            <SkeletonBlock key={d} className="h-2 w-2 rounded-full" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const CardsSkeleton = ({ rows, cols }) => {
  const total = rows * Math.min(cols, 4);
  return (
    <div
      className={`grid gap-4 grid-cols-1 ${
        cols >= 2 ? 'sm:grid-cols-2' : ''
      } ${cols >= 3 ? 'lg:grid-cols-3' : ''} ${cols >= 4 ? 'xl:grid-cols-4' : ''}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="bg-[#1A1A2E] border border-[#6C63FF]/10 rounded-xl p-5 flex flex-col gap-4"
        >
          {/* Card header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <SkeletonBlock className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex flex-col gap-2">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-2 w-16" />
              </div>
            </div>
            {/* Badge */}
            <SkeletonBlock className="h-5 w-14 rounded-full" />
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Content lines */}
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-2 w-full" />
            <SkeletonBlock className="h-2 w-5/6" />
            <SkeletonBlock className="h-2 w-4/6" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col gap-1 items-center">
                <SkeletonBlock className="h-4 w-10" />
                <SkeletonBlock className="h-2 w-8" />
              </div>
            ))}
          </div>

          {/* Footer button */}
          <SkeletonBlock className="h-8 w-full rounded-lg mt-auto" />
        </div>
      ))}
    </div>
  );
};

const ListSkeleton = ({ rows }) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 bg-[#1A1A2E] border border-[#6C63FF]/10 rounded-xl px-4 py-3"
      >
        {/* Index / icon */}
        <SkeletonBlock className="h-8 w-8 rounded-lg flex-shrink-0" />

        {/* Main content */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <SkeletonBlock className={`h-3 ${i % 3 === 0 ? 'w-48' : i % 3 === 1 ? 'w-36' : 'w-56'}`} />
          <SkeletonBlock className={`h-2 ${i % 2 === 0 ? 'w-64' : 'w-48'}`} />
        </div>

        {/* Middle meta (hidden on mobile) */}
        <div className="hidden sm:flex flex-col gap-2 items-end w-28 flex-shrink-0">
          <SkeletonBlock className="h-2 w-20" />
          <SkeletonBlock className="h-2 w-14" />
        </div>

        {/* Status badge */}
        <SkeletonBlock className="hidden sm:block h-5 w-16 rounded-full flex-shrink-0" />

        {/* Arrow / action */}
        <SkeletonBlock className="h-5 w-5 rounded flex-shrink-0" />
      </div>
    ))}
  </div>
);

const LoadingSkeleton = ({ rows = 5, cols = 3, type = 'table' }) => {
  const safeRows = Math.max(1, Math.min(rows, 20));
  const safeCols = Math.max(1, Math.min(cols, 6));

  return (
    <div
      className="w-full animate-pulse"
      role="status"
      aria-label="Cargando contenido…"
      aria-busy="true"
    >
      {/* Top toolbar skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        {/* Search bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SkeletonBlock className="h-9 w-full sm:w-64 rounded-lg" />
          <SkeletonBlock className="h-9 w-9 rounded-lg flex-shrink-0" />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SkeletonBlock className="h-9 w-24 rounded-lg" />
          <SkeletonBlock className="h-9 w-9 rounded-lg" />
          <SkeletonBlock className="h-9 w-9 rounded-lg" />
        </div>
      </div>

      {/* Main content area */}
      <div className="bg-[#0A0A0F] border border-[#6C63FF]/10 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
        {/* Inner header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#6C63FF]/10 bg-[#1A1A2E]/40">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-4 w-4 rounded-sm" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-5 w-20 rounded-full" />
            <SkeletonBlock className="h-5 w-12 rounded-full" />
          </div>
        </div>

        {/* Variant content */}
        <div className={type === 'table' ? '' : 'p-4'}>
          {type === 'table' && (
            <TableSkeleton rows={safeRows} cols={safeCols} />
          )}
          {type === 'cards' && (
            <CardsSkeleton rows={safeRows} cols={safeCols} />
          )}
          {type === 'list' && (
            <ListSkeleton rows={safeRows} />
          )}
        </div>

        {/* Footer pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#6C63FF]/10 bg-[#1A1A2E]/40">
          <SkeletonBlock className="h-3 w-36" />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((p) => (
              <SkeletonBlock
                key={p}
                className={`h-8 rounded-lg ${p === 3 ? 'w-10 bg-[#6C63FF]/30' : 'w-8'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Accessibility text */}
      <span className="sr-only">Cargando datos del sistema k…</span>
    </div>
  );
};

export default LoadingSkeleton;