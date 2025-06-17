
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Mail, Download, XCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DiveLogForTable } from "@/hooks/useDiveLogs";

interface AdminDiveLogsTableProps {
  logs: DiveLogForTable[];
  isLoading: boolean;
}

const getStatusBadge = (status: 'draft' | 'signed' | 'invalidated') => {
  const variants = {
    draft: { label: 'Borrador', variant: 'secondary' as const, className: 'bg-amber-600' },
    signed: { label: 'Firmada', variant: 'default' as const, className: 'bg-emerald-600' },
    invalidated: { label: 'Invalidada', variant: 'destructive' as const, className: 'bg-red-600' }
  };

  return variants[status] || variants.draft;
};

export const AdminDiveLogsTable = ({ logs, isLoading }: AdminDiveLogsTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Todas las Bitácoras</CardTitle>
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

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Todas las Bitácoras</CardTitle>
          <Button 
            onClick={() => navigate("/all-dive-logs")} 
            variant="outline"
            className="border-ocean-700 text-ocean-300"
          >
            Ver Todas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ocean-300">No hay bitácoras registradas</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-ocean-800">
                <TableHead className="text-ocean-300">Fecha</TableHead>
                <TableHead className="text-ocean-300">Centro</TableHead>
                <TableHead className="text-ocean-300">Supervisor</TableHead>
                <TableHead className="text-ocean-300">Estado</TableHead>
                <TableHead className="text-ocean-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const statusBadge = getStatusBadge(log.status);
                return (
                  <TableRow key={log.id} className="border-ocean-800 hover:bg-ocean-950/30">
                    <TableCell className="font-medium text-white">
                      {format(new Date(log.log_date), "dd/MM/yyyy", { locale: es })}
                    </TableCell>
                    <TableCell className="text-ocean-200">{log.centers?.name || 'N/A'}</TableCell>
                    <TableCell className="text-ocean-200">{log.profiles?.username || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadge.variant} className={`text-xs ${statusBadge.className}`}>
                        {statusBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-ocean-300 hover:text-white p-1"
                          onClick={() => navigate(`/dive-logs/${log.id}`)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-ocean-300 hover:text-white p-1"
                          onClick={() => navigate(`/dive-logs/${log.id}/edit`)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {log.status === 'signed' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-400 hover:text-green-300 p-1"
                              title="Enviar por correo"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-400 hover:text-blue-300 p-1"
                              title="Exportar PDF"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Invalidar"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
