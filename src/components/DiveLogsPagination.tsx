
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface DiveLogsPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

export const DiveLogsPagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: DiveLogsPaginationProps) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-ocean-300">
            Página {currentPage} de {totalPages}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-ocean-400">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={
                    page === currentPage
                      ? "bg-ocean-gradient hover:opacity-90"
                      : "border-ocean-600 text-ocean-300 hover:bg-ocean-800"
                  }
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
