import { Skeleton } from '@/components/ui/skeleton';

function SkeletonCard() {
  return (
    <div className="bg-card-bg rounded-lg overflow-hidden neon-border">
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red/30 to-transparent" />
      <div className="px-4 pt-4 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-md shimmer bg-foreground/5" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32 shimmer bg-foreground/5" />
            <Skeleton className="h-3 w-16 shimmer bg-foreground/5" />
          </div>
        </div>
        <Skeleton className="h-5 w-14 rounded-sm shimmer bg-foreground/5" />
      </div>
      <div className="mx-4 h-px bg-neon-red/10" />
      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-7 h-7 rounded-md shimmer bg-foreground/5" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-16 shimmer bg-foreground/5" />
            <Skeleton className="h-4 w-10 shimmer bg-foreground/5" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-7 h-7 rounded-md shimmer bg-foreground/5" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-16 shimmer bg-foreground/5" />
            <Skeleton className="h-4 w-10 shimmer bg-foreground/5" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <Skeleton className="h-10 w-full rounded-md shimmer bg-foreground/5" />
      </div>
    </div>
  );
}

export default function MatchListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
