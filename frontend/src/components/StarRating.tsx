interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' };

export function StarRating({ rating, onChange, size = 'md' }: StarRatingProps) {
  return (
    <div className={`flex gap-0.5 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${onChange ? 'cursor-pointer' : ''} ${star <= rating ? 'text-gold-400' : 'text-dark-200'}`}
          onClick={() => onChange?.(star)}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}
