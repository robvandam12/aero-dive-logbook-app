
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DiveLogWithFullDetails } from './useDiveLog';

// Define the diver manifest type for proper type checking
interface DiverManifest {
  name: string;
  role: string;
  [key: string]: any;
}

export const useExcelExport = () => {
  const { toast } = useToast();

  const exportSingleDiveLog = async (diveLog: DiveLogWithFullDetails) => {
    try {
      // Parse divers manifest safely
      const diversManifest = Array.isArray(diveLog.divers_manifest) 
        ? diveLog.divers_manifest as DiverManifest[]
        : [];

      // Format dive log data according to the Excel structure shown in the image
      const excelData = [{
        'Fecha': diveLog.log_date,
        'N° Boleta': diveLog.id.slice(-6),
        'Centro\nEmbarcacion': `${diveLog.centers?.name || 'N/A'}\n${diveLog.boats?.name || 'N/A'}`,
        'Trabajo realizado': (diveLog as any).work_type || 'MANTENCIÓN',
        'Supervisor de Buceo': diveLog.profiles?.username || 'N/A',
        'Buzos': diversManifest
          .filter(d => d.role !== 'BB.EE')
          .map(d => d.name)
          .join('\n'),
        'Buzo de Emergencia': diversManifest
          .filter(d => d.role === 'BB.EE')
          .map(d => d.name)
          .join('\n'),
        'Detalle trabajos realizados / Observaciones': (diveLog as any).work_details || diveLog.observations || ''
      }];

      // Convert to CSV format for download
      const headers = Object.keys(excelData[0]);
      const csvContent = [
        headers.join('\t'),
        ...excelData.map(row => headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join('\t'))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bitacora_${diveLog.id.slice(-6)}_${diveLog.log_date}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportación exitosa",
        description: "La bitácora ha sido exportada a Excel",
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Error en exportación",
        description: "No se pudo exportar la bitácora",
        variant: "destructive",
      });
    }
  };

  const exportMultipleDiveLogs = async (
    format: 'control-diario' | 'detalle-boletas', 
    dateRange?: { from?: Date; to?: Date },
    selectedCenter?: string
  ) => {
    try {
      // Build query filters
      let query = supabase
        .from('dive_logs')
        .select(`
          id,
          log_date,
          work_type,
          work_details,
          observations,
          divers_manifest,
          centers (name),
          boats (name),
          profiles (username)
        `)
        .order('log_date', { ascending: false });

      // Apply filters
      if (dateRange?.from) {
        query = query.gte('log_date', dateRange.from.toISOString().split('T')[0]);
      }
      if (dateRange?.to) {
        query = query.lte('log_date', dateRange.to.toISOString().split('T')[0]);
      }
      if (selectedCenter && selectedCenter !== 'all') {
        query = query.eq('centers.name', selectedCenter);
      }

      const { data: diveLogs, error } = await query;

      if (error) throw error;

      if (!diveLogs || diveLogs.length === 0) {
        toast({
          title: "Sin datos",
          description: "No se encontraron bitácoras con los filtros aplicados",
          variant: "destructive",
        });
        return;
      }

      // Format data according to format type
      const excelData = diveLogs.map(diveLog => {
        const diversManifest = Array.isArray(diveLog.divers_manifest) 
          ? diveLog.divers_manifest as DiverManifest[]
          : [];

        return {
          'Fecha': diveLog.log_date,
          'N° Boleta': diveLog.id.slice(-6),
          'Centro\nEmbarcacion': `${(diveLog.centers as any)?.name || 'N/A'}\n${(diveLog.boats as any)?.name || 'N/A'}`,
          'Trabajo realizado': diveLog.work_type || 'MANTENCIÓN',
          'Supervisor de Buceo': (diveLog.profiles as any)?.username || 'N/A',
          'Buzos': diversManifest
            .filter(d => d.role !== 'BB.EE')
            .map(d => d.name)
            .join('\n'),
          'Buzo de Emergencia': diversManifest
            .filter(d => d.role === 'BB.EE')
            .map(d => d.name)
            .join('\n'),
          'Detalle trabajos realizados / Observaciones': diveLog.work_details || diveLog.observations || ''
        };
      });

      // Convert to CSV format for download
      const headers = Object.keys(excelData[0]);
      const csvContent = [
        headers.join('\t'),
        ...excelData.map(row => headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join('\t'))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const fileName = format === 'control-diario' 
        ? `control_diario_${diveLogs.length}_bitacoras.xls`
        : `detalle_boletas_${diveLogs.length}_bitacoras.xls`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportación exitosa",
        description: `Se exportaron ${diveLogs.length} bitácoras a Excel`,
      });
    } catch (error) {
      console.error('Error exporting multiple dive logs:', error);
      toast({
        title: "Error en exportación",
        description: "No se pudieron exportar las bitácoras",
        variant: "destructive",
      });
    }
  };

  return {
    exportSingleDiveLog,
    exportMultipleDiveLogs,
  };
};
