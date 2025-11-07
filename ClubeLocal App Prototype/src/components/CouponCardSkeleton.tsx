import { Card } from './ui/card';

export function CouponCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-slate-800/50 border-slate-700 animate-pulse">
      <div className="relative h-40 bg-slate-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        <div className="h-10 bg-slate-700 rounded w-full mt-4"></div>
      </div>
    </Card>
  );
}

export function CouponGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 pb-20">
      {Array.from({ length: count }).map((_, i) => (
        <CouponCardSkeleton key={i} />
      ))}
    </div>
  );
}

