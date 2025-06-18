
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';
import { useToast } from '@/hooks/use-toast';

export const useExcelExport = () => {
  const { toast } = useToast();

  const exportSingleDiveLog = useCallback(async (diveLog: DiveLogWithFullDetails) => {
    try {
      // Formato "Control Diario de Buceo"
      const excelData = [
        ['CONTROL DIARIO DE BUCEO'],
        ['SOCIEDAD DE SERVICIOS AEROCAM SPA'],
        ['RUT: 76.355.932-4'],
        [''],
        ['INFORMACIÓN GENERAL'],
        ['Fecha', diveLog.log_date],
        ['N° Boleta', diveLog.id.slice(0, 8).toUpperCase()],
        ['Centro de Cultivo', diveLog.centers?.name || 'N/A'],
        ['Sitio de Buceo', diveLog.dive_sites?.name || 'N/A'],
        ['Embarcación', diveLog.boats?.name || 'N/A'],
        ['N° Matrícula', diveLog.boats?.registration_number || 'N/A'],
        ['Supervisor', diveLog.profiles?.username || 'N/A'],
        [''],
        ['CONDICIONES AMBIENTALES'],
        ['Temperatura del Agua (°C)', diveLog.water_temperature || 'N/A'],
        ['Visibilidad (m)', diveLog.visibility || 'N/A'],
        ['Fuerza de Corriente', diveLog.current_strength || 'N/A'],
        ['Condiciones Climáticas', diveLog.weather_conditions || 'N/A'],
        [''],
        ['HORARIOS'],
        ['Hora de Salida', diveLog.departure_time || 'N/A'],
        ['Hora de Llegada', diveLog.arrival_time || 'N/A'],
        [''],
        ['EQUIPO DE BUCEO'],
        ['N°', 'Nombre', 'N° Matrícula', 'Cargo', 'Profundidad Máx', 'Tiempo Fondo']
      ];

      // Agregar buzos del manifiesto
      if (Array.isArray(diveLog.divers_manifest)) {
        diveLog.divers_manifest.forEach((diver: any, index: number) => {
          excelData.push([
            index + 1,
            diver.name || 'N/A',
            diver.license || 'N/A',
            diver.role === 'buzo' ? 'BUZO' : 
            diver.role === 'buzo-emergencia' ? 'BUZO EMERGENCIA' : 
            diver.role === 'supervisor' ? 'SUPERVISOR' : 'BUZO',
            diver.working_depth || 'N/A',
            diver.bottom_time || 'N/A'
          ]);
        });
      }

      // Agregar observaciones
      excelData.push(['']);
      excelData.push(['DETALLE DE TRABAJO REALIZADO']);
      excelData.push([diveLog.observations || 'Trabajo realizado normal. Buceo sin novedad.']);
      
      // Agregar validación
      excelData.push(['']);
      excelData.push(['VALIDACIÓN']);
      excelData.push(['Estado', diveLog.signature_url ? 'FIRMADO DIGITALMENTE' : 'BORRADOR']);
      if (diveLog.signature_url) {
        excelData.push(['Código de Validación', `DL-${diveLog.id.slice(0, 8).toUpperCase()}`]);
      }

      // Convertir a CSV para descarga
      const csvContent = excelData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Control_Diario_Buceo_${diveLog.log_date}_${diveLog.id.slice(0, 8)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Exportación exitosa",
        description: "La bitácora se ha exportado a Excel correctamente",
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

  const exportMultipleDiveLogs = useCallback(async (format: 'control-diario' | 'detalle-boletas' = 'control-diario', dateRange?: { from?: Date; to?: Date }) => {
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

      let excelData: any[][] = [];
      let filename = '';

      if (format === 'control-diario') {
        // Formato Control Diario de Buceo
        excelData = [
          ['CONTROL DIARIO DE BUCEO - REPORTE MÚLTIPLE'],
          ['SOCIEDAD DE SERVICIOS AEROCAM SPA'],
          ['Generado el: ' + new Date().toLocaleDateString('es-ES')],
          [''],
          [
            'Fecha',
            'N° Boleta',
            'Centro de Cultivo',
            'Embarcación',
            'N° Matrícula',
            'Sitio de Buceo',
            'Supervisor',
            'Hora Salida',
            'Hora Llegada',
            'Temperatura (°C)',
            'Visibilidad (m)',
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
            log.id.slice(0, 8).toUpperCase(),
            log.centers?.name || 'N/A',
            log.boats?.name || 'N/A',
            log.boats?.registration_number || 'N/A',
            log.dive_sites?.name || 'N/A',
            log.profiles?.username || 'N/A',
            log.departure_time || 'N/A',
            log.arrival_time || 'N/A',
            log.water_temperature || 'N/A',
            log.visibility || 'N/A',
            log.current_strength || 'N/A',
            log.weather_conditions || 'N/A',
            diversCount.toString(),
            log.signature_url ? 'Firmado' : 'Borrador'
          ]);
        });

        filename = `Control_Diario_Buceo_${new Date().toISOString().split('T')[0]}.csv`;

      } else {
        // Formato Detalle de Boletas por Centro
        const centerName = diveLogs?.[0]?.centers?.name || 'Centro';
        excelData = [
          [`DETALLE DE BOLETAS - ${centerName.toUpperCase()}`],
          ['SOCIEDAD DE SERVICIOS AEROCAM SPA'],
          ['Generado el: ' + new Date().toLocaleDateString('es-ES')],
          [''],
          [
            'N° Boleta',
            'Fecha',
            'Centro',
            'Supervisor',
            'Sitio de Buceo',
            'Embarcación',
            'Total Buzos',
            'Observaciones',
            'Estado',
            'Código Validación'
          ]
        ];

        diveLogs?.forEach((log: any) => {
          const diversCount = Array.isArray(log.divers_manifest) ? log.divers_manifest.length : 0;
          excelData.push([
            log.id.slice(0, 8).toUpperCase(),
            log.log_date,
            log.centers?.name || 'N/A',
            log.profiles?.username || 'N/A',
            log.dive_sites?.name || 'N/A',
            log.boats?.name || 'N/A',
            diversCount.toString(),
            (log.observations || '').substring(0, 100) + (log.observations?.length > 100 ? '...' : ''),
            log.signature_url ? 'Firmado' : 'Borrador',
            log.signature_url ? `DL-${log.id.slice(0, 8).toUpperCase()}` : 'N/A'
          ]);
        });

        filename = `Detalle_Boletas_${centerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      }

      // Convertir a CSV
      const csvContent = excelData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Exportación exitosa",
        description: `Se han exportado ${diveLogs?.length || 0} bitácoras en formato ${format === 'control-diario' ? 'Control Diario' : 'Detalle de Boletas'}`,
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
