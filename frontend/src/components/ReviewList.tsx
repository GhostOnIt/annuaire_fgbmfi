import { StarRating } from './StarRating';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: {
    id: string;
    email: string;
    member?: { firstName: string; lastName: string; photo: string | null } | null;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-dark-400 text-sm">Aucun avis pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow border border-dark-100 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 text-sm font-semibold">
              {review.author.member
                ? `${review.author.member.firstName[0]}${review.author.member.lastName[0]}`
                : review.author.email[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-dark-900">
                {review.author.member
                  ? `${review.author.member.firstName} ${review.author.member.lastName}`
                  : review.author.email}
              </p>
              <p className="text-xs text-dark-300">
                {new Date(review.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
          {review.comment && <p className="text-sm text-dark-600 mt-2">{review.comment}</p>}
        </div>
      ))}
    </div>
  );
}
