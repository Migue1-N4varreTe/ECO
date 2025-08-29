export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-white">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}
