
import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { DiveLogWithFullDetails } from './useDiveLog';

export const usePDFGenerator = () => {
  const generatePDF = useCallback((diveLog: DiveLogWithFullDetails, hasSignature: boolean = true) => {
    const doc = new jsPDF('portrait', 'mm', 'letter');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Set default font
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    let yPosition = margin;
    
    // Header Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SOCIEDAD DE SERVICIOS AEROCAM SPA', margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Ignacio Carrera Pinto Nº 200, Quellón – Chiloé', margin, yPosition);
    yPosition += 4;
    doc.text('(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl', margin, yPosition);
    yPosition += 8;
    
    // Date and ID boxes on the right
    const boxWidth = 35;
    const boxHeight = 6;
    const rightX = pageWidth - margin - boxWidth;
    
    // Date box
    doc.rect(rightX, yPosition - 15, boxWidth, boxHeight);
    doc.setFontSize(8);
    doc.text('Fecha:', rightX - 15, yPosition - 11);
    doc.text(diveLog.log_date || '', rightX + 2, yPosition - 11);
    
    // ID box
    doc.rect(rightX, yPosition - 8, boxWidth, boxHeight);
    doc.text('Nº:', rightX - 8, yPosition - 4);
    doc.setFont('helvetica', 'bold');
    doc.text(diveLog.id?.slice(-6) || '', rightX + 2, yPosition - 4);
    doc.setFont('helvetica', 'normal');
    
    // Title
    yPosition += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const title = 'BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
    yPosition += 10;
    
    // Center box
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CENTRO DE CULTIVO:', margin, yPosition);
    doc.rect(margin + 35, yPosition - 4, contentWidth - 35, 6);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.centers?.name || 'N/A', margin + 37, yPosition);
    yPosition += 15;
    
    // General Data Section
    doc.rect(margin, yPosition, contentWidth, 45);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, contentWidth, 6, 'F');
    doc.text('DATOS GENERALES', pageWidth / 2 - 20, yPosition + 4);
    yPosition += 10;
    
    // Supervisor data
    doc.setFont('helvetica', 'bold');
    doc.text('SUPERVISOR:', margin + 2, yPosition);
    doc.rect(margin + 25, yPosition - 3, 60, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.profiles?.username || 'N/A', margin + 27, yPosition);
    
    doc.setFont('helvetica', 'bold');
    doc.text('JEFE DE CENTRO:', margin + 90, yPosition);
    doc.rect(margin + 120, yPosition - 3, 60, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.center_manager || 'N/A', margin + 122, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text('N° MATRICULA:', margin + 2, yPosition);
    doc.rect(margin + 25, yPosition - 3, 60, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.supervisor_license || 'N/A', margin + 27, yPosition);
    
    doc.setFont('helvetica', 'bold');
    doc.text('ASISTENTE DE CENTRO:', margin + 90, yPosition);
    doc.rect(margin + 120, yPosition - 3, 60, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.center_assistant || 'N/A', margin + 122, yPosition);
    yPosition += 12;
    
    // Weather conditions
    doc.setFont('helvetica', 'bold');
    doc.text('CONDICIÓN TIEMPO VARIABLES', pageWidth / 2 - 25, yPosition);
    yPosition += 6;
    
    // Weather checkboxes
    doc.rect(margin + 2, yPosition - 3, 3, 3);
    if (diveLog.weather_good === true) {
      doc.text('X', margin + 3, yPosition - 1);
    }
    doc.text('SÍ', margin + 8, yPosition);
    
    doc.rect(margin + 20, yPosition - 3, 3, 3);
    if (diveLog.weather_good === false) {
      doc.text('X', margin + 21, yPosition - 1);
    }
    doc.text('NO', margin + 26, yPosition);
    
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVACIONES:', margin + 40, yPosition);
    doc.rect(margin + 70, yPosition - 3, 110, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.weather_conditions || 'Buen tiempo', margin + 72, yPosition);
    yPosition += 10;
    
    // Compressor section
    doc.setFont('helvetica', 'bold');
    doc.text('REGISTRO DE COMPRESORES', pageWidth / 2 - 25, yPosition);
    yPosition += 6;
    
    doc.text('COMPRESOR 1:', margin + 2, yPosition);
    doc.rect(margin + 25, yPosition - 3, 20, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.compressor_1 || '', margin + 27, yPosition);
    
    doc.setFont('helvetica', 'bold');
    doc.text('COMPRESOR 2:', margin + 60, yPosition);
    doc.rect(margin + 83, yPosition - 3, 20, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.compressor_2 || '', margin + 85, yPosition);
    yPosition += 8;
    
    // Work order
    doc.setFont('helvetica', 'bold');
    doc.text('Nº SOLICITUD DE FAENA:', margin + 2, yPosition);
    doc.rect(margin + 40, yPosition - 3, 140, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.work_order_number || 'N/A', margin + 42, yPosition);
    yPosition += 8;
    
    // Start time
    doc.setFont('helvetica', 'bold');
    doc.text('FECHA Y HORA DE INICIO:', margin + 2, yPosition);
    doc.rect(margin + 45, yPosition - 3, 135, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.start_time || diveLog.departure_time || 'N/A', margin + 47, yPosition);
    yPosition += 8;
    
    // End time
    doc.setFont('helvetica', 'bold');
    doc.text('FECHA Y HORA DE TÉRMINO:', margin + 2, yPosition);
    doc.rect(margin + 45, yPosition - 3, 135, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(diveLog.end_time || diveLog.arrival_time || 'N/A', margin + 47, yPosition);
    yPosition += 15;
    
    // Team Section
    doc.rect(margin, yPosition, contentWidth, 50);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('TEAM DE BUCEO', pageWidth / 2 - 15, yPosition + 4);
    yPosition += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES', pageWidth / 2 - 40, yPosition);
    yPosition += 8;
    
    // Table headers
    const colWidths = [15, 40, 25, 20, 30, 25, 20, 20, 15];
    const headers = ['BUZO', 'IDENTIFICACIÓN', 'N° MATRICULA', 'CARGO', 'BUCEO ESTANDAR\nPROFUNDIDAD\n20 MTS MAXIMO\n(SÍ / NO)', 'PROFUNDIDAD\nDE TRABAJO\nREALIZADO\n(Metros)', 'INICIO DE\nBUCEO', 'TÉRMINO\nDE BUCEO', 'TIEMPO\nDE BUCEO\n(min)'];
    
    let xPos = margin;
    doc.setFontSize(8);
    doc.setFillColor(240, 240, 240);
    for (let i = 0; i < headers.length; i++) {
      doc.rect(xPos, yPosition, colWidths[i], 15, 'F');
      doc.rect(xPos, yPosition, colWidths[i], 15);
      const lines = headers[i].split('\n');
      for (let j = 0; j < lines.length; j++) {
        doc.text(lines[j], xPos + 1, yPosition + 3 + (j * 3));
      }
      xPos += colWidths[i];
    }
    yPosition += 15;
    
    // Table rows
    const diversManifest = Array.isArray(diveLog.divers_manifest) ? diveLog.divers_manifest as any[] : [];
    for (let row = 0; row < 4; row++) {
      const diver = diversManifest[row];
      xPos = margin;
      doc.setFont('helvetica', 'normal');
      
      for (let i = 0; i < colWidths.length; i++) {
        doc.rect(xPos, yPosition, colWidths[i], 8);
        
        if (i === 0) {
          doc.text((row + 1).toString(), xPos + colWidths[i]/2 - 1, yPosition + 5);
        } else if (i === 1 && diver?.name) {
          doc.text(diver.name.substring(0, 20), xPos + 1, yPosition + 5);
        } else if (i === 2 && diver?.license) {
          doc.text(diver.license.substring(0, 12), xPos + 1, yPosition + 5);
        } else if (i === 3 && diver?.role) {
          doc.text(diver.role.substring(0, 10), xPos + 1, yPosition + 5);
        } else if (i === 4) {
          doc.rect(xPos + 5, yPosition + 2, 3, 3);
          if (diver?.standard_depth === true) doc.text('X', xPos + 6, yPosition + 4);
          doc.text('SÍ', xPos + 10, yPosition + 4);
          doc.rect(xPos + 15, yPosition + 2, 3, 3);
          if (diver?.standard_depth === false) doc.text('X', xPos + 16, yPosition + 4);
          doc.text('NO', xPos + 20, yPosition + 4);
        } else if (i === 5 && diver?.working_depth) {
          doc.text(diver.working_depth.toString(), xPos + 1, yPosition + 5);
        } else if (i === 6 && diver?.start_time) {
          doc.text(diver.start_time, xPos + 1, yPosition + 5);
        } else if (i === 7 && diver?.end_time) {
          doc.text(diver.end_time, xPos + 1, yPosition + 5);
        } else if (i === 8 && diver?.dive_time) {
          doc.text(diver.dive_time, xPos + 1, yPosition + 5);
        }
        
        xPos += colWidths[i];
      }
      yPosition += 8;
    }
    
    yPosition += 5;
    doc.setFontSize(8);
    doc.text('Nota: Capacidad máxima permitida de 20 metros.', pageWidth / 2 - 30, yPosition);
    yPosition += 15;
    
    // Work Details Section
    doc.setFontSize(10);
    doc.rect(margin, yPosition, contentWidth, 40);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLE DE TRABAJO REALIZADO POR BUZO', pageWidth / 2 - 40, yPosition + 4);
    yPosition += 10;
    
    for (let i = 0; i < 4; i++) {
      const diver = diversManifest[i];
      doc.setFont('helvetica', 'bold');
      doc.text(`BUZO ${i + 1}:`, margin + 2, yPosition);
      doc.rect(margin + 2, yPosition + 2, contentWidth - 4, 6);
      doc.setFont('helvetica', 'normal');
      if (diver?.work_description) {
        doc.text(diver.work_description.substring(0, 100), margin + 4, yPosition + 5);
      }
      yPosition += 8;
    }
    
    yPosition += 5;
    
    // Observations Section
    doc.rect(margin, yPosition, contentWidth, 20);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVACIONES:', margin + 2, yPosition + 5);
    doc.rect(margin + 2, yPosition + 7, contentWidth - 4, 10);
    doc.setFont('helvetica', 'normal');
    const observations = diveLog.observations || 'Faena realizada normal, buzos sin novedad.';
    doc.text(observations.substring(0, 200), margin + 4, yPosition + 12);
    yPosition += 25;
    
    // Signatures Section
    const signatureY = yPosition + 10;
    const signatureWidth = (contentWidth - 10) / 2;
    
    // Left signature box
    doc.rect(margin, signatureY, signatureWidth, 20);
    doc.text('(Firma)', margin + signatureWidth/2 - 10, signatureY + 10);
    doc.line(margin, signatureY + 22, margin + signatureWidth, signatureY + 22);
    doc.text('NOMBRE Y CARGO', margin + signatureWidth/2 - 15, signatureY + 26);
    doc.setFont('helvetica', 'bold');
    doc.text('FIRMA ENCARGADO DE CENTRO', margin + signatureWidth/2 - 25, signatureY + 30);
    
    // Right signature box
    const rightSigX = margin + signatureWidth + 10;
    doc.rect(rightSigX, signatureY, signatureWidth, 20);
    
    if (hasSignature && diveLog.signature_url) {
      doc.text('(Firmado Digitalmente)', rightSigX + signatureWidth/2 - 20, signatureY + 10);
      doc.setFontSize(8);
      doc.setTextColor(0, 128, 0);
      doc.text(`FIRMADO DIGITALMENTE - Código: DL-${diveLog.id?.slice(0, 8).toUpperCase()}`, rightSigX + 5, signatureY + 15);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
    } else {
      doc.text('(Firma y Timbre)', rightSigX + signatureWidth/2 - 15, signatureY + 10);
    }
    
    doc.line(rightSigX, signatureY + 22, rightSigX + signatureWidth, signatureY + 22);
    doc.setFont('helvetica', 'normal');
    doc.text('NOMBRE Y CARGO', rightSigX + signatureWidth/2 - 15, signatureY + 26);
    doc.setFont('helvetica', 'bold');
    doc.text('FIRMA Y TIMBRE SUPERVISOR DE BUCEO', rightSigX + signatureWidth/2 - 35, signatureY + 30);
    
    // Footer
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Queda prohibido cualquier tipo de explotación y, en particular, la reproducción, distribución, comunicación pública y/o transformación, total o parcial, por cualquier medio, de este documento sin el previo consentimiento expreso y por escrito de Aerocam SPA.', 
             pageWidth / 2, pageHeight - 10, { align: 'center', maxWidth: contentWidth });
    
    // Generate filename and save
    const dateStr = diveLog.log_date ? new Date(diveLog.log_date).toISOString().split('T')[0] : 'sin-fecha';
    const centerName = diveLog.centers?.name ? diveLog.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
    const filename = `bitacora-${centerName}-${dateStr}-${diveLog.id?.slice(-6)}.pdf`;
    
    doc.save(filename);
  }, []);

  return { generatePDF };
};
