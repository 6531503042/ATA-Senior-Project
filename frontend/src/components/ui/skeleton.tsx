import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "card" | "text" | "avatar" | "badge";
}

export function Skeleton({
  className,
  variant = "text",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200/80",
        {
          "h-4 w-full": variant === "text",
          "h-10 w-10 rounded-full": variant === "avatar",
          "h-6 w-20 rounded-full": variant === "badge",
          "w-full h-[180px]": variant === "card",
        },
        className,
      )}
      {...props}
    />
  );
}

export function FeedbackCardSkeleton() {
  return (
    <div className="p-6 border rounded-xl bg-white">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <div className="flex gap-2">
              <Skeleton variant="badge" />
              <Skeleton variant="badge" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton variant="badge" />
            <Skeleton variant="badge" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="p-6 border rounded-xl bg-white">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export function InsightCardSkeleton() {
  return (
    <div className="p-6 border rounded-xl bg-white">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SubmissionDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="border rounded-xl bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl bg-white/20" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/20" />
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-xl bg-white p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-32 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
