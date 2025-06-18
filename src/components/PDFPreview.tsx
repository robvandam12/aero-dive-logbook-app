
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download } from "lucide-react";
import { usePDFExport } from "@/hooks/usePDFExport";
import { supabase } from "@/integrations/supabase/client";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";

interface PDFPreviewProps {
  diveLogId: string;
  hasSignature: boolean;
  diveLog?: DiveLogWithFullDetails;
}

export const PDFPreview = ({ diveLogId, hasSignature, diveLog }: PDFPreviewProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const { exportToPDF } = usePDFExport();

  const handlePreview = async () => {
    setIsLoadingPreview(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: { diveLogId, preview: true },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success && data.html) {
        // Generate proper HTML for preview that matches the physical form
        const formattedHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                color: black; 
                line-height: 1.4; 
                margin: 20px;
                background: white;
              }
              .header { 
                text-align: center; 
                border-bottom: 2px solid #333; 
                padding-bottom: 10px; 
                margin-bottom: 20px; 
              }
              .logo { 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                gap: 15px; 
                margin-bottom: 10px; 
              }
              .company-info { 
                font-size: 12px; 
                margin-bottom: 5px; 
              }
              .document-title { 
                font-size: 16px; 
                font-weight: bold; 
                margin: 10px 0; 
              }
              .form-section { 
                border: 1px solid #333; 
                margin: 10px 0; 
                padding: 10px; 
              }
              .section-title { 
                background: #333; 
                color: white; 
                padding: 5px; 
                margin: -10px -10px 10px -10px; 
                font-weight: bold; 
              }
              .data-row { 
                display: flex; 
                margin: 5px 0; 
                gap: 20px; 
              }
              .data-field { 
                flex: 1; 
                display: flex; 
              }
              .field-label { 
                font-weight: bold; 
                min-width: 120px; 
              }
              .field-value { 
                border-bottom: 1px solid #333; 
                flex: 1; 
                padding-bottom: 2px; 
              }
              .table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 10px 0; 
              }
              .table th, .table td { 
                border: 1px solid #333; 
                padding: 5px; 
                text-align: left; 
                font-size: 10px; 
              }
              .table th { 
                background: #333; 
                color: white; 
                font-weight: bold; 
              }
              .observations { 
                min-height: 80px; 
                border: 1px solid #333; 
                padding: 10px; 
                margin: 10px 0; 
              }
              .signature-section { 
                display: flex; 
                justify-content: space-between; 
                margin-top: 30px; 
                padding-top: 20px; 
              }
              .signature-box { 
                width: 250px; 
                text-align: center; 
              }
              .signature-line { 
                border-top: 1px solid #333; 
                margin: 40px 0 5px 0; 
              }
              .number-box { 
                float: right; 
                border: 2px solid green; 
                padding: 5px 10px; 
                color: green; 
                font-weight: bold; 
                margin-bottom: 10px; 
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="number-box">Nº ${data.diveLog?.id?.slice(-6) || '000000'}</div>
              <div class="logo">
                <img src="https://ujtuzthydhfckpxommcv.supabase.co/storage/v1/object/public/dive-log-images/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" 
                     alt="Aerocam Logo" style="height: 60px; width: auto;">
                <div>
                  <div style="font-size: 18px; font-weight: bold;">SOCIEDAD DE SERVICIOS AEROCAM SPA</div>
                  <div class="company-info">Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</div>
                  <div class="company-info">(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</div>
                </div>
              </div>
              <div class="document-title">BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</div>
              <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <div><strong>Centro de cultivo:</strong> ${data.diveLog?.centers?.name || 'N/A'}</div>
                <div><strong>Fecha:</strong> ${data.diveLog?.log_date || 'N/A'}</div>
              </div>
            </div>

            <div class="form-section">
              <div class="section-title">DATOS GENERALES</div>
              <div class="data-row">
                <div class="data-field">
                  <span class="field-label">Supervisor:</span>
                  <span class="field-value">${data.diveLog?.profiles?.username || 'N/A'}</span>
                </div>
                <div class="data-field">
                  <span class="field-label">Jefe de centro:</span>
                  <span class="field-value">${data.diveLog?.center_manager || 'N/A'}</span>
                </div>
              </div>
              <div class="data-row">
                <div class="data-field">
                  <span class="field-label">N° Matrícula:</span>
                  <span class="field-value">${data.diveLog?.supervisor_license || 'N/A'}</span>
                </div>
                <div class="data-field">
                  <span class="field-label">Asistente de centro:</span>
                  <span class="field-value">${data.diveLog?.center_assistant || 'N/A'}</span>
                </div>
              </div>
              <div class="data-row">
                <div class="data-field">
                  <span class="field-label">Observaciones:</span>
                  <span class="field-value">${data.diveLog?.weather_conditions || 'Buen tiempo'}</span>
                </div>
              </div>
              <div class="data-row">
                <div class="data-field">
                  <span class="field-label">Compresor 1:</span>
                  <span class="field-value">${data.diveLog?.compressor_1 || 'N/A'}</span>
                </div>
                <div class="data-field">
                  <span class="field-label">N° Solicitud de Faena:</span>
                  <span class="field-value">${data.diveLog?.work_order_number || 'N/A'}</span>
                </div>
              </div>
              <div class="data-row">
                <div class="data-field">
                  <span class="field-label">Compresor 2:</span>
                  <span class="field-value">${data.diveLog?.compressor_2 || ''}</span>
                </div>
                <div class="data-field">
                  <span class="field-label">Fecha y hora inicio:</span>
                  <span class="field-value">${data.diveLog?.start_time || 'N/A'}</span>
                </div>
              </div>
              <div class="data-row">
                <div class="data-field">
                  <span class="field-label">Temperatura:</span>
                  <span class="field-value">${data.diveLog?.water_temperature ? data.diveLog.water_temperature + '°C' : 'N/A'}</span>
                </div>
                <div class="data-field">
                  <span class="field-label">Fecha y hora término:</span>
                  <span class="field-value">${data.diveLog?.end_time || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="section-title">TEAM DE BUCEO - Composición de equipo Buzos y Asistentes</div>
              <table class="table">
                <thead>
                  <tr>
                    <th>BUZO</th>
                    <th>Identificación</th>
                    <th>N° Matrícula</th>
                    <th>Cargo</th>
                    <th>Buceo estándar 20m</th>
                    <th>Prof. trabajo</th>
                    <th>Inicio</th>
                    <th>Término</th>
                    <th>Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.diveLog?.divers_manifest && Array.isArray(data.diveLog.divers_manifest) 
                    ? data.diveLog.divers_manifest.map((diver: any, index: number) => `
                      <tr>
                        <td>BUZO ${index + 1}</td>
                        <td>${diver.name || 'N/A'}</td>
                        <td>${diver.license || 'N/A'}</td>
                        <td>${diver.role || 'Buzo'}</td>
                        <td>${diver.standard_depth ? 'Sí' : 'No'}</td>
                        <td>${diver.work_depth || 'N/A'}m</td>
                        <td>${diver.start_time || 'N/A'}</td>
                        <td>${diver.end_time || 'N/A'}</td>
                        <td>${diver.duration || 'N/A'} min</td>
                      </tr>
                    `).join('')
                    : '<tr><td colspan="9">No hay buzos registrados</td></tr>'
                  }
                </tbody>
              </table>
            </div>

            <div class="form-section">
              <div class="section-title">DETALLE DE TRABAJO REALIZADO POR BUZO</div>
              <div class="observations">
                ${data.diveLog?.work_details || data.diveLog?.observations || 'Sin detalles de trabajo registrados'}
              </div>
            </div>

            <div class="form-section">
              <div class="section-title">OBSERVACIONES GENERALES</div>
              <div class="observations">
                ${data.diveLog?.observations || 'Faena realizada normal, buzos sin novedad.'}
              </div>
            </div>

            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div style="font-size: 10px; margin-top: 5px;">
                  <strong>NOMBRE / CARGO</strong><br>
                  <strong>FIRMA ENCARGADO DE CENTRO</strong>
                </div>
              </div>
              <div class="signature-box">
                ${hasSignature ? `
                  <div style="margin-bottom: 10px;">
                    <img src="${data.diveLog?.signature_url}" alt="Firma" style="max-height: 40px; max-width: 200px;">
                  </div>
                ` : '<div class="signature-line"></div>'}
                <div style="font-size: 10px; margin-top: 5px;">
                  <strong>FIRMA Y TIMBRE</strong><br>
                  <strong>SUPERVISOR DE BUCEO</strong><br>
                  ${hasSignature ? '<span style="color: green;">FIRMADO DIGITALMENTE</span>' : ''}
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        
        setPreviewContent(formattedHtml);
        setPreviewOpen(true);
      }
    } catch (error) {
      console.error('Error previewing PDF:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDownload = () => {
    exportToPDF.mutate({
      diveLogId,
      includeSignature: hasSignature,
    });
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePreview}
        disabled={isLoadingPreview}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Eye className="w-4 h-4 mr-2" />
        {isLoadingPreview ? 'Cargando...' : 'Previsualizar PDF'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownload}
        disabled={exportToPDF.isPending}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Download className="w-4 h-4 mr-2" />
        Descargar PDF
      </Button>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Previsualización de Bitácora PDF</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto bg-white rounded max-h-[80vh]">
            <div 
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
