
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
      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: {
          diveLogId,
          includeSignature,
          generatePDF: true,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al generar el PDF');
      }

      // Crear PDF usando jsPDF con el mismo formato que el preview
      const doc = new jsPDF('p', 'pt', 'letter'); // Tamaño carta
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Configurar fuentes y márgenes
      const margin = 40;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;
      
      doc.setFont('helvetica');
      
      // Header con logo
      yPosition += 20;
      doc.setFontSize(24);
      doc.setTextColor(101, 85, 255);
      doc.text('aerocam', margin, yPosition);
      
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      yPosition += 15;
      doc.text('SOCIEDAD DE SERVICIOS AEROCAM SPA', margin, yPosition);
      yPosition += 10;
      doc.text('Ignacio Carrera Pinto Nº 200, Quellón – Chiloé', margin, yPosition);
      yPosition += 10;
      doc.text('(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl', margin, yPosition);
      
      // Fecha y número en la esquina derecha
      doc.setFontSize(10);
      const dateText = `Fecha: ${data.diveLog?.log_date || ''}`;
      const numberText = `Nº: ${data.diveLog?.id?.slice(-6) || ''}`;
      doc.text(dateText, pageWidth - margin - 120, margin + 30);
      doc.text(numberText, pageWidth - margin - 120, margin + 45);
      
      yPosition += 30;
      
      // Título principal
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 25;
      
      // Centro de cultivo
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('CENTRO DE CULTIVO:', margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(data.diveLog?.centers?.name || 'N/A', margin + 120, yPosition);
      yPosition += 30;

      if (data.diveLog) {
        const diveLog = data.diveLog;
        
        // Datos Generales
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('DATOS GENERALES', margin, yPosition);
        yPosition += 20;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        // Información básica en dos columnas
        const leftColumn = margin;
        const rightColumn = pageWidth / 2 + 20;
        
        doc.text(`SUPERVISOR: ${diveLog.profiles?.username || 'N/A'}`, leftColumn, yPosition);
        doc.text(`JEFE DE CENTRO: ${diveLog.center_manager || 'N/A'}`, rightColumn, yPosition);
        yPosition += 15;
        
        doc.text(`N° MATRICULA: ${diveLog.supervisor_license || 'N/A'}`, leftColumn, yPosition);
        doc.text(`ASISTENTE DE CENTRO: ${diveLog.center_assistant || 'N/A'}`, rightColumn, yPosition);
        yPosition += 25;
        
        // Condiciones del tiempo
        doc.setFont('helvetica', 'bold');
        doc.text('CONDICIÓN TIEMPO VARIABLES', margin, yPosition);
        yPosition += 15;
        
        doc.setFont('helvetica', 'normal');
        const weatherGood = diveLog.weather_good === true ? 'SÍ' : diveLog.weather_good === false ? 'NO' : 'N/A';
        doc.text(`Tiempo: ${weatherGood}`, margin, yPosition);
        doc.text(`Observaciones: ${diveLog.weather_conditions || 'Buen tiempo'}`, margin + 100, yPosition);
        yPosition += 25;
        
        // Registro de compresores
        doc.setFont('helvetica', 'bold');
        doc.text('REGISTRO DE COMPRESORES', margin, yPosition);
        yPosition += 15;
        
        doc.setFont('helvetica', 'normal');
        doc.text(`COMPRESOR 1: ${diveLog.compressor_1 || ''}`, margin, yPosition);
        doc.text(`COMPRESOR 2: ${diveLog.compressor_2 || ''}`, margin + 150, yPosition);
        yPosition += 15;
        
        doc.text(`Nº SOLICITUD DE FAENA: ${diveLog.work_order_number || 'N/A'}`, margin, yPosition);
        yPosition += 15;
        doc.text(`FECHA Y HORA DE INICIO: ${diveLog.start_time || diveLog.departure_time || 'N/A'}`, margin, yPosition);
        yPosition += 15;
        doc.text(`FECHA Y HORA DE TÉRMINO: ${diveLog.end_time || diveLog.arrival_time || 'N/A'}`, margin, yPosition);
        yPosition += 30;
        
        // Team de buceo
        doc.setFont('helvetica', 'bold');
        doc.text('TEAM DE BUCEO', margin, yPosition);
        yPosition += 15;
        doc.setFont('helvetica', 'normal');
        doc.text('COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES', margin, yPosition);
        yPosition += 20;
        
        // Tabla de buzos simplificada
        if (Array.isArray(diveLog.divers_manifest) && diveLog.divers_manifest.length > 0) {
          diveLog.divers_manifest.forEach((diver: any, index: number) => {
            if (index < 4) { // Máximo 4 buzos
              doc.text(`${index + 1}. ${diver.name || 'N/A'} - ${diver.role || 'Buzo'}`, margin, yPosition);
              doc.text(`Matrícula: ${diver.license || 'N/A'}`, margin + 200, yPosition);
              doc.text(`Prof: ${diver.working_depth || ''} m`, margin + 350, yPosition);
              yPosition += 15;
            }
          });
        } else {
          doc.text('No hay buzos registrados', margin, yPosition);
          yPosition += 15;
        }
        
        yPosition += 20;
        
        // Detalle de trabajo
        doc.setFont('helvetica', 'bold');
        doc.text('DETALLE DE TRABAJO REALIZADO POR BUZO', margin, yPosition);
        yPosition += 20;
        
        if (Array.isArray(diveLog.divers_manifest) && diveLog.divers_manifest.length > 0) {
          diveLog.divers_manifest.forEach((diver: any, index: number) => {
            if (index < 4 && diver.work_description) {
              doc.setFont('helvetica', 'bold');
              doc.text(`BUZO ${index + 1}:`, margin, yPosition);
              yPosition += 12;
              doc.setFont('helvetica', 'normal');
              const workText = doc.splitTextToSize(diver.work_description, contentWidth - 100);
              doc.text(workText, margin + 20, yPosition);
              yPosition += workText.length * 12 + 10;
            }
          });
        }
        
        yPosition += 20;
        
        // Observaciones
        if (diveLog.observations) {
          doc.setFont('helvetica', 'bold');
          doc.text('OBSERVACIONES:', margin, yPosition);
          yPosition += 15;
          
          doc.setFont('helvetica', 'normal');
          const obsText = doc.splitTextToSize(diveLog.observations, contentWidth);
          doc.text(obsText, margin, yPosition);
          yPosition += obsText.length * 12 + 30;
        }
        
        // Firmas
        const signatureY = Math.max(yPosition, pageHeight - 150);
        
        doc.setFont('helvetica', 'bold');
        doc.text('FIRMA ENCARGADO DE CENTRO', margin + 50, signatureY, { align: 'center' });
        doc.text('FIRMA Y TIMBRE SUPERVISOR DE BUCEO', pageWidth - margin - 150, signatureY, { align: 'center' });
        
        if (includeSignature && diveLog.signature_url) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(0, 128, 0);
          doc.text(`FIRMADO DIGITALMENTE - Código: DL-${diveLog.id?.slice(0, 8).toUpperCase()}`, 
                  pageWidth - margin - 150, signatureY + 30, { align: 'center' });
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

      return data;
    },
    onSuccess: () => {
      toast({
        title: "PDF generado",
        description: "La bitácora ha sido exportada exitosamente.",
      });
    },
    onError: (error: any) => {
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
