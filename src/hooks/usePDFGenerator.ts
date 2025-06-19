
import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { DiveLogWithFullDetails } from './useDiveLog';

export const usePDFGenerator = () => {
  const generatePDF = useCallback((diveLog: DiveLogWithFullDetails, hasSignature: boolean = true) => {
    const doc = new jsPDF('portrait', 'mm', 'letter');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    let yPosition = margin;
    
    // Helper functions
    const addText = (text: string, x: number, y: number, fontSize = 10, fontStyle = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      doc.text(text, x, y);
    };
    
    const addBox = (x: number, y: number, width: number, height: number, fill = false) => {
      if (fill) {
        doc.setFillColor(240, 240, 240);
        doc.rect(x, y, width, height, 'F');
      }
      doc.setLineWidth(0.3);
      doc.rect(x, y, width, height);
    };
    
    const checkPageBreak = (neededSpace: number) => {
      if (yPosition + neededSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Header Section
    addText('SOCIEDAD DE SERVICIOS AEROCAM SPA', margin, yPosition, 14, 'bold');
    yPosition += 6;
    
    addText('Ignacio Carrera Pinto Nº 200, Quellón – Chiloé', margin, yPosition, 9);
    yPosition += 4;
    addText('(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl', margin, yPosition, 9);
    yPosition += 10;
    
    // Date and ID boxes
    const boxWidth = 40;
    const boxHeight = 8;
    const rightX = pageWidth - margin - boxWidth;
    
    addText('Fecha:', rightX - 20, yPosition - 5, 9);
    addBox(rightX, yPosition - 8, boxWidth, boxHeight);
    addText(diveLog.log_date || '', rightX + 2, yPosition - 3, 9);
    
    addText('Nº:', rightX - 15, yPosition + 3, 9);
    addBox(rightX, yPosition, boxWidth, boxHeight);
    addText(diveLog.id?.slice(-6) || '', rightX + 2, yPosition + 5, 9, 'bold');
    
    yPosition += 15;
    
    // Title
    const title = 'BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO';
    addText(title, pageWidth / 2, yPosition, 14, 'bold');
    doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Center box
    addText('CENTRO DE CULTIVO:', margin, yPosition, 10, 'bold');
    addBox(margin + 40, yPosition - 5, contentWidth - 40, 8);
    addText(diveLog.centers?.name || 'N/A', margin + 42, yPosition, 10);
    yPosition += 20;
    
    checkPageBreak(60);
    
    // General Data Section
    const sectionHeight = 55;
    addBox(margin, yPosition, contentWidth, sectionHeight);
    addBox(margin, yPosition, contentWidth, 8, true);
    addText('DATOS GENERALES', pageWidth / 2, yPosition + 5, 12, 'bold');
    doc.text('DATOS GENERALES', pageWidth / 2, yPosition + 5, { align: 'center' });
    yPosition += 12;
    
    // First row
    addText('SUPERVISOR:', margin + 2, yPosition, 9, 'bold');
    addBox(margin + 28, yPosition - 4, 60, 6);
    addText(diveLog.profiles?.username || 'N/A', margin + 30, yPosition, 9);
    
    addText('JEFE DE CENTRO:', margin + 95, yPosition, 9, 'bold');
    addBox(margin + 125, yPosition - 4, 60, 6);
    addText(diveLog.center_manager || 'N/A', margin + 127, yPosition, 9);
    yPosition += 10;
    
    // Second row
    addText('N° MATRICULA:', margin + 2, yPosition, 9, 'bold');
    addBox(margin + 28, yPosition - 4, 60, 6);
    addText(diveLog.supervisor_license || 'N/A', margin + 30, yPosition, 9);
    
    addText('ASISTENTE DE CENTRO:', margin + 95, yPosition, 9, 'bold');
    addBox(margin + 125, yPosition - 4, 60, 6);
    addText(diveLog.center_assistant || 'N/A', margin + 127, yPosition, 9);
    yPosition += 15;
    
    // Weather conditions
    addText('CONDICIÓN TIEMPO VARIABLES', pageWidth / 2, yPosition, 10, 'bold');
    doc.text('CONDICIÓN TIEMPO VARIABLES', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
    
    // Weather checkboxes
    addBox(margin + 2, yPosition - 3, 3, 3);
    if (diveLog.weather_good === true) {
      addText('X', margin + 3, yPosition - 1, 8);
    }
    addText('SÍ', margin + 8, yPosition, 9);
    
    addBox(margin + 20, yPosition - 3, 3, 3);
    if (diveLog.weather_good === false) {
      addText('X', margin + 21, yPosition - 1, 8);
    }
    addText('NO', margin + 26, yPosition, 9);
    
    addText('OBSERVACIONES:', margin + 40, yPosition, 9, 'bold');
    addBox(margin + 75, yPosition - 4, 110, 6);
    addText(diveLog.weather_conditions || 'Buen tiempo', margin + 77, yPosition, 9);
    yPosition += 12;
    
    // Compressor section
    addText('REGISTRO DE COMPRESORES', pageWidth / 2, yPosition, 10, 'bold');
    doc.text('REGISTRO DE COMPRESORES', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
    
    addText('COMPRESOR 1:', margin + 2, yPosition, 9, 'bold');
    addBox(margin + 28, yPosition - 4, 25, 6);
    addText(diveLog.compressor_1 || '', margin + 30, yPosition, 9);
    
    addText('COMPRESOR 2:', margin + 70, yPosition, 9, 'bold');
    addBox(margin + 96, yPosition - 4, 25, 6);
    addText(diveLog.compressor_2 || '', margin + 98, yPosition, 9);
    yPosition += 10;
    
    // Work order
    addText('Nº SOLICITUD DE FAENA:', margin + 2, yPosition, 9, 'bold');
    addBox(margin + 45, yPosition - 4, 140, 6);
    addText(diveLog.work_order_number || 'N/A', margin + 47, yPosition, 9);
    yPosition += 10;
    
    // Times
    addText('FECHA Y HORA DE INICIO:', margin + 2, yPosition, 9, 'bold');
    addBox(margin + 50, yPosition - 4, 135, 6);
    addText(diveLog.start_time || diveLog.departure_time || 'N/A', margin + 52, yPosition, 9);
    yPosition += 10;
    
    addText('FECHA Y HORA DE TÉRMINO:', margin + 2, yPosition, 9, 'bold');
    addBox(margin + 50, yPosition - 4, 135, 6);
    addText(diveLog.end_time || diveLog.arrival_time || 'N/A', margin + 52, yPosition, 9);
    yPosition += 20;
    
    checkPageBreak(80);
    
    // Team Section
    const teamSectionHeight = 75;
    addBox(margin, yPosition, contentWidth, teamSectionHeight);
    addBox(margin, yPosition, contentWidth, 8, true);
    addText('TEAM DE BUCEO', pageWidth / 2, yPosition + 5, 12, 'bold');
    doc.text('TEAM DE BUCEO', pageWidth / 2, yPosition + 5, { align: 'center' });
    yPosition += 12;
    
    addText('COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES', pageWidth / 2, yPosition, 10, 'bold');
    doc.text('COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    // Table headers
    const colWidths = [15, 38, 25, 20, 32, 25, 20, 20, 15];
    const headers = [
      'BUZO', 
      'IDENTIFICACIÓN', 
      'N° MATRICULA', 
      'CARGO', 
      'BUCEO ESTANDAR\nPROF. 20 MTS MAX\n(SÍ / NO)', 
      'PROFUNDIDAD\nDE TRABAJO\n(Metros)', 
      'INICIO DE\nBUCEO', 
      'TÉRMINO\nDE BUCEO', 
      'TIEMPO\nDE BUCEO\n(min)'
    ];
    
    let xPos = margin;
    doc.setFontSize(7);
    
    // Draw header row
    for (let i = 0; i < headers.length; i++) {
      addBox(xPos, yPosition, colWidths[i], 18, true);
      const lines = headers[i].split('\n');
      for (let j = 0; j < lines.length; j++) {
        doc.text(lines[j], xPos + colWidths[i]/2, yPosition + 4 + (j * 3), { align: 'center' });
      }
      xPos += colWidths[i];
    }
    yPosition += 18;
    
    // Table rows
    const diversManifest = Array.isArray(diveLog.divers_manifest) ? diveLog.divers_manifest as any[] : [];
    for (let row = 0; row < 4; row++) {
      const diver = diversManifest[row];
      xPos = margin;
      
      for (let i = 0; i < colWidths.length; i++) {
        addBox(xPos, yPosition, colWidths[i], 10);
        
        if (i === 0) {
          doc.text((row + 1).toString(), xPos + colWidths[i]/2, yPosition + 6, { align: 'center' });
        } else if (i === 1 && diver?.name) {
          doc.text(diver.name.substring(0, 18), xPos + 2, yPosition + 6);
        } else if (i === 2 && diver?.license) {
          doc.text(diver.license.substring(0, 12), xPos + 2, yPosition + 6);
        } else if (i === 3 && diver?.role) {
          doc.text(diver.role.substring(0, 10), xPos + 2, yPosition + 6);
        } else if (i === 4) {
          addBox(xPos + 5, yPosition + 2, 3, 3);
          if (diver?.standard_depth === true) doc.text('X', xPos + 6, yPosition + 4.5);
          doc.text('SÍ', xPos + 10, yPosition + 6);
          addBox(xPos + 18, yPosition + 2, 3, 3);
          if (diver?.standard_depth === false) doc.text('X', xPos + 19, yPosition + 4.5);
          doc.text('NO', xPos + 23, yPosition + 6);
        } else if (i === 5 && diver?.working_depth) {
          doc.text(diver.working_depth.toString(), xPos + colWidths[i]/2, yPosition + 6, { align: 'center' });
        } else if (i === 6 && diver?.start_time) {
          doc.text(diver.start_time, xPos + colWidths[i]/2, yPosition + 6, { align: 'center' });
        } else if (i === 7 && diver?.end_time) {
          doc.text(diver.end_time, xPos + colWidths[i]/2, yPosition + 6, { align: 'center' });
        } else if (i === 8 && diver?.dive_time) {
          doc.text(diver.dive_time, xPos + colWidths[i]/2, yPosition + 6, { align: 'center' });
        }
        
        xPos += colWidths[i];
      }
      yPosition += 10;
    }
    
    yPosition += 8;
    addText('Nota: Capacidad máxima permitida de 20 metros.', pageWidth / 2, yPosition, 8);
    doc.text('Nota: Capacidad máxima permitida de 20 metros.', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    checkPageBreak(60);
    
    // Work Details Section
    const workSectionHeight = 50;
    addBox(margin, yPosition, contentWidth, workSectionHeight);
    addBox(margin, yPosition, contentWidth, 8, true);
    addText('DETALLE DE TRABAJO REALIZADO POR BUZO', pageWidth / 2, yPosition + 5, 12, 'bold');
    doc.text('DETALLE DE TRABAJO REALIZADO POR BUZO', pageWidth / 2, yPosition + 5, { align: 'center' });
    yPosition += 12;
    
    for (let i = 0; i < 4; i++) {
      const diver = diversManifest[i];
      addText(`BUZO ${i + 1}:`, margin + 2, yPosition, 9, 'bold');
      addBox(margin + 2, yPosition + 2, contentWidth - 4, 8);
      if (diver?.work_description) {
        addText(diver.work_description.substring(0, 80), margin + 4, yPosition + 6, 8);
      }
      yPosition += 10;
    }
    
    yPosition += 10;
    
    checkPageBreak(40);
    
    // Observations Section
    addBox(margin, yPosition, contentWidth, 25);
    addText('OBSERVACIONES:', margin + 2, yPosition + 6, 10, 'bold');
    addBox(margin + 2, yPosition + 8, contentWidth - 4, 15);
    const observations = diveLog.observations || 'Faena realizada normal, buzos sin novedad.';
    const obsLines = doc.splitTextToSize(observations, contentWidth - 8);
    doc.text(obsLines, margin + 4, yPosition + 13);
    yPosition += 30;
    
    checkPageBreak(50);
    
    // Signatures Section
    const signatureY = yPosition;
    const signatureWidth = (contentWidth - 10) / 2;
    
    // Left signature
    addBox(margin, signatureY, signatureWidth, 25);
    addText('(Firma)', margin + signatureWidth/2, signatureY + 12, 9);
    doc.text('(Firma)', margin + signatureWidth/2, signatureY + 12, { align: 'center' });
    doc.line(margin + 5, signatureY + 20, margin + signatureWidth - 5, signatureY + 20);
    addText('NOMBRE Y CARGO', margin + signatureWidth/2, signatureY + 30, 8);
    doc.text('NOMBRE Y CARGO', margin + signatureWidth/2, signatureY + 30, { align: 'center' });
    addText('FIRMA ENCARGADO DE CENTRO', margin + signatureWidth/2, signatureY + 35, 9, 'bold');
    doc.text('FIRMA ENCARGADO DE CENTRO', margin + signatureWidth/2, signatureY + 35, { align: 'center' });
    
    // Right signature
    const rightSigX = margin + signatureWidth + 10;
    addBox(rightSigX, signatureY, signatureWidth, 25);
    
    if (hasSignature && diveLog.signature_url) {
      addText('(Firmado Digitalmente)', rightSigX + signatureWidth/2, signatureY + 12, 9);
      doc.text('(Firmado Digitalmente)', rightSigX + signatureWidth/2, signatureY + 12, { align: 'center' });
      doc.setFontSize(7);
      doc.setTextColor(0, 128, 0);
      addText(`FIRMADO DIGITALMENTE - Código: DL-${diveLog.id?.slice(0, 8).toUpperCase()}`, rightSigX + signatureWidth/2, signatureY + 16, 7);
      doc.text(`FIRMADO DIGITALMENTE - Código: DL-${diveLog.id?.slice(0, 8).toUpperCase()}`, rightSigX + signatureWidth/2, signatureY + 16, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    } else {
      addText('(Firma y Timbre)', rightSigX + signatureWidth/2, signatureY + 12, 9);
      doc.text('(Firma y Timbre)', rightSigX + signatureWidth/2, signatureY + 12, { align: 'center' });
    }
    
    doc.line(rightSigX + 5, signatureY + 20, rightSigX + signatureWidth - 5, signatureY + 20);
    addText('NOMBRE Y CARGO', rightSigX + signatureWidth/2, signatureY + 30, 8);
    doc.text('NOMBRE Y CARGO', rightSigX + signatureWidth/2, signatureY + 30, { align: 'center' });
    addText('FIRMA Y TIMBRE SUPERVISOR DE BUCEO', rightSigX + signatureWidth/2, signatureY + 35, 9, 'bold');
    doc.text('FIRMA Y TIMBRE SUPERVISOR DE BUCEO', rightSigX + signatureWidth/2, signatureY + 35, { align: 'center' });
    
    // Footer
    yPosition = pageHeight - 15;
    doc.setFontSize(7);
    const footerText = 'Queda prohibido cualquier tipo de explotación y, en particular, la reproducción, distribución, comunicación pública y/o transformación, total o parcial, por cualquier medio, de este documento sin el previo consentimiento expreso y por escrito de Aerocam SPA.';
    const footerLines = doc.splitTextToSize(footerText, contentWidth);
    doc.text(footerLines, pageWidth / 2, yPosition, { align: 'center' });
    
    // Generate filename and save
    const dateStr = diveLog.log_date ? new Date(diveLog.log_date).toISOString().split('T')[0] : 'sin-fecha';
    const centerName = diveLog.centers?.name ? diveLog.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
    const filename = `bitacora-${centerName}-${dateStr}-${diveLog.id?.slice(-6)}.pdf`;
    
    doc.save(filename);
  }, []);

  return { generatePDF };
};
