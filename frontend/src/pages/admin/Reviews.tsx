import { useState, useEffect } from 'react';
import { BackLink } from '../../components/BackLink';
import { StarRating } from '../../components/StarRating';
import api from '../../api/client';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/admin/reviews');
      setReviews(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet avis ?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      toast.success('Avis supprimé');
      fetchReviews();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  if (loading) return <div className="text-center py-12 text-dark-400">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <BackLink to="/admin" label="Retour au dashboard" />
      <h1 className="text-2xl font-bold text-dark-900">Modération des avis</h1>

      {reviews.length === 0 ? (
        <p className="text-dark-400">Aucun avis.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r: any) => (
            <div key={r.id} className="bg-white rounded-lg shadow border border-dark-100 p-4 flex justify-between items-start">
              <div>
                <p className="text-sm text-dark-400">
                  Par <strong className="text-dark-700">{r.author?.email}</strong> pour <strong className="text-dark-700">{r.member?.firstName} {r.member?.lastName}</strong>
                </p>
                <StarRating rating={r.rating} size="sm" />
                {r.comment && <p className="text-sm mt-1 text-dark-600">{r.comment}</p>}
                <p className="text-xs text-dark-300 mt-1">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                title="Supprimer"
                className="p-1.5 rounded hover:bg-red-100 text-red-600 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.519.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
