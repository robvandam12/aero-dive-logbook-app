
import { useRecentDiveLogs } from '@/hooks/useRecentDiveLogs';
import { useAuth } from '@/contexts/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { format } from 'date-fns';

export const RecentDiveLogsTable = () => {
    const { user } = useAuth();
    const { data: diveLogs, isLoading } = useRecentDiveLogs(user?.id);

    if (isLoading) {
        return (
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="text-white">Últimas Bitácoras</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }
    
    return (
        <Card className="glass">
            <CardHeader>
                <CardTitle className="text-white">Últimas Bitácoras</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-700">
                            <TableHead className="text-white/80">Fecha</TableHead>
                            <TableHead className="text-white/80">Centro</TableHead>
                            <TableHead className="text-white/80">Punto de Buceo</TableHead>
                            <TableHead className="text-white/80">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {diveLogs?.map((log) => (
                            <TableRow key={log.id} className="border-slate-800">
                                <TableCell className="text-white">{format(new Date(log.log_date), 'dd/MM/yyyy')}</TableCell>
                                <TableCell className="text-white">{log.centers?.name}</TableCell>
                                <TableCell className="text-white">{log.dive_sites?.name}</TableCell>
                                <TableCell>
                                    <Badge variant={log.signature_url ? 'default' : 'secondary'} className={log.signature_url ? 'bg-emerald-600' : 'bg-amber-600'}>
                                        {log.signature_url ? 'Firmada' : 'Pendiente'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {diveLogs?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No has registrado bitácoras recientemente.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
