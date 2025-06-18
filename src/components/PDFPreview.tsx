
import React, { useState } from "react";
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

interface ValueBoxProps {
  children: React.ReactNode;
  className?: string;
  isTextarea?: boolean;
  lines?: number;
}

const ValueBox: React.FC<ValueBoxProps> = ({ children, className = "", isTextarea = false, lines = 1 }) => {
  const baseStyle = "border border-gray-400 px-1 py-0.5 text-gray-700 text-xs break-words";
  const heightStyle = isTextarea ? (lines === 1 ? 'min-h-[1.5rem]' : `min-h-[${lines * 1.25}rem]`) : 'h-6';
  return (
    <div className={`${baseStyle} ${heightStyle} ${className} flex items-start`}>
      {children}
    </div>
  );
};

interface FieldProps {
  label: string;
  value: React.ReactNode;
  labelWidthClass?: string;
  valueWidthClass?: string;
  className?: string;
  vertical?: boolean;
  labelClassName?: string;
}

const Field: React.FC<FieldProps> = ({ label, value, labelWidthClass = "w-1/3", valueWidthClass = "w-2/3", className = "mb-1", vertical = false, labelClassName = "" }) => {
  if (vertical) {
    return (
      <div className={`flex flex-col text-xs ${className}`}>
        <span className={`font-semibold text-gray-600 ${labelClassName}`}>{label}</span>
        {value}
      </div>
    );
  }
  return (
    <div className={`flex items-center text-xs ${className}`}>
      <span className={`font-semibold text-gray-600 pr-1 ${labelWidthClass} ${labelClassName}`}>{label}</span>
      <div className={`${valueWidthClass}`}>{value}</div>
    </div>
  );
};

