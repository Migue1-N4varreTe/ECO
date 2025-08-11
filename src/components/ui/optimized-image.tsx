import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  showSkeleton?: boolean;
  priority?: boolean;
  aspectRatio?: "square" | "video" | "auto";
  sizes?: string;
}

const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='0.3em' font-family='system-ui' font-size='16' fill='%239ca3af'%3EImagen no disponible%3C/text%3E%3C/svg%3E",
  showSkeleton = true,
  priority = false,
  aspectRatio = "auto",
  sizes,
  className,
  ...props
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, isInView]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };

    img.onerror = () => {
      setImageSrc(fallbackSrc);
      setIsLoading(false);
      setHasError(true);
    };

    // Set responsive image attributes
    if (sizes) {
      img.sizes = sizes;
    }

    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc, sizes, isInView]);

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  }[aspectRatio];

  const containerClasses = cn(
    "relative overflow-hidden bg-gray-100",
    aspectRatioClass,
    className
  );

  // Skeleton loader
  if (showSkeleton && isLoading && !imageSrc) {
    return (
      <div ref={imgRef} className={containerClasses}>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 animate-[shimmer_2s_infinite]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 text-gray-400">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={containerClasses}>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageSrc(fallbackSrc);
            setHasError(true);
            setIsLoading(false);
          }}
          {...props}
        />
      )}
      
      {/* Error state indicator */}
      {hasError && (
        <div className="absolute top-2 right-2">
          <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
            Error
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && imageSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

// Add shimmer animation to global CSS
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%) skewX(-12deg);
    }
    100% {
      transform: translateX(200%) skewX(-12deg);
    }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.querySelector('#shimmer-styles')) {
  const style = document.createElement('style');
  style.id = 'shimmer-styles';
  style.textContent = shimmerStyles;
  document.head.appendChild(style);
}

export default OptimizedImage;

// Specialized variants for common use cases
export const ProductImage = (props: OptimizedImageProps) => (
  <OptimizedImage
    aspectRatio="square"
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
    {...props}
  />
);

export const HeroImage = (props: OptimizedImageProps) => (
  <OptimizedImage
    priority
    aspectRatio="video"
    sizes="100vw"
    {...props}
  />
);

export const CategoryImage = (props: OptimizedImageProps) => (
  <OptimizedImage
    aspectRatio="square"
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
    {...props}
  />
);
