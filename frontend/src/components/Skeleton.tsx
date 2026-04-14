export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-dark-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-dark-100" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-dark-100 rounded w-3/4" />
        <div className="h-4 bg-dark-100 rounded w-1/2" />
        <div className="h-3 bg-dark-100 rounded w-2/3" />
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 bg-dark-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-lg shadow border border-dark-100 overflow-hidden animate-pulse">
      <div className="h-12 bg-dark-100" />
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-4 py-3 border-t border-dark-50">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 bg-dark-100 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-dark-100 overflow-hidden animate-pulse">
      <div className="md:flex">
        <div className="md:w-1/3 h-64 bg-dark-100" />
        <div className="p-6 md:w-2/3 space-y-4">
          <div className="h-7 bg-dark-100 rounded w-1/2" />
          <div className="h-4 bg-dark-100 rounded w-1/3" />
          <div className="h-4 bg-dark-100 rounded w-1/4" />
          <div className="h-20 bg-dark-100 rounded w-full mt-4" />
          <div className="flex gap-2 mt-4">
            <div className="h-8 bg-dark-100 rounded w-24" />
            <div className="h-8 bg-dark-100 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
