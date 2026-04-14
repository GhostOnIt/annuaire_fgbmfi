import { useState, useEffect } from 'react';
import api from '../api/client';

interface Chapter {
  id: string;
  name: string;
  city: string;
}

interface Sector {
  id: string;
  name: string;
}

interface FilterPanelProps {
  chapterId: string;
  sectorId: string;
  minRating: string;
  location: string;
  onChapterChange: (id: string) => void;
  onSectorChange: (id: string) => void;
  onMinRatingChange: (rating: string) => void;
  onLocationChange: (location: string) => void;
}

export function FilterPanel({
  chapterId, sectorId, minRating, location,
  onChapterChange, onSectorChange, onMinRatingChange, onLocationChange,
}: FilterPanelProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);

  useEffect(() => {
    api.get('/chapters').then(({ data }) => setChapters(data));
    api.get('/sectors').then(({ data }) => setSectors(data));
  }, []);

  const selectClass = "px-3 py-2 border border-dark-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none";

  return (
    <div className="flex flex-wrap gap-3">
      <select value={chapterId} onChange={(e) => onChapterChange(e.target.value)} className={selectClass}>
        <option value="">Tous les chapitres</option>
        {chapters.map((ch) => (
          <option key={ch.id} value={ch.id}>{ch.name}</option>
        ))}
      </select>

      <select value={sectorId} onChange={(e) => onSectorChange(e.target.value)} className={selectClass}>
        <option value="">Tous les secteurs</option>
        {sectors.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <select value={minRating} onChange={(e) => onMinRatingChange(e.target.value)} className={selectClass}>
        <option value="">Toutes les notes</option>
        <option value="4">4 et plus</option>
        <option value="3">3 et plus</option>
        <option value="2">2 et plus</option>
      </select>

      <input
        type="text"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        placeholder="Localisation..."
        className="px-3 py-2 border border-dark-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
      />
    </div>
  );
}
