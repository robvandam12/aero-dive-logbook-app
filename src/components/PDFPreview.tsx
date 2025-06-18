
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

        // Generate the formatted PDF preview using your provided structure
        const previewComponent = (
          <div className="printable-page bg-white p-6 font-sans text-gray-800 text-xs">
            {/* Header Section */}
            <header className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-1">
                    <img 
                      src="https://ujtuzthydhfckpxommcv.supabase.co/storage/v1/object/public/dive-log-images/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" 
                      alt="Aerocam Logo" 
                      className="h-10 w-20 object-contain"
                    />
                    <span className="text-2xl font-semibold">aerocam</span>
                  </div>
                  <p className="text-[10px] mt-1">SOCIEDAD DE SERVICIOS AEROCAM SPA</p>
                  <p className="text-[10px]">Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</p>
                  <p className="text-[10px]">(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</p>
                </div>
                <div className="text-right">
                  <Field label="Fecha:" value={<ValueBox className="w-28">{diveLogData.log_date}</ValueBox>} labelWidthClass="w-auto" valueWidthClass="flex-grow" className="justify-end" />
                  <div className="flex justify-end items-center mt-1">
                    <span className="font-semibold text-xs mr-1">Nº:</span>
                    <ValueBox className="w-28 text-green-600 font-bold">{diveLogData.id?.slice(-6) || ''}</ValueBox>
                  </div>
                </div>
              </div>
              <h1 className="text-lg font-bold text-center my-2">BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</h1>
              <Field label="CENTRO DE CULTIVO:" value={<ValueBox>{diveLogData.centers?.name || 'N/A'}</ValueBox>} labelWidthClass="w-auto font-bold" valueWidthClass="flex-grow" />
            </header>

            {/* Datos Generales Section */}
            <section className="mb-4 p-2 border border-gray-400">
              <h2 className="font-bold text-sm mb-2 text-center bg-gray-200 p-1 -m-2 mb-2">DATOS GENERALES</h2>
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <Field label="SUPERVISOR:" value={<ValueBox>{diveLogData.profiles?.username || 'N/A'}</ValueBox>} labelWidthClass="w-auto" valueWidthClass="flex-grow" />
                  <Field label="N° MATRICULA:" value={<ValueBox>{diveLogData.supervisor_license || 'N/A'}</ValueBox>} labelWidthClass="w-auto" valueWidthClass="flex-grow" />
                </div>
                <div>
                  <Field label="JEFE DE CENTRO:" value={<ValueBox>{diveLogData.center_manager || 'N/A'}</ValueBox>} labelWidthClass="w-auto" valueWidthClass="flex-grow" />
                  <Field label="ASISTENTE DE CENTRO:" value={<ValueBox>{diveLogData.center_assistant || 'N/A'}</ValueBox>} labelWidthClass="w-auto" valueWidthClass="flex-grow" />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-300">
                <h3 className="font-semibold mb-1 text-center">CONDICIÓN TIEMPO VARIABLES</h3>
                <div className="flex items-center space-x-4 mb-1">
                  <Checkbox label="SÍ" checked={diveLogData.weather_good === true} />
                  <Checkbox label="NO" checked={diveLogData.weather_good === false} />
                  <Field label="OBSERVACIONES:" value={<ValueBox className="flex-grow">{diveLogData.weather_conditions || 'Buen tiempo'}</ValueBox>} labelWidthClass="w-auto" valueWidthClass="flex-grow" />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-300">
                <h3 className="font-semibold mb-1 text-center">REGISTRO DE COMPRESORES</h3>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-xs">COMPRESOR 1:</span>
                  <ValueBox className="w-24">{diveLogData.compressor_1 || ''}</ValueBox>
                  <span className="font-semibold text-xs ml-4">COMPRESOR 2:</span>
                  <ValueBox className="w-24">{diveLogData.compressor_2 || ''}</ValueBox>
                </div>
                <Field label="Nº SOLICITUD DE FAENA:" value={<ValueBox>{diveLogData.work_order_number || 'N/A'}</ValueBox>} labelWidthClass="w-auto" valueWidthClass="flex-grow" />
                <Field label="FECHA Y HORA DE INICIO:" value={<ValueBox>{diveLogData.start_time || diveLogData.departure_time || 'N/A'}</ValueBox>} labelWidthClass="w-auto" valueWidthClass="flex-grow" />
                <Field label="FECHA Y HORA DE TÉRMINO:" value={<ValueBox>{diveLogData.end_time || diveLogData.arrival_time || 'N/A'}</ValueBox>} labelWidthClass="w-auto" valueWidthClass="flex-grow" />
              </div>
            </section>

            {/* Team de Buceo Section */}
            <section className="mb-4 p-2 border border-gray-400">
              <h2 className="font-bold text-sm mb-2 text-center bg-gray-200 p-1 -m-2 mb-2">TEAM DE BUCEO</h2>
              <p className="text-center font-semibold mb-1">COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES</p>
              <div className="grid grid-cols-[auto_1.6fr_1fr_0.8fr_1.2fr_0.8fr_0.8fr_0.8fr_0.8fr] border-t border-l border-gray-600 text-xs">
                {/* Headers */}
                <div className="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center">BUZO</div>
                <div className="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center">IDENTIFICACIÓN</div>
                <div className="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center">Nº MATRICULA</div>
                <div className="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center">CARGO</div>
                <div className="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center leading-tight">BUCEO ESTANDAR<br/>PROFUNDIDAD<br/>20 MTS MAXIMO<br/>(SÍ / NO)</div>
                <div className="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center leading-tight">PROFUNDIDAD<br/>DE TRABAJO<br/>REALIZADO<br/>(Metros)</div>
                <div className="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center leading-tight">INICIO DE<br/>BUCEO</div>
                <div className="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center leading-tight">TÉRMINO<br/>DE BUCEO</div>
                <div className="p-1 border-r border-b border-gray-600 font-semibold bg-gray-100 text-center flex items-center justify-center leading-tight">TIEMPO<br/>DE BUCEO<br/>(min)</div>

                {/* Render up to 4 divers */}
                {[1, 2, 3, 4].map((buzoNum) => {
                  const diver = diversManifest[buzoNum - 1];
                  return (
                    <React.Fragment key={buzoNum}>
                      <div className="p-1 border-r border-b border-gray-500 flex items-center justify-center">{buzoNum}</div>
                      <div className="p-1 border-r border-b border-gray-500"><ValueBox className="w-full">{diver?.name || ''}</ValueBox></div>
                      <div className="p-1 border-r border-b border-gray-500"><ValueBox className="w-full">{diver?.license || ''}</ValueBox></div>
                      <div className="p-1 border-r border-b border-gray-500"><ValueBox className="w-full">{diver?.role || ''}</ValueBox></div>
                      <div className="p-1 border-r border-b border-gray-500 flex items-center justify-center space-x-2">
                        <Checkbox checked={diver?.standard_depth === true} />
                        <Checkbox checked={diver?.standard_depth === false} />
                      </div>
                      <div className="p-1 border-r border-b border-gray-500"><ValueBox className="w-full">{diver?.working_depth || ''}</ValueBox></div>
                      <div className="p-1 border-r border-b border-gray-500"><ValueBox className="w-full">{diver?.start_time || ''}</ValueBox></div>
                      <div className="p-1 border-r border-b border-gray-500"><ValueBox className="w-full">{diver?.end_time || ''}</ValueBox></div>
                      <div className="p-1 border-r border-b border-gray-500"><ValueBox className="w-full">{diver?.dive_time || ''}</ValueBox></div>
                    </React.Fragment>
                  );
                })}
              </div>
              <p className="text-[10px] mt-1 text-center">Nota: Capacidad máxima permitida de 20 metros.</p>
            </section>

            {/* Detalle de Trabajo Section */}
            <section className="mb-4 p-2 border border-gray-400">
              <h2 className="font-bold text-sm mb-2 text-center bg-gray-200 p-1 -m-2 mb-2">DETALLE DE TRABAJO REALIZADO POR BUZO</h2>
              {[1, 2, 3, 4].map((buzoNum) => {
                const diver = diversManifest[buzoNum - 1];
                return (
                  <Field 
                    key={buzoNum}
                    label={`BUZO ${buzoNum}:`} 
                    value={<ValueBox isTextarea lines={2} className="w-full">{diver?.work_description || ''}</ValueBox>} 
                    vertical 
                    className="mb-2"
                  />
                );
              })}
            </section>

            {/* Observaciones Generales Section */}
            <section className="mb-4 p-2 border border-gray-400">
              <Field 
                label="OBSERVACIONES:" 
                value={<ValueBox isTextarea lines={3} className="w-full">{diveLogData.observations || 'Faena realizada normal, buzos sin novedad.'}</ValueBox>} 
                vertical 
              />
            </section>

            {/* Firmas Section */}
            <section className="mt-6 pt-4 border-t border-gray-300">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <ValueBox className="w-full h-16 mb-1">(Firma)</ValueBox>
                  <p className="border-t border-black pt-1">NOMBRE Y CARGO</p>
                  <p className="font-semibold">FIRMA ENCARGADO DE CENTRO</p>
                </div>
                <div className="text-center">
                  <ValueBox className="w-full h-16 mb-1">
                    {hasSignature && diveLogData.signature_url ? (
                      <img src={diveLogData.signature_url} alt="Firma" className="max-h-14 max-w-full object-contain" />
                    ) : (
                      '(Firma y Timbre)'
                    )}
                  </ValueBox>
                  <p className="border-t border-black pt-1">NOMBRE Y CARGO</p>
                  <p className="font-semibold">FIRMA Y TIMBRE SUPERVISOR DE BUCEO</p>
                  {hasSignature && (
                    <p className="text-[10px] text-green-600 font-bold mt-1">
                      FIRMADO DIGITALMENTE - Código: DL-{diveLogData.id?.slice(0, 8).toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-[9px] mt-6 text-center text-gray-500">
                Queda prohibido cualquier tipo de explotación y, en particular, la reproducción, distribución, comunicación pública y/o transformación, total o parcial, por cualquier medio, de este documento sin el previo consentimiento expreso y por escrito de Aerocam SPA.
              </p>
            </section>
          </div>
        );

        // Convert React component to HTML string for preview
        const htmlString = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Bitácora de Buceo - ${diveLogData.id?.slice(-6)}</title>
          </head>
          <body>
            ${document.createElement('div').innerHTML = previewComponent}
          </body>
          </html>
        `;
        
        setPreviewContent(htmlString);
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
