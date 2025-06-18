
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface ExportToPDFRequest {
  diveLogId: string;
  includeSignature?: boolean;
}

export const usePDFExport = () => {
  const { toast } = useToast();

  const exportToPDF = useMutation({
    mutationFn: async ({ diveLogId, includeSignature = true }: ExportToPDFRequest) => {
      console.log('Exporting PDF for dive log:', diveLogId);

      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: {
          diveLogId,
          includeSignature,
          generatePDF: true,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      if (!data.success) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error || 'Error al generar el PDF');
      }

      console.log('PDF data received:', data);

      // Usar jsPDF para generar PDF desde el HTML recibido
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Configurar página
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      // Configurar fuentes
      doc.setFont('helvetica');
      
      // Header con logo y empresa
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(101, 85, 255);
      doc.text('aerocam', margin, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('SOCIEDAD DE SERVICIOS AEROCAM SPA', margin, 32);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Ignacio Carrera Pinto Nº 200, Quellón – Chiloé', margin, 38);
      doc.text('(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl', margin, 42);

      // Información de fecha y número en la derecha
      if (data.diveLog) {
        const diveLog = data.diveLog;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha: ${String(diveLog.log_date || '')}`, pageWidth - 50, 25);
        
        doc.setTextColor(0, 128, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`Nº: ${String(diveLog.id?.slice(-6) || '')}`, pageWidth - 50, 32);
        doc.setTextColor(0, 0, 0);

        // Título principal
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO', pageWidth / 2, 55, { align: 'center' });

        let yPos = 70;

        // Centro de cultivo
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('CENTRO DE CULTIVO:', margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(diveLog.centers?.name || 'N/A'), margin + 45, yPos);
        yPos += 15;

        // Sección Datos Generales
        doc.rect(margin, yPos, contentWidth, 35);
        doc.setFillColor(221, 221, 221);
        doc.rect(margin, yPos, contentWidth, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('DATOS GENERALES', pageWidth / 2, yPos + 4, { align: 'center' });

        yPos += 10;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('SUPERVISOR:', margin + 2, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(diveLog.profiles?.username || 'N/A'), margin + 25, yPos);

        doc.setFont('helvetica', 'bold');
        doc.text('JEFE DE CENTRO:', pageWidth / 2 + 5, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(diveLog.center_manager || 'N/A'), pageWidth / 2 + 35, yPos);

        yPos += 8;
        doc.setFont('helvetica', 'bold');
        doc.text('N° MATRICULA:', margin + 2, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(diveLog.supervisor_license || 'N/A'), margin + 25, yPos);

        doc.setFont('helvetica', 'bold');
        doc.text('ASISTENTE DE CENTRO:', pageWidth / 2 + 5, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(diveLog.center_assistant || 'N/A'), pageWidth / 2 + 35, yPos);

        yPos += 15;

        // Condiciones tiempo
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('CONDICIÓN TIEMPO VARIABLES', margin + 2, yPos);
        yPos += 6;
        
        doc.setFontSize(9);
        const weatherGood = diveLog.weather_good;
        doc.text('☐ SÍ    ☐ NO', margin + 2, yPos);
        if (weatherGood === true) {
          doc.text('☑', margin + 2, yPos);
        } else if (weatherGood === false) {
          doc.text('☑', margin + 15, yPos);
        }

        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES:', margin + 40, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(diveLog.weather_conditions || 'Buen tiempo'), margin + 65, yPos);

        yPos += 40;

        // Team de Buceo (tabla)
        doc.rect(margin, yPos, contentWidth, 50);
        doc.setFillColor(221, 221, 221);
        doc.rect(margin, yPos, contentWidth, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('TEAM DE BUCEO', pageWidth / 2, yPos + 4, { align: 'center' });

        yPos += 10;
        doc.setFontSize(8);
        doc.text('COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES', pageWidth / 2, yPos, { align: 'center' });

        // Headers de tabla
        yPos += 8;
        const colWidths = [15, 35, 25, 20, 35, 25, 20, 20, 20];
        let xPos = margin + 2;
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        const headers = ['BUZO', 'IDENTIFICACIÓN', 'Nº MATRICULA', 'CARGO', 'BUCEO ESTANDAR', 'PROF. TRABAJO', 'INICIO', 'TÉRMINO', 'TIEMPO'];
        headers.forEach((header, i) => {
          doc.text(header, xPos, yPos, { maxWidth: colWidths[i] - 2 });
          xPos += colWidths[i];
        });

        // Filas de buzos
        const diversManifest = Array.isArray(diveLog.divers_manifest) ? diveLog.divers_manifest : [];
        for (let i = 0; i < 4; i++) {
          yPos += 6;
          xPos = margin + 2;
          const diver = diversManifest[i];
          
          doc.setFont('helvetica', 'normal');
          doc.text(String(i + 1), xPos, yPos);
          xPos += colWidths[0];
          
          doc.text(String(diver?.name || ''), xPos, yPos);
          xPos += colWidths[1];
          
          doc.text(String(diver?.license || ''), xPos, yPos);
          xPos += colWidths[2];
          
          doc.text(String(diver?.role || ''), xPos, yPos);
          xPos += colWidths[3];
          
          const standardDepth = diver?.standard_depth === true ? '☑ SÍ ☐ NO' : 
                                diver?.standard_depth === false ? '☐ SÍ ☑ NO' : '☐ SÍ ☐ NO';
          doc.text(standardDepth, xPos, yPos);
          xPos += colWidths[4];
          
          doc.text(String(diver?.working_depth || ''), xPos, yPos);
          xPos += colWidths[5];
          
          doc.text(String(diver?.start_time || ''), xPos, yPos);
          xPos += colWidths[6];
          
          doc.text(String(diver?.end_time || ''), xPos, yPos);
          xPos += colWidths[7];
          
          doc.text(String(diver?.dive_time || ''), xPos, yPos);
        }

        yPos += 20;

        // Observaciones
        if (diveLog.observations) {
          doc.rect(margin, yPos, contentWidth, 25);
          doc.setFillColor(221, 221, 221);
          doc.rect(margin, yPos, contentWidth, 6, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text('OBSERVACIONES', pageWidth / 2, yPos + 4, { align: 'center' });

          yPos += 10;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          const splitObservations = doc.splitTextToSize(String(diveLog.observations), contentWidth - 4);
          doc.text(splitObservations, margin + 2, yPos);
          yPos += 25;
        }

        // Firmas
        if (pageHeight - yPos > 40) {
          yPos += 10;
          
          // Firma Encargado Centro
          doc.rect(margin, yPos, contentWidth / 2 - 5, 30);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text('FIRMA ENCARGADO DE CENTRO', margin + (contentWidth / 4 - 5), yPos + 25, { align: 'center' });

          // Firma Supervisor
          doc.rect(pageWidth / 2 + 5, yPos, contentWidth / 2 - 5, 30);
          doc.text('FIRMA Y TIMBRE SUPERVISOR DE BUCEO', pageWidth / 2 + 5 + (contentWidth / 4 - 5), yPos + 25, { align: 'center' });
          
          if (diveLog.signature_url && includeSignature) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(0, 128, 0);
            doc.text('FIRMADO DIGITALMENTE', pageWidth / 2 + 5 + (contentWidth / 4 - 5), yPos + 28, { align: 'center' });
            doc.text(`Código: DL-${String(diveLog.id?.slice(0, 8).toUpperCase())}`, pageWidth / 2 + 5 + (contentWidth / 4 - 5), yPos + 31, { align: 'center' });
            doc.setTextColor(0, 0, 0);
          }
        }
      }

      // Generar y descargar PDF
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename || `bitacora-${diveLogId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { ...data, pdfBlob };
    },
    onSuccess: () => {
      toast({
        title: "PDF generado",
        description: "La bitácora ha sido exportada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('PDF export error:', error);
      toast({
        title: "Error al exportar PDF",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    exportToPDF,
  };
};
