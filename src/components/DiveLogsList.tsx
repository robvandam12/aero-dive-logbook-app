
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useDiveLogs, DiveLogForTable } from '@/hooks/useDiveLogs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DiveLogsList = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useDiveLogs({
    userId: user?.id,
    page,
    perPage,
    search,
  });

  const totalPages = data?.count ? Math.ceil(data.count / perPage) : 0;

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => (totalPages > prev ? prev + 1 : prev));
  };

  const tableContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-slate-800">
          <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
        </TableRow>
      ));
    }
    if (isError) {
      return <TableRow><TableCell colSpan={6} className="text-center text-red-500 py-8">Error al cargar las bitácoras.</TableCell></TableRow>;
    }
    if (data?.data.length === 0) {
      return <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No se encontraron bitácoras.</TableCell></TableRow>;
    }
    return data?.data.map((log: DiveLogForTable) => (
      <TableRow key={log.id} className="border-slate-800 hover:bg-ocean-950/30">
        <TableCell className="text-white">{format(new Date(log.log_date), 'dd/MM/yyyy')}</TableCell>
        <TableCell className="text-white">{log.centers?.name || 'N/A'}</TableCell>
        <TableCell className="text-white">{log.dive_sites?.name || 'N/A'}</TableCell>
        <TableCell className="text-white">{log.boats?.name || 'N/A'}</TableCell>
        <TableCell>
          <Badge variant={log.signature_url ? 'default' : 'secondary'} className={log.signature_url ? 'bg-emerald-600' : 'bg-amber-600'}>
            {log.signature_url ? 'Firmada' : 'Pendiente'}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="text-ocean-300 hover:text-white h-8 w-8">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-ocean-300 hover:text-white h-8 w-8">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Bitácoras Registradas</CardTitle>
          {/* Add search and filters here later */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-ocean-800 hover:bg-transparent">
                <TableHead className="text-ocean-300">Fecha</TableHead>
                <TableHead className="text-ocean-300">Centro</TableHead>
                <TableHead className="text-ocean-300">Punto de Buceo</TableHead>
                <TableHead className="text-ocean-300">Embarcación</TableHead>
                <TableHead className="text-ocean-300">Estado</TableHead>
                <TableHead className="text-ocean-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableContent()}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
             <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePreviousPage(); }} aria-disabled={page === 1} className={page === 1 ? 'pointer-events-none opacity-50' : ''} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handleNextPage(); }} aria-disabled={page === totalPages} className={page === totalPages ? 'pointer-events-none opacity-50' : ''}/>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
