
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
import { FileText, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDiveLogs } from "@/hooks/useDiveLogs";
import { useAuth } from "@/contexts/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const getStatusBadge = (status: 'draft' | 'signed') => {
  const variants = {
    draft: { label: 'Borrador', variant: 'secondary' as const, className: 'bg-amber-600' },
    signed: { label: 'Firmada', variant: 'default' as const, className: 'bg-emerald-600' }
  };

  return variants[status];
};

export const DiveLogTable = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: diveLogsData, isLoading } = useDiveLogs({ 
    userId: user?.id,
    page: 1,
    perPage: 5 
  });

  if (isLoading) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Bitácoras Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const diveLogs = diveLogsData?.data || [];

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Bitácoras Recientes</CardTitle>
          <Button onClick={() => navigate("/new-dive-log")} className="bg-ocean-gradient hover:opacity-90">
            <FileText className="w-4 h-4 mr-2" />
            Nueva Bitácora
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {diveLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ocean-300">No hay bitácoras registradas</p>
            <Button 
              onClick={() => navigate("/new-dive-log")} 
              className="mt-4 bg-ocean-gradient hover:opacity-90"
            >
              Crear Primera Bitácora
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-ocean-800">
                <TableHead className="text-ocean-300">Fecha</TableHead>
                <TableHead className="text-ocean-300">Centro</TableHead>
                <TableHead className="text-ocean-300">Punto de Buceo</TableHead>
                <TableHead className="text-ocean-300">Supervisor</TableHead>
                <TableHead className="text-ocean-300">Estado</TableHead>
                <TableHead className="text-ocean-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diveLogs.map((log) => {
                const statusBadge = getStatusBadge(log.status);
                return (
                  <TableRow key={log.id} className="border-ocean-800 hover:bg-ocean-950/30">
                    <TableCell className="font-medium text-white">
                      {format(new Date(log.log_date), "dd/MM/yyyy", { locale: es })}
                    </TableCell>
                    <TableCell className="text-ocean-200">{log.centers?.name || 'N/A'}</TableCell>
                    <TableCell className="text-ocean-200">{log.dive_sites?.name || 'N/A'}</TableCell>
                    <TableCell className="text-ocean-200">{log.profiles?.username || 'N/A'}</TableCell>
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
                          title="Editar / Firmar"
                        >
                          <Edit className="w-4 h-4" />
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
