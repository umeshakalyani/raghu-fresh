import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { getRealisticProductImage } from '../../data/productImages';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackText?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-contain',
  containerClassName = '',
  fallbackText = 'No Image Available',
  aspectRatio = 'square'
}) => {
  // Determine primary candidate image: either passed in src, or realistic mapped image for this product
  const defaultImage = getRealisticProductImage(alt);
  const initialUrl = src || defaultImage;

  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [triedFallback, setTriedFallback] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state if src or alt changes
  useEffect(() => {
    const nextUrl = src || getRealisticProductImage(alt);
    setCurrentSrc(nextUrl);
    setTriedFallback(false);
    setHasError(false);
    setIsLoading(true);
  }, [src, alt]);

  const handleImageError = () => {
    if (!triedFallback && defaultImage && currentSrc !== defaultImage) {
      // Try the realistic photo from our catalog
      setTriedFallback(true);
      setCurrentSrc(defaultImage);
      setIsLoading(true);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  // If even the realistic fallback failed, show clean camera placeholder
  if (hasError || !currentSrc) {
    return (
      <div 
        className={`w-full h-full flex flex-col items-center justify-center p-3 text-center bg-stone-50 border border-stone-200/60 rounded-lg select-none ${containerClassName}`}
        title={`Raghu Fresh - ${alt}`}
      >
        <div className="w-8 h-8 rounded-full bg-stone-200/80 text-stone-500 flex items-center justify-center mb-1 shrink-0">
          <Camera className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-medium text-stone-700 leading-tight">
          {alt}
        </span>
        <span className="text-[9px] text-stone-400 mt-0.5">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-white overflow-hidden ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-50/80 animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-emerald-700 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoading(false)}
        onError={handleImageError}
        className={`${className} transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};