interface CheckboxProps {
  checked?: boolean;
  label?: string;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, label, className = "" }) => (
  <div className={`flex items-center space-x-1 ${className}`}>
    <div className={`w-3 h-3 border border-black flex items-center justify-center`}>
      {checked && <span className="text-[10px] font-bold">X</span>}
    </div>
    {label && <span className="text-xs">{label}</span>}
  </div>
);

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

      if (data.success && data.diveLog) {
        const diveLogData = data.diveLog;
        const diversManifest = Array.isArray(diveLogData.divers_manifest) 
          ? diveLogData.divers_manifest as any[]
          : [];

        // Generate diver rows for the table
        const generateDiverRows = () => {
          return [1, 2, 3, 4].map(buzoNum => {
            const diver = diversManifest[buzoNum - 1];
            return `
              <div class="p-1 border-r border-b border-gray-500 flex items-center justify-center">${buzoNum}</div>
              <div class="p-1 border-r border-b border-gray-500">
                <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full flex items-start">${diver?.name || ''}</div>
              </div>
              <div class="p-1 border-r border-b border-gray-500">
                <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full flex items-start">${diver?.license || ''}</div>
              </div>
              <div class="p-1 border-r border-b border-gray-500">
                <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full flex items-start">${diver?.role || ''}</div>
              </div>
              <div class="p-1 border-r border-b border-gray-500 flex items-center justify-center space-x-2">
                <div class="flex items-center space-x-1">
                  <div class="w-3 h-3 border border-black flex items-center justify-center">
                    ${diver?.standard_depth === true ? '<span class="text-[10px] font-bold">X</span>' : ''}
                  </div>
                </div>
                <div class="flex items-center space-x-1">
                  <div class="w-3 h-3 border border-black flex items-center justify-center">
                    ${diver?.standard_depth === false ? '<span class="text-[10px] font-bold">X</span>' : ''}
                  </div>
                </div>
              </div>
              <div class="p-1 border-r border-b border-gray-500">
                <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full flex items-start">${diver?.working_depth || ''}</div>
              </div>
              <div class="p-1 border-r border-b border-gray-500">
                <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full flex items-start">${diver?.start_time || ''}</div>
              </div>
              <div class="p-1 border-r border-b border-gray-500">
                <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full flex items-start">${diver?.end_time || ''}</div>
              </div>
              <div class="p-1 border-r border-b border-gray-500">
                <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full flex items-start">${diver?.dive_time || ''}</div>
              </div>
            `;
          }).join('');
        };

        // Generate work details for each diver
        const generateWorkDetails = () => {
          return [1, 2, 3, 4].map(buzoNum => {
            const diver = diversManifest[buzoNum - 1];
            return `
              <div class="flex flex-col text-xs mb-2">
                <span class="font-semibold text-gray-600">BUZO ${buzoNum}:</span>
                <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs min-h-[2.5rem] w-full flex items-start">${diver?.work_description || ''}</div>
              </div>
            `;
          }).join('');
        };

        // Generate the HTML content for preview
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Bitácora de Buceo - ${diveLogData.id?.slice(-6)}</title>
          </head>
          <body>
            <div class="printable-page bg-white p-6 font-sans text-gray-800 text-xs">
              <!-- Header Section -->
              <header class="mb-4">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center space-x-1">
                      <img 
                        src="https://ujtuzthydhfckpxommcv.supabase.co/storage/v1/object/public/dive-log-images/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" 
                        alt="Aerocam Logo" 
                        class="h-10 w-20 object-contain"
                      />
                      <span class="text-2xl font-semibold">aerocam</span>
                    </div>
                    <p class="text-[10px] mt-1">SOCIEDAD DE SERVICIOS AEROCAM SPA</p>
                    <p class="text-[10px]">Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</p>
                    <p class="text-[10px]">(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</p>
                  </div>
                  <div class="text-right">
                    <div class="flex justify-end items-center text-xs mb-1">
                      <span class="font-semibold text-gray-600 pr-1 w-auto">Fecha:</span>
                      <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-28">${diveLogData.log_date || ''}</div>
                    </div>
                    <div class="flex justify-end items-center mt-1">
                      <span class="font-semibold text-xs mr-1">Nº:</span>
                      <div class="border border-gray-400 px-1 py-0.5 text-green-600 font-bold text-xs h-6 w-28">${diveLogData.id?.slice(-6) || ''}</div>
                    </div>
                  </div>
                </div>
                <h1 class="text-lg font-bold text-center my-2">BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</h1>
                <div class="flex items-center text-xs mb-1">
                  <span class="font-semibold text-gray-600 pr-1 w-auto font-bold">CENTRO DE CULTIVO:</span>
                  <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">${diveLogData.centers?.name || 'N/A'}</div>
                </div>
              </header>

              <!-- Datos Generales Section -->
              <section class="mb-4 p-2 border border-gray-400">
                <h2 class="font-bold text-sm mb-2 text-center bg-gray-200 p-1 -m-2 mb-2">DATOS GENERALES</h2>
                <div class="grid grid-cols-2 gap-x-4">
                  <div>
                    <div class="flex items-center text-xs mb-1">
                      <span class="font-semibold text-gray-600 pr-1 w-auto">SUPERVISOR:</span>
                      <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">${diveLogData.profiles?.username || 'N/A'}</div>
                    </div>
                    <div class="flex items-center text-xs mb-1">
                      <span class="font-semibold text-gray-600 pr-1 w-auto">N° MATRICULA:</span>
                      <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">${diveLogData.supervisor_license || 'N/A'}</div>
                    </div>
                  </div>
                  <div>
                    <div class="flex items-center text-xs mb-1">
                      <span class="font-semibold text-gray-600 pr-1 w-auto">JEFE DE CENTRO:</span>
                      <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">${diveLogData.center_manager || 'N/A'}</div>
                    </div>
                    <div class="flex items-center text-xs mb-1">
                      <span class="font-semibold text-gray-600 pr-1 w-auto">ASISTENTE DE CENTRO:</span>
                      <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">${diveLogData.center_assistant || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-3 pt-2 border-t border-gray-300">
                  <h3 class="font-semibold mb-1 text-center">CONDICIÓN TIEMPO VARIABLES</h3>
                  <div class="flex items-center space-x-4 mb-1">
                    <div class="flex items-center space-x-1">
                      <div class="w-3 h-3 border border-black flex items-center justify-center">
                        ${diveLogData.weather_good === true ? '<span class="text-[10px] font-bold">X</span>' : ''}
                      </div>
                      <span class="text-xs">SÍ</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <div class="w-3 h-3 border border-black flex items-center justify-center">
                        ${diveLogData.weather_good === false ? '<span class="text-[10px] font-bold">X</span>' : ''}
                      </div>
                      <span class="text-xs">NO</span>
                    </div>
                    <div class="flex items-center text-xs flex-grow">
                      <span class="font-semibold text-gray-600 pr-1 w-auto">OBSERVACIONES:</span>
                      <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">${diveLogData.weather_conditions || 'Buen tiempo'}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-3 pt-2 border-t border-gray-300">
                  <h3 class="font-semibold mb-1 text-center">REGISTRO DE COMPRESORES</h3>
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="font-semibold text-xs">COMPRESOR 1:</span>
                    <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-24">${diveLogData.compressor_1 || ''}</div>
                    <span class="font-semibold text-xs ml-4">COMPRESOR 2:</span>
                    <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-24">${diveLogData.compressor_2 || ''}</div>
                  </div>
                  <div class="flex items-center text-xs mb-1">
                    <span class="font-semibold text-gray-600 pr-1 w-auto">Nº SOLICITUD DE FAENA:</span>
                    <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">${diveLogData.work_order_number || 'N/A'}</div>
                  </div>
                  <div class="flex items-center text-xs mb-1">
                    <span class="font-semibold text-gray-600 pr-1 w-auto">FECHA Y HORA DE INICIO:</span>
                    <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">${diveLogData.start_time || diveLogData.departure_time || 'N/A'}</div>
                  </div>
                  <div class="flex items-center text-xs mb-1">
                    <span class="font-semibold text-gray-600 pr-1 w-auto">FECHA Y HORA DE TÉRMINO:</span>
                    <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">${diveLogData.end_time || diveLogData.arrival_time || 'N/A'}</div>
                  </div>
                </div>
              </section>

              <!-- Team de Buceo Section -->
              <section class="mb-4 p-2 border border-gray-400">
                <h2 class="font-bold text-sm mb-2 text-center bg-gray-200 p-1 -m-2 mb-2">TEAM DE BUCEO</h2>
                <p class="text-center font-semibold mb-1">COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES</p>
                <div class="grid grid-cols-[auto_1.6fr_1fr_0.8fr_1.2fr_0.8fr_0.8fr_0.8fr_0.8fr] border-t border-l border-gray-600 text-xs">
                  <!-- Headers -->
                  <div class="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center">BUZO</div>
                  <div class="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center">IDENTIFICACIÓN</div>
                  <div class="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center">Nº MATRICULA</div>
                  <div class="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center">CARGO</div>
                  <div class="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center leading-tight">BUCEO ESTANDAR<br/>PROFUNDIDAD<br/>20 MTS MAXIMO<br/>(SÍ / NO)</div>
                  <div class="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center leading-tight">PROFUNDIDAD<br/>DE TRABAJO<br/>REALIZADO<br/>(Metros)</div>
                  <div class="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center leading-tight">INICIO DE<br/>BUCEO</div>
                  <div class="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center leading-tight">TÉRMINO<br/>DE BUCEO</div>
                  <div class="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center leading-tight">TIEMPO<br/>DE BUCEO<br/>(min)</div>

                  <!-- Render up to 4 divers -->
                  ${generateDiverRows()}
                </div>
                <p class="text-[10px] mt-1 text-center">Nota: Capacidad máxima permitida de 20 metros.</p>
              </section>

              <!-- Detalle de Trabajo Section -->
              <section class="mb-4 p-2 border border-gray-400">
                <h2 class="font-bold text-sm mb-2 text-center bg-gray-200 p-1 -m-2 mb-2">DETALLE DE TRABAJO REALIZADO POR BUZO</h2>
                ${generateWorkDetails()}
              </section>

              <!-- Observaciones Generales Section -->
              <section class="mb-4 p-2 border border-gray-400">
                <div class="flex flex-col text-xs">
                  <span class="font-semibold text-gray-600">OBSERVACIONES:</span>
                  <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs min-h-[3.75rem] w-full flex items-start">${diveLogData.observations || 'Faena realizada normal, buzos sin novedad.'}</div>
                </div>
              </section>

              <!-- Firmas Section -->
              <section class="mt-6 pt-4 border-t border-gray-300">
                <div class="grid grid-cols-2 gap-8">
                  <div class="text-center">
                    <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-16 w-full flex items-start mb-1">(Firma)</div>
                    <p class="border-t border-black pt-1">NOMBRE Y CARGO</p>
                    <p class="font-semibold">FIRMA ENCARGADO DE CENTRO</p>
                  </div>
                  <div class="text-center">
                    <div class="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-16 w-full flex items-start mb-1">
                      ${hasSignature && diveLogData.signature_url ? 
                        `<img src="${diveLogData.signature_url}" alt="Firma" class="max-h-14 max-w-full object-contain" />` : 
                        '(Firma y Timbre)'
                      }
                    </div>
                    <p class="border-t border-black pt-1">NOMBRE Y CARGO</p>
                    <p class="font-semibold">FIRMA Y TIMBRE SUPERVISOR DE BUCEO</p>
                    ${hasSignature ? 
                      `<p class="text-[10px] text-green-600 font-bold mt-1">
                        FIRMADO DIGITALMENTE - Código: DL-${diveLogData.id?.slice(0, 8).toUpperCase()}
                      </p>` : ''
                    }
                  </div>
                </div>
                <p class="text-[9px] mt-6 text-center text-gray-500">
                  Queda prohibido cualquier tipo de explotación y, en particular, la reproducción, distribución, comunicación pública y/o transformación, total o parcial, por cualquier medio, de este documento sin el previo consentimiento expreso y por escrito de Aerocam SPA.
                </p>
              </section>
            </div>
          </body>
          </html>
        `;
        
        setPreviewContent(htmlContent);
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
