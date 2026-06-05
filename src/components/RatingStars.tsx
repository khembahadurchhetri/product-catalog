type RatingStarsProps = {
  rating: number;
  label?: string;
  compact?: boolean;
};

export function RatingStars({ rating, label, compact }: RatingStarsProps) {
  const rounded = Math.round(rating * 2) / 2;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const value = i + 1;
    const filled = rounded >= value;
    const half = !filled && rounded >= value - 0.5;
    return { filled, half };
  });

  return (
    <div
      className={`flex items-center gap-0.5 ${compact ? "" : "gap-1"}`}
      role="img"
      aria-label={label ?? `Rating ${rating} out of 5`}
    >
      {stars.map((star, index) => (
        <span
          key={index}
          className={`${compact ? "text-xs" : "text-sm"} ${
            star.filled
              ? "text-neutral-900"
              : star.half
                ? "text-neutral-400"
                : "text-neutral-300"
          }`}
          aria-hidden
        >
          ★
        </span>
      ))}
      {!compact && (
        <span className="ml-1 text-sm text-neutral-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
