import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  phone: string | null;
  email: string;
  whatsapp: string | null;
  location: string | null;
  description: string | null;
  avgRating: number;
  reviewCount: number;
  chapter: { id: string; name: string; city: string };
  sector: { id: string; name: string };
  services: { id: string; name: string; description: string | null }[];
}

interface Filters {
  search?: string;
  chapterId?: string;
  sectorId?: string;
  minRating?: number;
  location?: string;
  page?: number;
}

export function useMembers(filters: Filters = {}) {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.chapterId) params.set('chapterId', filters.chapterId);
      if (filters.sectorId) params.set('sectorId', filters.sectorId);
      if (filters.minRating) params.set('minRating', String(filters.minRating));
      if (filters.location) params.set('location', filters.location);
      if (filters.page) params.set('page', String(filters.page));

      const { data } = await api.get(`/members?${params}`);
      setMembers(data.members);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.chapterId, filters.sectorId, filters.minRating, filters.location, filters.page]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, total, totalPages, loading, refetch: fetchMembers };
}
