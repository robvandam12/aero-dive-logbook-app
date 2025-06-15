
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
import { FileText, Eye, Edit, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DiveLog {
  id: string;
  folio: string;
  fecha: string;
  centro: string;
  supervisor: string;
  estado: 'draft' | 'signed' | 'sent';
  buzos: number;
}

const mockData: DiveLog[] = [
  {
    id: '1',
    folio: 'BTC-2024-001',
    fecha: '2024-01-15',
    centro: 'Puerto Valparaíso',
    supervisor: 'Juan Díaz',
    estado: 'sent',
    buzos: 3
  },
  {
    id: '2',
    folio: 'BTC-2024-002',
    fecha: '2024-01-16',
    centro: 'Puerto San Antonio',
    supervisor: 'María González',
    estado: 'signed',
    buzos: 2
  },
  {
    id: '3',
    folio: 'BTC-2024-003',
    fecha: '2024-01-17',
    centro: 'Puerto Valparaíso',
    supervisor: 'Carlos Ruiz',
    estado: 'draft',
    buzos: 4
  }
];

const getStatusBadge = (estado: DiveLog['estado']) => {
  const variants = {
    draft: { label: 'Borrador', variant: 'secondary' as const },
    signed: { label: 'Firmada', variant: 'outline' as const },
    sent: { label: 'Enviada', variant: 'default' as const }
  };

  return variants[estado];
};

export const DiveLogTable = () => {
  const navigate = useNavigate();

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
        <Table>
          <TableHeader>
            <TableRow className="border-ocean-800">
              <TableHead className="text-ocean-300">Folio</TableHead>
              <TableHead className="text-ocean-300">Fecha</TableHead>
              <TableHead className="text-ocean-300">Centro</TableHead>
              <TableHead className="text-ocean-300">Supervisor</TableHead>
              <TableHead className="text-ocean-300">Buzos</TableHead>
              <TableHead className="text-ocean-300">Estado</TableHead>
              <TableHead className="text-ocean-300">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((log) => {
              const statusBadge = getStatusBadge(log.estado);
              return (
                <TableRow key={log.id} className="border-ocean-800 hover:bg-ocean-950/30">
                  <TableCell className="font-medium text-white">{log.folio}</TableCell>
                  <TableCell className="text-ocean-200">{log.fecha}</TableCell>
                  <TableCell className="text-ocean-200">{log.centro}</TableCell>
                  <TableCell className="text-ocean-200">{log.supervisor}</TableCell>
                  <TableCell className="text-ocean-200">{log.buzos}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadge.variant} className="text-xs">
                      {statusBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-ocean-300 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {log.estado !== 'sent' && (
                        <Button variant="ghost" size="sm" className="text-ocean-300 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {log.estado === 'signed' && (
                        <Button variant="ghost" size="sm" className="text-ocean-300 hover:text-white">
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
