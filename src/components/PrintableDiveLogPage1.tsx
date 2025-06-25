
import React from 'react';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';

interface PrintableDiveLogPage1Props {
  diveLog: DiveLogWithFullDetails;
}

export const PrintableDiveLogPage1 = React.forwardRef<HTMLDivElement, PrintableDiveLogPage1Props>(
  ({ diveLog }, ref) => {
    const diversManifest = Array.isArray(diveLog.divers_manifest) 
      ? diveLog.divers_manifest as any[]
      : [];

    return (
      <div ref={ref} className="bg-white p-8 font-sans text-gray-800 text-sm" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Header Section */}
        <header className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
                  alt="Aerocam Logo" 
                  className="h-12 w-12 object-contain"
                />
                <span className="text-3xl font-bold text-blue-600">aerocam</span>
              </div>
              <p className="text-xs mt-2 font-bold">SOCIEDAD DE SERVICIOS AEROCAM SPA</p>
              <p className="text-xs">Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</p>
              <p className="text-xs">(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</p>
            </div>
            <div className="text-right">
              <div className="flex justify-end items-center text-sm mb-2">
                <span className="font-semibold text-gray-600 pr-2">Fecha:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 w-32">
                  {diveLog.log_date || ''}
                </div>
              </div>
              <div className="flex justify-end items-center mt-2">
                <span className="font-semibold text-sm mr-2">Nº:</span>
                <div className="border border-gray-400 px-2 py-1 text-green-600 font-bold text-sm h-8 w-32">
                  {diveLog.id?.slice(-6) || ''}
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold text-center my-4">BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</h1>
          <div className="flex items-center text-sm mb-2">
            <span className="font-semibold text-gray-600 pr-2 font-bold">CENTRO DE CULTIVO:</span>
            <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 flex-grow">
              {diveLog.centers?.name || 'N/A'}
            </div>
          </div>
        </header>

        {/* Datos Generales Section */}
        <section className="mb-6 p-3 border border-gray-400">
          <h2 className="font-bold text-base mb-3 text-center bg-gray-200 p-2 -m-3 mb-3">DATOS GENERALES</h2>
          <div className="grid grid-cols-2 gap-x-6">
            <div>
              <div className="flex items-center text-sm mb-2">
                <span className="font-semibold text-gray-600 pr-2 w-auto">SUPERVISOR:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 flex-grow">
                  {diveLog.profiles?.username || 'N/A'}
                </div>
              </div>
              <div className="flex items-center text-sm mb-2">
                <span className="font-semibold text-gray-600 pr-2 w-auto">N° MATRICULA:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 flex-grow">
                  {diveLog.supervisor_license || 'N/A'}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm mb-2">
                <span className="font-semibold text-gray-600 pr-2 w-auto">JEFE DE CENTRO:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 flex-grow">
                  {diveLog.center_manager || 'N/A'}
                </div>
              </div>
              <div className="flex items-center text-sm mb-2">
                <span className="font-semibold text-gray-600 pr-2 w-auto">ASISTENTE DE CENTRO:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 flex-grow">
                  {diveLog.center_assistant || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-300">
            <h3 className="font-semibold mb-2 text-center">CONDICIÓN TIEMPO VARIABLES</h3>
            <div className="flex items-center space-x-6 mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-black flex items-center justify-center">
                  {diveLog.weather_good === true && <span className="text-xs font-bold">X</span>}
                </div>
                <span className="text-sm">SÍ</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-black flex items-center justify-center">
                  {diveLog.weather_good === false && <span className="text-xs font-bold">X</span>}
                </div>
                <span className="text-sm">NO</span>
              </div>
              <div className="flex items-center text-sm flex-grow">
                <span className="font-semibold text-gray-600 pr-2 w-auto">OBSERVACIONES:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 flex-grow">
                  {diveLog.weather_conditions || 'Buen tiempo'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-300">
            <h3 className="font-semibold mb-2 text-center">REGISTRO DE COMPRESORES</h3>
            <div className="flex items-center space-x-4 mb-2">
              <span className="font-semibold text-sm">COMPRESOR 1:</span>
              <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 w-32">
                {diveLog.compressor_1 || ''}
              </div>
              <span className="font-semibold text-sm ml-6">COMPRESOR 2:</span>
              <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 w-32">
                {diveLog.compressor_2 || ''}
              </div>
            </div>
            <div className="flex items-center text-sm mb-2">
              <span className="font-semibold text-gray-600 pr-2 w-auto">Nº SOLICITUD DE FAENA:</span>
              <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 flex-grow">
                {diveLog.work_order_number || 'N/A'}
              </div>
            </div>
            <div className="flex items-center text-sm mb-2">
              <span className="font-semibold text-gray-600 pr-2 w-auto">FECHA Y HORA DE INICIO:</span>
              <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 flex-grow">
                {diveLog.start_time || diveLog.departure_time || 'N/A'}
              </div>
            </div>
            <div className="flex items-center text-sm mb-2">
              <span className="font-semibold text-gray-600 pr-2 w-auto">FECHA Y HORA DE TÉRMINO:</span>
              <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 flex-grow">
                {diveLog.end_time || diveLog.arrival_time || 'N/A'}
              </div>
            </div>
          </div>
        </section>

        {/* Team de Buceo Section */}
        <section className="mb-6 p-3 border border-gray-400">
          <h2 className="font-bold text-base mb-3 text-center bg-gray-200 p-2 -m-3 mb-3">TEAM DE BUCEO</h2>
          <p className="text-center font-semibold mb-2">COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES</p>
          <div className="border border-gray-600 text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-600 p-2 text-center font-semibold">BUZO</th>
                  <th className="border border-gray-600 p-2 text-center font-semibold">IDENTIFICACIÓN</th>
                  <th className="border border-gray-600 p-2 text-center font-semibold">Nº MATRICULA</th>
                  <th className="border border-gray-600 p-2 text-center font-semibold">CARGO</th>
                  <th className="border border-gray-600 p-2 text-center font-semibold leading-tight">
                    BUCEO ESTANDAR<br/>PROFUNDIDAD<br/>20 MTS MAXIMO<br/>(SÍ / NO)
                  </th>
                  <th className="border border-gray-600 p-2 text-center font-semibold leading-tight">
                    PROFUNDIDAD<br/>DE TRABAJO<br/>REALIZADO<br/>(Metros)
                  </th>
                  <th className="border border-gray-600 p-2 text-center font-semibold leading-tight">INICIO DE<br/>BUCEO</th>
                  <th className="border border-gray-600 p-2 text-center font-semibold leading-tight">TÉRMINO<br/>DE BUCEO</th>
                  <th className="border border-gray-600 p-2 text-center font-semibold leading-tight">
                    TIEMPO<br/>DE BUCEO<br/>(min)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map(buzoNum => {
                  const diver = diversManifest[buzoNum - 1];
                  return (
                    <tr key={buzoNum}>
                      <td className="border border-gray-600 p-2 text-center">{buzoNum}</td>
                      <td className="border border-gray-600 p-2">
                        <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 w-full">
                          {diver?.name || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-2">
                        <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 w-full">
                          {diver?.license || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-2">
                        <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 w-full">
                          {diver?.role || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-2 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 border border-black flex items-center justify-center">
                              {diver?.standard_depth === true && <span className="text-xs font-bold">X</span>}
                            </div>
                            <span className="text-xs">SÍ</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 border border-black flex items-center justify-center">
                              {diver?.standard_depth === false && <span className="text-xs font-bold">X</span>}
                            </div>
                            <span className="text-xs">NO</span>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-600 p-2">
                        <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 w-full">
                          {diver?.working_depth || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-2">
                        <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 w-full">
                          {diver?.start_time || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-2">
                        <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 w-full">
                          {diver?.end_time || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-2">
                        <div className="border border-gray-400 px-2 py-1 text-gray-700 text-sm h-8 w-full">
                          {diver?.dive_time || ''}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-2 text-center">Nota: Capacidad máxima permitida de 20 metros.</p>
        </section>
      </div>
    );
  }
);

PrintableDiveLogPage1.displayName = 'PrintableDiveLogPage1';
