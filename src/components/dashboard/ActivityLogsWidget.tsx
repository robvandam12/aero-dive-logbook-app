
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, Mail, Download, Edit, UserCheck } from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  details: any;
  created_at: string;
  dive_log_id: string;
  user_id: string;
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'created':
      return <FileText className="w-4 h-4" />;
    case 'signed':
      return <UserCheck className="w-4 h-4" />;
    case 'emailed':
      return <Mail className="w-4 h-4" />;
    case 'exported':
      return <Download className="w-4 h-4" />;
    case 'updated':
      return <Edit className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getActionLabel = (action: string) => {
  switch (action) {
    case 'created':
      return 'Creada';
    case 'signed':
      return 'Firmada';
    case 'emailed':
      return 'Enviada';
    case 'exported':
      return 'Exportada';
    case 'updated':
      return 'Actualizada';
    case 'invalidated':
      return 'Invalidada';
    default:
      return action;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'created':
      return 'bg-blue-600';
    case 'signed':
      return 'bg-green-600';
    case 'emailed':
      return 'bg-purple-600';
    case 'exported':
      return 'bg-orange-600';
    case 'updated':
      return 'bg-yellow-600';
    case 'invalidated':
      return 'bg-red-600';
    default:
      return 'bg-gray-600';
  }
};

export const ActivityLogsWidget = () => {
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as ActivityLog[];
    }
  });

  if (isLoading) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        {!activityLogs || activityLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ocean-300">No hay actividad reciente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 bg-ocean-950/30 rounded-lg border border-ocean-800">
                <div className={`p-2 rounded-full ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="secondary" className={`text-xs ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </Badge>
                  </div>
                  <p className="text-sm text-ocean-300">
                    Bitácora {log.dive_log_id.slice(0, 8)}...
                  </p>
                  <p className="text-xs text-ocean-400">
                    {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
