import React from 'react';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';

interface PrintableDiveLogProps {
  diveLog: DiveLogWithFullDetails;
  hasSignature: boolean;
}

export const PrintableDiveLog = React.forwardRef<HTMLDivElement, PrintableDiveLogProps>(
  ({ diveLog, hasSignature }, ref) => {
    const diversManifest = Array.isArray(diveLog.divers_manifest) 
      ? diveLog.divers_manifest as any[]
      : [];

    return (
      <div ref={ref} className="printable-page bg-white p-6 font-sans text-gray-800 text-xs min-h-[11in] w-[8.5in] mx-auto">
        <style>{`
          @media print {
            @page {
              size: letter;
              margin: 0.5in;
            }
            .printable-page {
              margin: 0 !important;
              padding: 16px !important;
              font-size: 10px !important;
              width: 100% !important;
              height: auto !important;
              min-height: auto !important;
              box-shadow: none !important;
            }
            .no-print {
              display: none !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          
          .printable-page {
            font-family: Arial, sans-serif;
            line-height: 1.2;
            color: #000;
            background: white;
          }
          
          .printable-page * {
            box-sizing: border-box;
          }
        `}</style>

        {/* Header Section */}
        <header className="mb-4 relative">
          <div className="flex justify-between items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-1 mb-1">
                <img 
                  src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
                  alt="Aerocam Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-2xl font-semibold text-blue-600">aerocam</span>
              </div>
              <p className="text-[10px] mt-1 font-bold">SOCIEDAD DE SERVICIOS AEROCAM SPA</p>
              <p className="text-[10px]">Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</p>
              <p className="text-[10px]">(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex justify-end items-center text-xs mb-1">
                <span className="font-semibold text-gray-600 pr-1">Fecha:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs min-h-[24px] w-28 flex items-center">
                  {diveLog.log_date || ''}
                </div>
              </div>
              <div className="flex justify-end items-center mt-1">
                <span className="font-semibold text-xs mr-1">Nº:</span>
                <div className="border border-gray-400 px-2 py-1 text-green-600 font-bold text-xs min-h-[24px] w-28 flex items-center">
                  {diveLog.id?.slice(-6) || ''}
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-lg font-bold text-center my-3 uppercase">BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</h1>
          <div className="flex items-center text-xs mb-1">
            <span className="font-semibold text-gray-600 pr-1 font-bold">CENTRO DE CULTIVO:</span>
            <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs min-h-[24px] flex-grow flex items-center">
              {diveLog.centers?.name || 'N/A'}
            </div>
          </div>
        </header>

        {/* Datos Generales Section */}
        <section className="mb-4 p-2 border border-gray-400">
          <h2 className="font-bold text-sm mb-2 text-center bg-gray-200 p-1 -m-2 mb-2">DATOS GENERALES</h2>
          <div className="grid grid-cols-2 gap-x-4">
            <div>
              <div className="flex items-center text-xs mb-1">
                <span className="font-semibold text-gray-600 pr-1 w-auto">SUPERVISOR:</span>
                <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">
                  {diveLog.profiles?.username || 'N/A'}
                </div>
              </div>
              <div className="flex items-center text-xs mb-1">
                <span className="font-semibold text-gray-600 pr-1 w-auto">N° MATRICULA:</span>
                <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">
                  {diveLog.supervisor_license || 'N/A'}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center text-xs mb-1">
                <span className="font-semibold text-gray-600 pr-1 w-auto">JEFE DE CENTRO:</span>
                <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">
                  {diveLog.center_manager || 'N/A'}
                </div>
              </div>
              <div className="flex items-center text-xs mb-1">
                <span className="font-semibold text-gray-600 pr-1 w-auto">ASISTENTE DE CENTRO:</span>
                <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">
                  {diveLog.center_assistant || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-300">
            <h3 className="font-semibold mb-1 text-center">CONDICIÓN TIEMPO VARIABLES</h3>
            <div className="flex items-center space-x-4 mb-1">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-black flex items-center justify-center">
                  {diveLog.weather_good === true && <span className="text-[10px] font-bold">X</span>}
                </div>
                <span className="text-xs">SÍ</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-black flex items-center justify-center">
                  {diveLog.weather_good === false && <span className="text-[10px] font-bold">X</span>}
                </div>
                <span className="text-xs">NO</span>
              </div>
              <div className="flex items-center text-xs flex-grow">
                <span className="font-semibold text-gray-600 pr-1 w-auto">OBSERVACIONES:</span>
                <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">
                  {diveLog.weather_conditions || 'Buen tiempo'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-300">
            <h3 className="font-semibold mb-1 text-center">REGISTRO DE COMPRESORES</h3>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-xs">COMPRESOR 1:</span>
              <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-24">
                {diveLog.compressor_1 || ''}
              </div>
              <span className="font-semibold text-xs ml-4">COMPRESOR 2:</span>
              <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-24">
                {diveLog.compressor_2 || ''}
              </div>
            </div>
            <div className="flex items-center text-xs mb-1">
              <span className="font-semibold text-gray-600 pr-1 w-auto">Nº SOLICITUD DE FAENA:</span>
              <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">
                {diveLog.work_order_number || 'N/A'}
              </div>
            </div>
            <div className="flex items-center text-xs mb-1">
              <span className="font-semibold text-gray-600 pr-1 w-auto">FECHA Y HORA DE INICIO:</span>
              <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">
                {diveLog.start_time || diveLog.departure_time || 'N/A'}
              </div>
            </div>
            <div className="flex items-center text-xs mb-1">
              <span className="font-semibold text-gray-600 pr-1 w-auto">FECHA Y HORA DE TÉRMINO:</span>
              <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 flex-grow">
                {diveLog.end_time || diveLog.arrival_time || 'N/A'}
              </div>
            </div>
          </div>
        </section>

        {/* Team de Buceo Section */}
        <section className="mb-4 p-2 border border-gray-400">
          <h2 className="font-bold text-sm mb-2 text-center bg-gray-200 p-1 -m-2 mb-2">TEAM DE BUCEO</h2>
          <p className="text-center font-semibold mb-1">COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES</p>
          <div className="border border-gray-600 text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-600 p-1 text-center font-semibold">BUZO</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold">IDENTIFICACIÓN</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold">Nº MATRICULA</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold">CARGO</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold leading-tight">
                    BUCEO ESTANDAR<br/>PROFUNDIDAD<br/>20 MTS MAXIMO<br/>(SÍ / NO)
                  </th>
                  <th className="border border-gray-600 p-1 text-center font-semibold leading-tight">
                    PROFUNDIDAD<br/>DE TRABAJO<br/>REALIZADO<br/>(Metros)
                  </th>
                  <th className="border border-gray-600 p-1 text-center font-semibold leading-tight">INICIO DE<br/>BUCEO</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold leading-tight">TÉRMINO<br/>DE BUCEO</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold leading-tight">
                    TIEMPO<br/>DE BUCEO<br/>(min)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map(buzoNum => {
                  const diver = diversManifest[buzoNum - 1];
                  return (
                    <tr key={buzoNum}>
                      <td className="border border-gray-600 p-1 text-center">{buzoNum}</td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full">
                          {diver?.name || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full">
                          {diver?.license || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full">
                          {diver?.role || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 border border-black flex items-center justify-center">
                              {diver?.standard_depth === true && <span className="text-[10px] font-bold">X</span>}
                            </div>
                            <span className="text-[10px]">SÍ</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 border border-black flex items-center justify-center">
                              {diver?.standard_depth === false && <span className="text-[10px] font-bold">X</span>}
                            </div>
                            <span className="text-[10px]">NO</span>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full">
                          {diver?.working_depth || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full">
                          {diver?.start_time || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full">
                          {diver?.end_time || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-6 w-full">
                          {diver?.dive_time || ''}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] mt-1 text-center">Nota: Capacidad máxima permitida de 20 metros.</p>
        </section>

        {/* Detalle de Trabajo Section */}
        <section className="mb-4 p-2 border border-gray-400">
          <h2 className="font-bold text-sm mb-2 text-center bg-gray-200 p-1 -m-2 mb-2">DETALLE DE TRABAJO REALIZADO POR BUZO</h2>
          {[1, 2, 3, 4].map(buzoNum => {
            const diver = diversManifest[buzoNum - 1];
            return (
              <div key={buzoNum} className="flex flex-col text-xs mb-2">
                <span className="font-semibold text-gray-600">BUZO {buzoNum}:</span>
                <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs min-h-[2.5rem] w-full">
                  {diver?.work_description || ''}
                </div>
              </div>
            );
          })}
        </section>

        {/* Observaciones Generales Section */}
        <section className="mb-4 p-2 border border-gray-400">
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-gray-600">OBSERVACIONES:</span>
            <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs min-h-[3.75rem] w-full">
              {diveLog.observations || 'Faena realizada normal, buzos sin novedad.'}
            </div>
          </div>
        </section>

        {/* Firmas Section */}
        <section className="mt-6 pt-4 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-16 w-full flex items-center justify-center mb-1">
                (Firma)
              </div>
              <p className="border-t border-black pt-1 text-xs">NOMBRE Y CARGO</p>
              <p className="font-semibold text-xs">FIRMA ENCARGADO DE CENTRO</p>
            </div>
            <div className="text-center">
              <div className="border border-gray-400 px-1 py-0.5 text-gray-700 text-xs h-16 w-full flex items-center justify-center mb-1">
                {hasSignature && diveLog.signature_url ? (
                  <img src={diveLog.signature_url} alt="Firma" className="max-h-14 max-w-full object-contain" />
                ) : (
                  '(Firma y Timbre)'
                )}
              </div>
              <p className="border-t border-black pt-1 text-xs">NOMBRE Y CARGO</p>
              <p className="font-semibold text-xs">FIRMA Y TIMBRE SUPERVISOR DE BUCEO</p>
              {hasSignature && (
                <p className="text-[10px] text-green-600 font-bold mt-1">
                  FIRMADO DIGITALMENTE - Código: DL-{diveLog.id?.slice(0, 8).toUpperCase()}
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
  }
);

PrintableDiveLog.displayName = 'PrintableDiveLog';
