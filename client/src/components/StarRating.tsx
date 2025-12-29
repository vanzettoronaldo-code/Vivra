import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export default function StarRating({ 
  value, 
  onChange, 
  readonly = false, 
  size = "md",
  showValue = false 
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };
  
  const handleClick = (star: number) => {
    if (!readonly && onChange) {
      onChange(star);
    }
  };
  
  const handleMouseEnter = (star: number) => {
    if (!readonly) {
      setHoverValue(star);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null);
    }
  };
  
  const displayValue = hoverValue !== null ? hoverValue : value;
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "transition-colors focus:outline-none",
            !readonly && "cursor-pointer hover:scale-110 transition-transform"
          )}
          disabled={readonly}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= displayValue
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            )}
          />
        </button>
      ))}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
