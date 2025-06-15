
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDiveLogs } from "@/hooks/useDiveLogs";
import { useAuth } from "@/contexts/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DiveLogsPagination } from "@/components/DiveLogsPagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useDeleteDiveLog } from "@/hooks/useDiveLogMutations";
import { DiveLogsFilters } from "@/components/DiveLogsFilters";
import { DiveLogsTableContent } from "@/components/DiveLogsTableContent";

export const DiveLogsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [centerFilter, setCenterFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<{ id: string; signatureUrl?: string | null } | null>(null);
  
  const { data: diveLogsResponse, isLoading } = useDiveLogs({ 
    userId: user?.id,
    page: currentPage,
    perPage: 20,
    search,
    status: statusFilter as 'draft' | 'signed' | 'all',
    centerName: centerFilter
  });

  const deleteLogMutation = useDeleteDiveLog();

  const handleDeleteClick = (logId: string, signatureUrl?: string | null) => {
    setLogToDelete({ id: logId, signatureUrl });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (logToDelete) {
      deleteLogMutation.mutate({
        id: logToDelete.id,
        signatureUrl: logToDelete.signatureUrl
      }, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setLogToDelete(null);
          toast({
            title: "Bitácora eliminada",
            description: "La bitácora ha sido eliminada correctamente."
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error al eliminar",
            description: error.message,
            variant: "destructive"
          });
        }
      });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCenterFilter("all");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleCenterFilterChange = (value: string) => {
    setCenterFilter(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Mis Bitácoras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const diveLogs = diveLogsResponse?.data || [];
  const pagination = diveLogsResponse ? {
    currentPage: diveLogsResponse.currentPage,
    totalPages: diveLogsResponse.totalPages,
    hasNextPage: diveLogsResponse.hasNextPage,
    hasPreviousPage: diveLogsResponse.hasPreviousPage,
    count: diveLogsResponse.count
  } : null;

  const hasActiveFilters = statusFilter !== "all" || centerFilter !== "all" || search.trim() !== "";

  return (
    <>
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Mis Bitácoras</CardTitle>
              {pagination && (
                <p className="text-sm text-ocean-300 mt-1">
                  {pagination.count} bitácora{pagination.count !== 1 ? 's' : ''} encontrada{pagination.count !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <Button onClick={() => navigate("/new-dive-log")} className="bg-ocean-gradient hover:opacity-90">
              <FileText className="w-4 h-4 mr-2" />
              Nueva Bitácora
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DiveLogsFilters
            search={search}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            centerFilter={centerFilter}
            onCenterFilterChange={handleCenterFilterChange}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />

          <DiveLogsTableContent
            diveLogs={diveLogs}
            hasActiveFilters={hasActiveFilters}
            search={search}
            onDelete={handleDeleteClick}
          />

          {pagination && (
            <div className="mt-6">
              <DiveLogsPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Bitácora"
        description="¿Estás seguro de que deseas eliminar esta bitácora? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLogMutation.isPending}
        variant="destructive"
      />
    </>
  );
};
