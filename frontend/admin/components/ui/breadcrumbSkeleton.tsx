import { Skeleton } from '@heroui/react';

export default function HeaderSkeleton() {
  return (
    <div className="mb-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <div className="flex items-center gap-4">
          <Skeleton className="p-3 rounded-xl border w-12 h-12 bg-default-200 flex items-center justify-center" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
        </div>
      </div>
      <div className="border py-3 px-4 rounded-lg bg-default-50 mb-4 mt-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
