import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { MemberCard } from '../components/MemberCard';
import { Pagination } from '../components/Pagination';
import { SkeletonCard } from '../components/Skeleton';
import { useMembers } from '../hooks/useMembers';
import { useDebounce } from '../hooks/useDebounce';
import { heroConfig } from '../config/hero';

export default function Home() {
  const [search, setSearch] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [minRating, setMinRating] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);
  const debouncedLocation = useDebounce(location);

  const { members, total, totalPages, loading } = useMembers({
    search: debouncedSearch || undefined,
    chapterId: chapterId || undefined,
    sectorId: sectorId || undefined,
    minRating: minRating ? parseFloat(minRating) : undefined,
    location: debouncedLocation || undefined,
    page,
  });

  return (
    <div>
      {/* Hero banner full-width */}
      <div className="relative w-full overflow-hidden">
        <div
          className="h-64 sm:h-72 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroConfig.backgroundImage})` }}
        />
        <div
          className="absolute inset-0 bg-dark-950"
          style={{ opacity: heroConfig.overlayOpacity }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
            {heroConfig.title}
          </h1>
          <p className="text-white/80 mt-3 text-lg max-w-xl">
            {heroConfig.subtitle}{' '}
            <span className="text-gold-400 font-semibold">{heroConfig.highlight}</span>
          </p>
          <div className="w-full max-w-2xl mt-6">
            <SearchBar
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Rechercher un membre, un service..."
            />
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterPanel
            chapterId={chapterId}
            sectorId={sectorId}
            minRating={minRating}
            location={location}
            onChapterChange={(v) => { setChapterId(v); setPage(1); }}
            onSectorChange={(v) => { setSectorId(v); setPage(1); }}
            onMinRatingChange={(v) => { setMinRating(v); setPage(1); }}
            onLocationChange={(v) => { setLocation(v); setPage(1); }}
          />
          {!loading && <span className="text-sm text-dark-400">{total} membre(s) trouvé(s)</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-dark-400">Aucun membre trouvé</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
