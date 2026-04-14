import { useState } from 'react';
import { StarRating } from './StarRating';
import api from '../api/client';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  memberId: string;
  onReviewAdded: () => void;
}

export function ReviewForm({ memberId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Veuillez donner une note');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/members/${memberId}/reviews`, { rating, comment: comment || undefined });
      toast.success('Avis ajouté');
      setRating(0);
      setComment('');
      onReviewAdded();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-dark-100 p-4 space-y-3">
      <h3 className="font-semibold text-dark-900">Laisser un avis</h3>
      <StarRating rating={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Votre commentaire (optionnel)"
        className="w-full px-3 py-2 border border-dark-200 rounded-lg resize-none focus:ring-2 focus:ring-gold-400 outline-none"
        rows={3}
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-gold-400 disabled:opacity-50 transition font-semibold"
      >
        {submitting ? 'Envoi...' : 'Publier'}
      </button>
    </form>
  );
}
