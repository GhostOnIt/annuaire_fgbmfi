interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded text-sm border border-dark-200 bg-white hover:border-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        Précédent
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-dark-300">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded text-sm transition ${
              page === p
                ? 'bg-gold-500 text-white font-semibold'
                : 'bg-white border border-dark-200 hover:border-gold-400 text-dark-600'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded text-sm border border-dark-200 bg-white hover:border-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        Suivant
      </button>

      <span className="text-xs text-dark-400 ml-2">
        Page {page} sur {totalPages}
      </span>
    </div>
  );
}
