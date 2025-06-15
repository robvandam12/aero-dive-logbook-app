
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { DiveLogsActions } from "@/components/DiveLogsActions";
import { DiveLogForTable } from "@/hooks/useDiveLogs";

interface DiveLogsTableContentProps {
  diveLogs: DiveLogForTable[];
  hasActiveFilters: boolean;
  search: string;
  onSendEmail: (logId: string) => void;
  onDelete: (logId: string, signatureUrl?: string | null) => void;
}

const getStatusBadge = (status: 'draft' | 'signed') => {
  const variants = {
    draft: { label: 'Borrador', variant: 'secondary' as const, className: 'bg-amber-600' },
    signed: { label: 'Firmada', variant: 'default' as const, className: 'bg-emerald-600' }
  };

  return variants[status];
};

export const DiveLogsTableContent = ({
  diveLogs,
  hasActiveFilters,
  search,
  onSendEmail,
  onDelete,
}: DiveLogsTableContentProps) => {
  const navigate = useNavigate();

  if (diveLogs.length === 0) {
    return (
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
    );
  }

  return (
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
        {diveLogs.map((log) => {
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
                <DiveLogsActions
                  logId={log.id}
                  status={log.status}
                  signatureUrl={log.signature_url}
                  onSendEmail={onSendEmail}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
