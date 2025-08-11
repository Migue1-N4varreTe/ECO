import { cn } from "@/lib/utils";

// Base skeleton component with shimmer animation
export const Skeleton = ({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
        "animate-[shimmer_2s_infinite]",
        className
      )}
      {...props}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("border rounded-lg p-4 space-y-4", className)}>
    {/* Image */}
    <Skeleton className="aspect-square w-full rounded-lg" />
    
    {/* Brand */}
    <Skeleton className="h-3 w-16" />
    
    {/* Product name */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    
    {/* Rating */}
    <div className="flex items-center gap-2">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-8" />
    </div>
    
    {/* Delivery time and location */}
    <div className="flex justify-between">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-12" />
    </div>
    
    {/* Price */}
    <div className="flex items-center gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-4 w-8" />
    </div>
    
    {/* Button */}
    <Skeleton className="h-10 w-full rounded-md" />
  </div>
);

// Category Card Skeleton
export const CategoryCardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("border rounded-xl p-4 space-y-3", className)}>
    {/* Image */}
    <Skeleton className="aspect-square w-full rounded-lg" />
    
    {/* Category name */}
    <Skeleton className="h-5 w-3/4" />
    
    {/* Product count */}
    <Skeleton className="h-3 w-1/2" />
    
    {/* Aisle info */}
    <Skeleton className="h-3 w-1/3" />
  </div>
);

// Navbar Skeleton
export const NavbarSkeleton = () => (
  <nav className="bg-white shadow-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="ml-2 h-6 w-32" />
        </div>
        
        {/* Navigation links - desktop */}
        <div className="hidden md:flex space-x-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
        
        {/* Search bar */}
        <div className="hidden sm:flex flex-1 max-w-lg mx-5">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        
        {/* Right side icons */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  </nav>
);

// Cart Item Skeleton
export const CartItemSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("flex gap-4 p-4 border-b", className)}>
    {/* Product image */}
    <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
    
    <div className="flex-1 space-y-2">
      {/* Product name */}
      <Skeleton className="h-4 w-3/4" />
      
      {/* Brand */}
      <Skeleton className="h-3 w-1/4" />
      
      <div className="flex justify-between items-center">
        {/* Quantity controls */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        
        {/* Price */}
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
    
    {/* Remove button */}
    <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
  </div>
);

// Checkout Summary Skeleton
export const CheckoutSkeleton = () => (
  <div className="space-y-6">
    {/* Order summary */}
    <div className="border rounded-lg p-4 space-y-4">
      <Skeleton className="h-6 w-32" />
      
      {/* Cart items */}
      {Array.from({ length: 3 }).map((_, i) => (
        <CartItemSkeleton key={i} className="border-0 p-0" />
      ))}
      
      {/* Totals */}
      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex justify-between font-bold">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
    
    {/* Payment form */}
    <div className="border rounded-lg p-4 space-y-4">
      <Skeleton className="h-6 w-40" />
      
      {/* Form fields */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      
      {/* Submit button */}
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  </div>
);

// Search Results Skeleton
export const SearchResultsSkeleton = () => (
  <div className="space-y-6">
    {/* Search header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-32" />
    </div>
    
    {/* Filters */}
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-full" />
      ))}
    </div>
    
    {/* Results grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Profile Page Skeleton
export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    {/* Profile header */}
    <div className="flex items-center gap-6">
      <Skeleton className="w-24 h-24 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    
    {/* Profile sections */}
    <div className="grid md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Orders List Skeleton
export const OrdersListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="border rounded-lg p-4 space-y-3">
        {/* Order header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Order items */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, j) => (
            <Skeleton key={j} className="w-12 h-12 rounded-md" />
          ))}
          {i > 2 && <Skeleton className="w-12 h-12 rounded-md" />}
        </div>
        
        {/* Order footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4 
}: { 
  rows?: number; 
  columns?: number; 
}) => (
  <div className="border rounded-lg overflow-hidden">
    {/* Table header */}
    <div className="bg-gray-50 p-4 border-b">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-16" />
        ))}
      </div>
    </div>
    
    {/* Table rows */}
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Add shimmer animation to CSS if not already present
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

if (typeof document !== 'undefined' && !document.querySelector('#shimmer-styles-skeleton')) {
  const style = document.createElement('style');
  style.id = 'shimmer-styles-skeleton';
  style.textContent = shimmerStyles;
  document.head.appendChild(style);
}

// Utility function to wrap content with skeleton while loading
export const withSkeleton = <T,>(
  isLoading: boolean,
  content: T,
  skeleton: React.ReactNode
): T | React.ReactNode => {
  return isLoading ? skeleton : content;
};

// Page-level skeleton layouts
export const PageSkeleton = ({ type }: { type?: 'shop' | 'profile' | 'checkout' | 'orders' }) => {
  switch (type) {
    case 'shop':
      return (
        <div className="min-h-screen bg-gray-50">
          <NavbarSkeleton />
          <div className="container mx-auto px-4 py-8">
            <SearchResultsSkeleton />
          </div>
        </div>
      );
      
    case 'profile':
      return (
        <div className="min-h-screen bg-gray-50">
          <NavbarSkeleton />
          <div className="container mx-auto px-4 py-8">
            <ProfileSkeleton />
          </div>
        </div>
      );
      
    case 'checkout':
      return (
        <div className="min-h-screen bg-gray-50">
          <NavbarSkeleton />
          <div className="container mx-auto px-4 py-8">
            <CheckoutSkeleton />
          </div>
        </div>
      );
      
    case 'orders':
      return (
        <div className="min-h-screen bg-gray-50">
          <NavbarSkeleton />
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />
              <OrdersListSkeleton />
            </div>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="min-h-screen bg-gray-50">
          <NavbarSkeleton />
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
              <Skeleton className="h-12 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
  }
};
