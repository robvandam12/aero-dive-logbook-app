
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
          <Skeleton className="h-8 w-64 bg-gradient-to-r from-[#6555FF]/10 to-purple-700/10" />
          <Skeleton className="h-4 w-48 bg-ocean-800/30" />
        </div>
        <Skeleton className="h-10 w-32 bg-gradient-to-r from-[#6555FF]/20 to-purple-700/20" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 bg-ocean-800/30" />
              <Skeleton className="h-6 w-6 rounded bg-gradient-to-r from-[#6555FF]/20 to-purple-700/20" />
            </div>
            <Skeleton className="h-8 w-16 bg-gradient-to-r from-[#6555FF]/10 to-purple-700/10" />
            <Skeleton className="h-3 w-20 bg-ocean-800/20" />
          </div>
        ))}
      </div>
      
      {/* Content Area */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-32 bg-gradient-to-r from-[#6555FF]/10 to-purple-700/10" />
          <Skeleton className="h-64 w-full bg-ocean-800/20" />
        </div>
        <div className="glass rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-28 bg-gradient-to-r from-[#6555FF]/10 to-purple-700/10" />
          <Skeleton className="h-64 w-full bg-ocean-800/20" />
        </div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="glass rounded-lg">
      <div className="p-6 border-b border-ocean-700">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 bg-gradient-to-r from-[#6555FF]/10 to-purple-700/10" />
          <Skeleton className="h-10 w-32 bg-gradient-to-r from-[#6555FF]/20 to-purple-700/20" />
        </div>
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-3 border-b border-ocean-800 last:border-0">
            <Skeleton className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6555FF]/10 to-purple-700/10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full bg-ocean-800/30" />
              <Skeleton className="h-3 w-3/4 bg-ocean-800/20" />
            </div>
            <Skeleton className="h-8 w-20 bg-ocean-800/30" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="glass rounded-lg p-6 space-y-6">
      <Skeleton className="h-8 w-64 bg-gradient-to-r from-[#6555FF]/10 to-purple-700/10" />
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: count * 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 bg-ocean-800/30" />
            <Skeleton className="h-10 w-full bg-ocean-800/20" />
          </div>
        ))}
      </div>
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-10 w-24 bg-gradient-to-r from-[#6555FF]/20 to-purple-700/20" />
        <Skeleton className="h-10 w-24 bg-ocean-800/30" />
      </div>
    </div>
  );

  const renderCardsSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-6 rounded bg-gradient-to-r from-[#6555FF]/20 to-purple-700/20" />
            <Skeleton className="h-4 w-16 bg-ocean-800/30" />
          </div>
          <Skeleton className="h-32 w-full rounded bg-ocean-800/20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-ocean-800/30" />
            <Skeleton className="h-4 w-3/4 bg-ocean-800/20" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPageSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-6 bg-gradient-to-r from-[#6555FF]/20 to-purple-700/20" />
        <Skeleton className="h-8 w-48 bg-gradient-to-r from-[#6555FF]/10 to-purple-700/10" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass rounded-lg p-6 space-y-3">
            <Skeleton className="h-6 w-40 bg-gradient-to-r from-[#6555FF]/10 to-purple-700/10" />
            <Skeleton className="h-4 w-full bg-ocean-800/30" />
            <Skeleton className="h-4 w-2/3 bg-ocean-800/20" />
          </div>
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
