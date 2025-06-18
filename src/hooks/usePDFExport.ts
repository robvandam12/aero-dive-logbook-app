
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

      // Crear PDF real usando jsPDF con los datos estructurados
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Configurar fuentes y colores
      doc.setFont('helvetica');
      
      // Header con logo (simulado)
      doc.setFontSize(20);
      doc.setTextColor(101, 85, 255); // Color #6555FF
      doc.text('🚁 AEROCAM APP', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Sistema de Bitácoras de Buceo', pageWidth / 2, 30, { align: 'center' });
      
      // Título
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('BITÁCORA DE BUCEO', pageWidth / 2, 45, { align: 'center' });
      
      // Información de la bitácora
      if (data.diveLog) {
        const diveLog = data.diveLog;
        let yPosition = 60;
        
        // Información general
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMACIÓN GENERAL', 20, yPosition);
        yPosition += 10;
        
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha: ${diveLog.log_date}`, 20, yPosition);
        doc.text(`Centro: ${diveLog.centers?.name || 'N/A'}`, 120, yPosition);
        yPosition += 8;
        
        doc.text(`Sitio: ${diveLog.dive_sites?.name || 'N/A'}`, 20, yPosition);
        doc.text(`Embarcación: ${diveLog.boats?.name || 'N/A'}`, 120, yPosition);
        yPosition += 8;
        
        doc.text(`Supervisor: ${diveLog.profiles?.username || 'N/A'}`, 20, yPosition);
        yPosition += 15;
        
        // Condiciones
        doc.setFont('helvetica', 'bold');
        doc.text('CONDICIONES', 20, yPosition);
        yPosition += 10;
        
        doc.setFont('helvetica', 'normal');
        doc.text(`Temperatura: ${diveLog.water_temperature ? diveLog.water_temperature + '°C' : 'N/A'}`, 20, yPosition);
        doc.text(`Visibilidad: ${diveLog.visibility ? diveLog.visibility + 'm' : 'N/A'}`, 120, yPosition);
        yPosition += 8;
        
        doc.text(`Corriente: ${diveLog.current_strength || 'N/A'}`, 20, yPosition);
        yPosition += 15;
        
        // Equipo de buceo
        doc.setFont('helvetica', 'bold');
        doc.text('EQUIPO DE BUCEO', 20, yPosition);
        yPosition += 10;
        
        if (Array.isArray(diveLog.divers_manifest) && diveLog.divers_manifest.length > 0) {
          diveLog.divers_manifest.forEach((diver: any, index: number) => {
            doc.setFont('helvetica', 'normal');
            doc.text(`${index + 1}. ${diver.name || 'N/A'} - ${diver.role || 'Buzo'}`, 20, yPosition);
            yPosition += 6;
          });
        } else {
          doc.setFont('helvetica', 'normal');
          doc.text('No hay buzos registrados', 20, yPosition);
          yPosition += 6;
        }
        
        yPosition += 10;
        
        // Observaciones
        if (diveLog.observations) {
          doc.setFont('helvetica', 'bold');
          doc.text('OBSERVACIONES', 20, yPosition);
          yPosition += 8;
          
          doc.setFont('helvetica', 'normal');
          const splitObservations = doc.splitTextToSize(diveLog.observations, pageWidth - 40);
          doc.text(splitObservations, 20, yPosition);
          yPosition += splitObservations.length * 6 + 10;
        }
        
        // Firma (si existe)
        if (diveLog.signature_url && includeSignature) {
          doc.setFont('helvetica', 'bold');
          doc.text('VALIDACIÓN DIGITAL', 20, yPosition);
          yPosition += 8;
          
          doc.setFont('helvetica', 'normal');
          doc.text('Estado: FIRMADO DIGITALMENTE', 20, yPosition);
          yPosition += 6;
          doc.text(`Código: DL-${diveLog.id.slice(0, 8).toUpperCase()}`, 20, yPosition);
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
