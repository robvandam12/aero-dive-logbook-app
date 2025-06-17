
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: 'dashboard' | 'table' | 'form' | 'cards' | 'page';
  count?: number;
}

export const LoadingSkeleton = ({ type = 'page', count = 3 }: LoadingSkeletonProps) => {
  const renderDashboardSkeleton = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-ocean-800/50" />
          <Skeleton className="h-4 w-48 bg-ocean-800/30" />
        </div>
        <Skeleton className="h-10 w-32 bg-ocean-800/50" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg bg-ocean-800/30" />
        ))}
      </div>
      
      {/* Content Area */}
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-80 rounded-lg bg-ocean-800/30" />
        <Skeleton className="h-80 rounded-lg bg-ocean-800/30" />
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-ocean-800/50" />
        <Skeleton className="h-10 w-32 bg-ocean-800/50" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full bg-ocean-800/30" />
        ))}
      </div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64 bg-ocean-800/50" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: count * 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 bg-ocean-800/30" />
            <Skeleton className="h-10 w-full bg-ocean-800/30" />
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24 bg-ocean-800/50" />
        <Skeleton className="h-10 w-24 bg-ocean-800/30" />
      </div>
    </div>
  );

  const renderCardsSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg bg-ocean-800/30" />
          <Skeleton className="h-4 w-full bg-ocean-800/30" />
          <Skeleton className="h-4 w-3/4 bg-ocean-800/20" />
        </div>
      ))}
    </div>
  );

  const renderPageSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-6 bg-ocean-800/50" />
        <Skeleton className="h-8 w-48 bg-ocean-800/50" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full bg-ocean-800/30" />
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'dashboard':
      return renderDashboardSkeleton();
    case 'table':
      return renderTableSkeleton();
    case 'form':
      return renderFormSkeleton();
    case 'cards':
      return renderCardsSkeleton();
    default:
      return renderPageSkeleton();
  }
};
