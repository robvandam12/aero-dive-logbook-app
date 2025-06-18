
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';
import { useToast } from '@/hooks/use-toast';

export const useExcelExport = () => {
  const { toast } = useToast();

  const exportSingleDiveLog = useCallback(async (diveLog: DiveLogWithFullDetails) => {
    try {
      // Crear contenido XML para Excel
      const xmlContent = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
<Worksheet ss:Name="Control Diario Buceo">
<Table>
  <Row><Cell><Data ss:Type="String">CONTROL DIARIO DE BUCEO</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">SOCIEDAD DE SERVICIOS AEROCAM SPA</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">RUT: 76.355.932-4</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">INFORMACIÓN GENERAL</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Fecha</Data></Cell><Cell><Data ss:Type="String">${diveLog.log_date}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">N° Boleta</Data></Cell><Cell><Data ss:Type="String">${diveLog.id.slice(0, 8).toUpperCase()}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Centro de Cultivo</Data></Cell><Cell><Data ss:Type="String">${diveLog.centers?.name || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Sitio de Buceo</Data></Cell><Cell><Data ss:Type="String">${diveLog.dive_sites?.name || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Embarcación</Data></Cell><Cell><Data ss:Type="String">${diveLog.boats?.name || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">N° Matrícula</Data></Cell><Cell><Data ss:Type="String">${diveLog.boats?.registration_number || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Supervisor</Data></Cell><Cell><Data ss:Type="String">${diveLog.profiles?.username || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">CONDICIONES AMBIENTALES</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Temperatura del Agua (°C)</Data></Cell><Cell><Data ss:Type="String">${diveLog.water_temperature || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Visibilidad (m)</Data></Cell><Cell><Data ss:Type="String">${diveLog.visibility || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Fuerza de Corriente</Data></Cell><Cell><Data ss:Type="String">${diveLog.current_strength || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Condiciones Climáticas</Data></Cell><Cell><Data ss:Type="String">${diveLog.weather_conditions || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">HORARIOS</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Hora de Salida</Data></Cell><Cell><Data ss:Type="String">${diveLog.departure_time || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Hora de Llegada</Data></Cell><Cell><Data ss:Type="String">${diveLog.arrival_time || 'N/A'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">EQUIPO DE BUCEO</Data></Cell></Row>
  <Row>
    <Cell><Data ss:Type="String">N°</Data></Cell>
    <Cell><Data ss:Type="String">Nombre</Data></Cell>
    <Cell><Data ss:Type="String">N° Matrícula</Data></Cell>
    <Cell><Data ss:Type="String">Cargo</Data></Cell>
    <Cell><Data ss:Type="String">Profundidad Máx</Data></Cell>
    <Cell><Data ss:Type="String">Tiempo Fondo</Data></Cell>
  </Row>`;

      let diversRows = '';
      if (Array.isArray(diveLog.divers_manifest)) {
        diveLog.divers_manifest.forEach((diver: any, index: number) => {
          diversRows += `
  <Row>
    <Cell><Data ss:Type="Number">${index + 1}</Data></Cell>
    <Cell><Data ss:Type="String">${diver.name || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${diver.license || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${diver.role === 'buzo' ? 'BUZO' : 
            diver.role === 'buzo-emergencia' ? 'BUZO EMERGENCIA' : 
            diver.role === 'supervisor' ? 'SUPERVISOR' : 'BUZO'}</Data></Cell>
    <Cell><Data ss:Type="String">${diver.working_depth || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${diver.bottom_time || 'N/A'}</Data></Cell>
  </Row>`;
        });
      }

      const finalXmlContent = xmlContent + diversRows + `
  <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">DETALLE DE TRABAJO REALIZADO</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">${diveLog.observations || 'Trabajo realizado normal. Buceo sin novedad.'}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">VALIDACIÓN</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Estado</Data></Cell><Cell><Data ss:Type="String">${diveLog.signature_url ? 'FIRMADO DIGITALMENTE' : 'BORRADOR'}</Data></Cell></Row>
  ${diveLog.signature_url ? `<Row><Cell><Data ss:Type="String">Código de Validación</Data></Cell><Cell><Data ss:Type="String">DL-${diveLog.id.slice(0, 8).toUpperCase()}</Data></Cell></Row>` : ''}
</Table>
</Worksheet>
</Workbook>`;

      const blob = new Blob([finalXmlContent], { 
        type: 'application/vnd.ms-excel' 
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Control_Diario_Buceo_${diveLog.log_date}_${diveLog.id.slice(0, 8)}.xls`);
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

      let xmlContent = '';
      let filename = '';

      if (format === 'control-diario') {
        xmlContent = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
<Worksheet ss:Name="Control Diario">
<Table>
  <Row><Cell><Data ss:Type="String">CONTROL DIARIO DE BUCEO - REPORTE MÚLTIPLE</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">SOCIEDAD DE SERVICIOS AEROCAM SPA</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Generado el: ${new Date().toLocaleDateString('es-ES')}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
  <Row>
    <Cell><Data ss:Type="String">Fecha</Data></Cell>
    <Cell><Data ss:Type="String">N° Boleta</Data></Cell>
    <Cell><Data ss:Type="String">Centro de Cultivo</Data></Cell>
    <Cell><Data ss:Type="String">Embarcación</Data></Cell>
    <Cell><Data ss:Type="String">N° Matrícula</Data></Cell>
    <Cell><Data ss:Type="String">Sitio de Buceo</Data></Cell>
    <Cell><Data ss:Type="String">Supervisor</Data></Cell>
    <Cell><Data ss:Type="String">Hora Salida</Data></Cell>
    <Cell><Data ss:Type="String">Hora Llegada</Data></Cell>
    <Cell><Data ss:Type="String">Temperatura (°C)</Data></Cell>
    <Cell><Data ss:Type="String">Visibilidad (m)</Data></Cell>
    <Cell><Data ss:Type="String">Corriente</Data></Cell>
    <Cell><Data ss:Type="String">Clima</Data></Cell>
    <Cell><Data ss:Type="String">Total Buzos</Data></Cell>
    <Cell><Data ss:Type="String">Estado</Data></Cell>
  </Row>`;

        diveLogs?.forEach((log: any) => {
          const diversCount = Array.isArray(log.divers_manifest) ? log.divers_manifest.length : 0;
          xmlContent += `
  <Row>
    <Cell><Data ss:Type="String">${log.log_date}</Data></Cell>
    <Cell><Data ss:Type="String">${log.id.slice(0, 8).toUpperCase()}</Data></Cell>
    <Cell><Data ss:Type="String">${log.centers?.name || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.boats?.name || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.boats?.registration_number || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.dive_sites?.name || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.profiles?.username || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.departure_time || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.arrival_time || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.water_temperature || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.visibility || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.current_strength || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.weather_conditions || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="Number">${diversCount}</Data></Cell>
    <Cell><Data ss:Type="String">${log.signature_url ? 'Firmado' : 'Borrador'}</Data></Cell>
  </Row>`;
        });

        filename = `Control_Diario_Buceo_${new Date().toISOString().split('T')[0]}.xls`;
      } else {
        // Formato Detalle de Boletas
        const centerName = diveLogs?.[0]?.centers?.name || 'Centro';
        xmlContent = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
<Worksheet ss:Name="Detalle de Boletas">
<Table>
  <Row><Cell><Data ss:Type="String">DETALLE DE BOLETAS - ${centerName.toUpperCase()}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">SOCIEDAD DE SERVICIOS AEROCAM SPA</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Generado el: ${new Date().toLocaleDateString('es-ES')}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
  <Row>
    <Cell><Data ss:Type="String">N° Boleta</Data></Cell>
    <Cell><Data ss:Type="String">Fecha</Data></Cell>
    <Cell><Data ss:Type="String">Centro</Data></Cell>
    <Cell><Data ss:Type="String">Supervisor</Data></Cell>
    <Cell><Data ss:Type="String">Sitio de Buceo</Data></Cell>
    <Cell><Data ss:Type="String">Embarcación</Data></Cell>
    <Cell><Data ss:Type="String">Total Buzos</Data></Cell>
    <Cell><Data ss:Type="String">Observaciones</Data></Cell>
    <Cell><Data ss:Type="String">Estado</Data></Cell>
    <Cell><Data ss:Type="String">Código Validación</Data></Cell>
  </Row>`;

        diveLogs?.forEach((log: any) => {
          const diversCount = Array.isArray(log.divers_manifest) ? log.divers_manifest.length : 0;
          xmlContent += `
  <Row>
    <Cell><Data ss:Type="String">${log.id.slice(0, 8).toUpperCase()}</Data></Cell>
    <Cell><Data ss:Type="String">${log.log_date}</Data></Cell>
    <Cell><Data ss:Type="String">${log.centers?.name || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.profiles?.username || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.dive_sites?.name || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.boats?.name || 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="Number">${diversCount}</Data></Cell>
    <Cell><Data ss:Type="String">${(log.observations || '').substring(0, 100)}${log.observations?.length > 100 ? '...' : ''}</Data></Cell>
    <Cell><Data ss:Type="String">${log.signature_url ? 'Firmado' : 'Borrador'}</Data></Cell>
    <Cell><Data ss:Type="String">${log.signature_url ? `DL-${log.id.slice(0, 8).toUpperCase()}` : 'N/A'}</Data></Cell>
  </Row>`;
        });

        filename = `Detalle_Boletas_${centerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xls`;
      }

      xmlContent += `
</Table>
</Worksheet>
</Workbook>`;

      const blob = new Blob([xmlContent], { 
        type: 'application/vnd.ms-excel' 
      });
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
