import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value, max = 5, size = 'md', showValue = true, onChange = null, className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const stars = [];
  for (let i = 1; i <= max; i++) {
    const filled = i <= Math.floor(value);
    const halfFilled = i === Math.ceil(value) && value % 1 !== 0;

    stars.push(
      <button
        key={i}
        type="button"
        onClick={() => onChange && onChange(i)}
        disabled={!onChange}
        className={`${
          onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'
        } transition-transform ${className}`}
        data-testid={`star-${i}`}
      >
        <Star
          className={`${sizes[size]} ${
            filled || halfFilled
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
          }`}
        />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      {showValue && <span className="ml-1 text-sm font-medium">{value.toFixed(1)}</span>}
    </div>
  );
};

export default Rating;
