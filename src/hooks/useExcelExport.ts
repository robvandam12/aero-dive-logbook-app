
import { useMutation } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

interface DiveLogForExport {
  id: string;
  log_date: string;
  center_name?: string;
  work_type?: string;
  supervisor_name?: string;
  divers_manifest?: Json;
  signature_url?: string;
  status: string;
}

export const useExcelExport = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (diveLogs: DiveLogForExport[]) => {
      const excelData = diveLogs.map(log => {
        // Handle divers_manifest safely
        let diversNames = '';
        if (log.divers_manifest) {
          try {
            const manifest = Array.isArray(log.divers_manifest) 
              ? log.divers_manifest 
              : typeof log.divers_manifest === 'string' 
                ? JSON.parse(log.divers_manifest)
                : [log.divers_manifest];
            diversNames = manifest.map((diver: any) => diver.name || '').join('\n');
          } catch (error) {
            console.error('Error parsing divers manifest:', error);
            diversNames = '';
          }
        }
        
        return {
          'Fecha': log.log_date,
          'ID': log.id.slice(-6).toUpperCase(),
          'Centro': log.center_name || 'N/A',
          'Tipo de Trabajo': log.work_type || 'N/A',
          'Supervisor': log.supervisor_name || 'N/A',
          'Buzos': diversNames,
          'Estado': log.status === 'draft' ? 'Borrador' : 
                   log.status === 'completed' ? 'Completada' : 
                   log.status === 'signed' ? 'Firmada' : log.status,
          'Firmada': log.signature_url ? 'Sí' : 'No'
        };
      });

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bitácoras');

      // Set column widths
      const colWidths = [
        { wch: 12 }, // Fecha
        { wch: 8 },  // ID
        { wch: 20 }, // Centro
        { wch: 15 }, // Tipo de Trabajo
        { wch: 20 }, // Supervisor
        { wch: 30 }, // Buzos
        { wch: 12 }, // Estado
        { wch: 8 }   // Firmada
      ];
      ws['!cols'] = colWidths;

      // Generate filename with current date
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const filename = `bitacoras-${dateStr}.xlsx`;

      // Write file with UTF-8 encoding
      const buffer = XLSX.write(wb, { 
        bookType: 'xlsx', 
        type: 'array',
        cellStyles: true,
        compression: true
      });

      // Create blob with proper MIME type
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      // Download file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { filename, recordCount: diveLogs.length };
    },
    onSuccess: (result) => {
      toast({
        title: "Excel exportado",
        description: `Se ha exportado ${result.recordCount} registros a ${result.filename}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al exportar Excel",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    ...mutation,
    exportSingleDiveLog: (diveLog: DiveLogForExport) => mutation.mutate([diveLog]),
    exportMultipleDiveLogs: (diveLogs: DiveLogForExport[]) => mutation.mutate(diveLogs),
  };
};
