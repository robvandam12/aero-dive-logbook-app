
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';
import { useToast } from '@/hooks/use-toast';

// Simulamos la funcionalidad de Excel ya que no tenemos una librería instalada
// En un entorno real usaríamos xlsx o similar
export const useExcelExport = () => {
  const { toast } = useToast();

  const exportSingleDiveLog = useCallback(async (diveLog: DiveLogWithFullDetails) => {
    try {
      // Preparar datos para Excel
      const excelData = [
        ['CONTROL DIARIO DE BUCEO'],
        [''],
        ['Fecha', diveLog.log_date],
        ['Centro', diveLog.centers?.name || 'N/A'],
        ['Sitio de Buceo', diveLog.dive_sites?.name || 'N/A'],
        ['Embarcación', diveLog.boats?.name || 'N/A'],
        ['Supervisor', diveLog.profiles?.username || 'N/A'],
        [''],
        ['CONDICIONES'],
        ['Temperatura del Agua', `${diveLog.water_temperature || 'N/A'}°C`],
        ['Visibilidad', `${diveLog.visibility || 'N/A'}m`],
        ['Corriente', diveLog.current_strength || 'N/A'],
        ['Condiciones Climáticas', diveLog.weather_conditions || 'N/A'],
        [''],
        ['HORARIOS'],
        ['Hora de Salida', diveLog.departure_time || 'N/A'],
        ['Hora de Llegada', diveLog.arrival_time || 'N/A'],
        [''],
        ['EQUIPO DE BUCEO'],
      ];

      // Agregar buzos del manifiesto
      if (Array.isArray(diveLog.divers_manifest)) {
        diveLog.divers_manifest.forEach((diver: any, index: number) => {
          excelData.push([
            `Buzo ${index + 1}`,
            diver.name || 'N/A',
            diver.role || 'buzo',
            diver.certification || 'N/A'
          ]);
        });
      }

      // Agregar observaciones
      excelData.push(['']);
      excelData.push(['OBSERVACIONES']);
      excelData.push([diveLog.observations || 'Sin observaciones']);

      // Convertir a CSV para descarga (simulando Excel)
      const csvContent = excelData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bitacora_${diveLog.log_date}_${diveLog.id.slice(0, 8)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportación exitosa",
        description: "La bitácora se ha exportado correctamente",
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Error",
        description: "No se pudo exportar la bitácora",
        variant: "destructive",
      });
    }
  }, [toast]);

  const exportMultipleDiveLogs = useCallback(async (dateRange?: { from?: Date; to?: Date }) => {
    try {
      let query = supabase
        .from('dive_logs')
        .select(`
          *,
          centers (name),
          dive_sites (name, location),
          boats (name, registration_number),
          profiles (username)
        `)
        .order('log_date', { ascending: false })
        .limit(30);

      // Aplicar filtros de fecha si se proporcionan
      if (dateRange?.from) {
        query = query.gte('log_date', dateRange.from.toISOString().split('T')[0]);
      }
      if (dateRange?.to) {
        query = query.lte('log_date', dateRange.to.toISOString().split('T')[0]);
      }

      const { data: diveLogs, error } = await query;

      if (error) throw error;

      // Preparar datos para Excel con formato específico
      const excelData = [
        ['CONTROL DIARIO DE BUCEO - REPORTE MÚLTIPLE'],
        [''],
        [
          'Fecha',
          'N° Boleta',
          'Centro',
          'Embarcación',
          'Sitio de Buceo',
          'Supervisor',
          'Hora Salida',
          'Hora Llegada',
          'Temperatura',
          'Visibilidad',
          'Corriente',
          'Clima',
          'Total Buzos',
          'Estado'
        ]
      ];

      diveLogs?.forEach((log: any) => {
        const diversCount = Array.isArray(log.divers_manifest) ? log.divers_manifest.length : 0;
        excelData.push([
          log.log_date,
          log.id.slice(0, 8),
          log.centers?.name || 'N/A',
          log.boats?.name || 'N/A',
          log.dive_sites?.name || 'N/A',
          log.profiles?.username || 'N/A',
          log.departure_time || 'N/A',
          log.arrival_time || 'N/A',
          `${log.water_temperature || 'N/A'}°C`,
          `${log.visibility || 'N/A'}m`,
          log.current_strength || 'N/A',
          log.weather_conditions || 'N/A',
          diversCount.toString(),
          log.status === 'signed' ? 'Firmado' : log.status === 'draft' ? 'Borrador' : 'Invalidado'
        ]);
      });

      // Convertir a CSV
      const csvContent = excelData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reporte_bitacoras_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportación exitosa",
        description: `Se han exportado ${diveLogs?.length || 0} bitácoras`,
      });
    } catch (error) {
      console.error('Error exporting multiple dive logs:', error);
      toast({
        title: "Error",
        description: "No se pudo exportar el reporte",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    exportSingleDiveLog,
    exportMultipleDiveLogs,
  };
};
