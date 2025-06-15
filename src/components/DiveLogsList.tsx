
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Eye, Edit, FileSignature, Mail, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDiveLogs } from "@/hooks/useDiveLogs";
import { useAuth } from "@/contexts/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmailDialog } from "@/components/EmailDialog";
import { useSendDiveLogEmail } from "@/hooks/useEmailMutations";
import { useCenters } from "@/hooks/useCenters";
import { Filter, X } from "lucide-react";
import { DiveLogsPagination } from "@/components/DiveLogsPagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useDeleteDiveLog } from "@/hooks/useDiveLogMutations";

const getStatusBadge = (status: 'draft' | 'signed') => {
  const variants = {
    draft: { label: 'Borrador', variant: 'secondary' as const, className: 'bg-amber-600' },
    signed: { label: 'Firmada', variant: 'default' as const, className: 'bg-emerald-600' }
  };

  return variants[status];
};

export const DiveLogsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [centerFilter, setCenterFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<{ id: string; signatureUrl?: string | null } | null>(null);
  
  const { data: diveLogsResponse, isLoading } = useDiveLogs({ 
    userId: user?.id,
    page: currentPage,
    perPage: 20,
    search 
  });

  const { data: centersData } = useCenters();
  const sendEmailMutation = useSendDiveLogEmail();
  const deleteLogMutation = useDeleteDiveLog();

  const handleSign = (logId: string) => {
    navigate(`/dive-logs/${logId}/edit`);
  };

  const handleSendEmail = (logId: string) => {
    setSelectedLogId(logId);
    setEmailDialogOpen(true);
  };

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

  const handleEmailSend = (email: string, name?: string) => {
    if (selectedLogId) {
      sendEmailMutation.mutate({
        diveLogId: selectedLogId,
        recipientEmail: email,
        recipientName: name,
      }, {
        onSuccess: () => {
          setEmailDialogOpen(false);
          setSelectedLogId(null);
        },
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
  const centers = centersData || [];
  const pagination = diveLogsResponse ? {
    currentPage: diveLogsResponse.currentPage,
    totalPages: diveLogsResponse.totalPages,
    hasNextPage: diveLogsResponse.hasNextPage,
    hasPreviousPage: diveLogsResponse.hasPreviousPage,
  } : null;

  // Aplicar filtros
  const filteredLogs = diveLogs.filter((log) => {
    if (statusFilter !== "all" && log.status !== statusFilter) return false;
    if (centerFilter !== "all" && log.centers?.name !== centerFilter) return false;
    return true;
  });

  const hasActiveFilters = statusFilter !== "all" || centerFilter !== "all" || search.trim() !== "";

  return (
    <>
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Mis Bitácoras</CardTitle>
            <Button onClick={() => navigate("/new-dive-log")} className="bg-ocean-gradient hover:opacity-90">
              <FileText className="w-4 h-4 mr-2" />
              Nueva Bitácora
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-400 w-4 h-4" />
              <Input
                placeholder="Buscar bitácoras..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-ocean-950/50 border-ocean-700 text-white placeholder:text-ocean-400"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-ocean-400" />
                <span className="text-ocean-300 text-sm">Filtros:</span>
              </div>
              
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-[140px] bg-ocean-950/50 border-ocean-700 text-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-ocean-950 border-ocean-700">
                  <SelectItem value="all" className="text-white">Todos</SelectItem>
                  <SelectItem value="draft" className="text-white">Borradores</SelectItem>
                  <SelectItem value="signed" className="text-white">Firmadas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={centerFilter} onValueChange={handleCenterFilterChange}>
                <SelectTrigger className="w-full sm:w-[180px] bg-ocean-950/50 border-ocean-700 text-white">
                  <SelectValue placeholder="Centro" />
                </SelectTrigger>
                <SelectContent className="bg-ocean-950 border-ocean-700">
                  <SelectItem value="all" className="text-white">Todos los centros</SelectItem>
                  {centers.map((center) => (
                    <SelectItem key={center.id} value={center.name} className="text-white">
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ocean-300 mb-4">
                {hasActiveFilters ? "No se encontraron bitácoras que coincidan con los filtros aplicados" : 
                 search ? "No se encontraron bitácoras que coincidan con tu búsqueda" : 
                 "No hay bitácoras registradas"}
              </p>
              {!hasActiveFilters && (
                <Button 
                  onClick={() => navigate("/new-dive-log")} 
                  className="bg-ocean-gradient hover:opacity-90"
                >
                  Crear Primera Bitácora
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-ocean-800">
                    <TableHead className="text-ocean-300">Fecha</TableHead>
                    <TableHead className="text-ocean-300">Centro</TableHead>
                    <TableHead className="text-ocean-300">Punto de Buceo</TableHead>
                    <TableHead className="text-ocean-300">Embarcación</TableHead>
                    <TableHead className="text-ocean-300">Estado</TableHead>
                    <TableHead className="text-ocean-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const statusBadge = getStatusBadge(log.status);
                    return (
                      <TableRow key={log.id} className="border-ocean-800 hover:bg-ocean-950/30">
                        <TableCell className="font-medium text-white">
                          {format(new Date(log.log_date), "dd/MM/yyyy", { locale: es })}
                        </TableCell>
                        <TableCell className="text-ocean-200">{log.centers?.name || 'N/A'}</TableCell>
                        <TableCell className="text-ocean-200">{log.dive_sites?.name || 'N/A'}</TableCell>
                        <TableCell className="text-ocean-200">{log.boats?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant} className={`text-xs ${statusBadge.className}`}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-ocean-300 hover:text-white"
                              onClick={() => navigate(`/dive-logs/${log.id}`)}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-ocean-300 hover:text-white"
                              onClick={() => navigate(`/dive-logs/${log.id}/edit`)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {log.status === 'draft' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gold-400 hover:text-gold-300"
                                onClick={() => handleSign(log.id)}
                                title="Firmar bitácora"
                              >
                                <FileSignature className="w-4 h-4" />
                              </Button>
                            )}
                            {log.status === 'signed' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-400 hover:text-green-300"
                                onClick={() => handleSendEmail(log.id)}
                                title="Enviar por correo"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleDeleteClick(log.id, log.signature_url)}
                              title="Eliminar bitácora"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Paginación */}
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
            </>
          )}
        </CardContent>
      </Card>

      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSend={handleEmailSend}
        isLoading={sendEmailMutation.isPending}
      />

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
