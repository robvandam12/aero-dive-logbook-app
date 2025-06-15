
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
import { FileText, Eye, Edit, FileSignature, Mail, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDiveLogs } from "@/hooks/useDiveLogs";
import { useAuth } from "@/contexts/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { data: diveLogsData, isLoading } = useDiveLogs({ 
    userId: user?.id,
    page: 1,
    perPage: 20,
    search 
  });

  const handleSign = (logId: string) => {
    navigate(`/dive-logs/${logId}/edit`);
  };

  const handleSendEmail = (logId: string) => {
    // Placeholder para envío de correo - implementaremos después
    toast({
      title: "Función en desarrollo",
      description: "La función de envío por correo estará disponible próximamente.",
    });
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

  const diveLogs = diveLogsData?.data || [];

  return (
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
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-400 w-4 h-4" />
          <Input
            placeholder="Buscar bitácoras..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-ocean-950/50 border-ocean-700 text-white placeholder:text-ocean-400"
          />
        </div>

        {diveLogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ocean-300 mb-4">
              {search ? "No se encontraron bitácoras que coincidan con tu búsqueda" : "No hay bitácoras registradas"}
            </p>
            <Button 
              onClick={() => navigate("/new-dive-log")} 
              className="bg-ocean-gradient hover:opacity-90"
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
