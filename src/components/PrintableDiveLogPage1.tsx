
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
      <div ref={ref} className="bg-white p-6 font-sans text-gray-800 text-xs" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Header Section */}
        <header className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
                  alt="Aerocam Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-2xl font-bold text-blue-600">aerocam</span>
              </div>
              <p className="text-xs mt-1 font-bold">SOCIEDAD DE SERVICIOS AEROCAM SPA</p>
              <p className="text-xs">Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</p>
              <p className="text-xs">(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</p>
            </div>
            <div className="text-right">
              <div className="flex justify-end items-center text-xs mb-1">
                <span className="font-semibold text-gray-600 pr-2">Fecha:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 w-28">
                  {diveLog.log_date || ''}
                </div>
              </div>
              <div className="flex justify-end items-center mt-1">
                <span className="font-semibold text-xs mr-2">Nº:</span>
                <div className="border border-gray-400 px-2 py-1 text-green-600 font-bold text-xs h-6 w-28">
                  {diveLog.id?.slice(-6) || ''}
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-lg font-bold text-center my-3">BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</h1>
          <div className="flex items-center text-xs mb-2">
            <span className="font-semibold text-gray-600 pr-2 font-bold">CENTRO DE CULTIVO:</span>
            <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 flex-grow">
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
                <span className="font-semibold text-gray-600 pr-2 w-auto">SUPERVISOR:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 flex-grow">
                  {diveLog.profiles?.username || 'N/A'}
                </div>
              </div>
              <div className="flex items-center text-xs mb-1">
                <span className="font-semibold text-gray-600 pr-2 w-auto">N° MATRICULA:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 flex-grow">
                  {diveLog.supervisor_license || 'N/A'}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center text-xs mb-1">
                <span className="font-semibold text-gray-600 pr-2 w-auto">JEFE DE CENTRO:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 flex-grow">
                  {diveLog.center_manager || 'N/A'}
                </div>
              </div>
              <div className="flex items-center text-xs mb-1">
                <span className="font-semibold text-gray-600 pr-2 w-auto">ASISTENTE DE CENTRO:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 flex-grow">
                  {diveLog.center_assistant || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-300">
            <h3 className="font-semibold mb-1 text-center text-xs">CONDICIÓN TIEMPO VARIABLES</h3>
            <div className="flex items-center space-x-4 mb-1">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-black flex items-center justify-center">
                  {diveLog.weather_good === true && <span className="text-xs font-bold">X</span>}
                </div>
                <span className="text-xs">SÍ</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-black flex items-center justify-center">
                  {diveLog.weather_good === false && <span className="text-xs font-bold">X</span>}
                </div>
                <span className="text-xs">NO</span>
              </div>
              <div className="flex items-center text-xs flex-grow">
                <span className="font-semibold text-gray-600 pr-2 w-auto">OBSERVACIONES:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 flex-grow">
                  {diveLog.weather_conditions || 'Buen tiempo'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-300">
            <h3 className="font-semibold mb-1 text-center text-xs">REGISTRO DE COMPRESORES</h3>
            <div className="flex items-center space-x-3 mb-1">
              <span className="font-semibold text-xs">COMPRESOR 1:</span>
              <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 w-24">
                {diveLog.compressor_1 || ''}
              </div>
              <span className="font-semibold text-xs ml-4">COMPRESOR 2:</span>
              <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 w-24">
                {diveLog.compressor_2 || ''}
              </div>
            </div>
            <div className="flex items-center text-xs mb-1">
              <span className="font-semibold text-gray-600 pr-2 w-auto">Nº SOLICITUD DE FAENA:</span>
              <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 flex-grow">
                {diveLog.work_order_number || 'N/A'}
              </div>
            </div>
            <div className="flex items-center text-xs mb-1">
              <span className="font-semibold text-gray-600 pr-2 w-auto">FECHA Y HORA DE INICIO:</span>
              <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 flex-grow">
                {diveLog.start_time || diveLog.departure_time || 'N/A'}
              </div>
            </div>
            <div className="flex items-center text-xs mb-1">
              <span className="font-semibold text-gray-600 pr-2 w-auto">FECHA Y HORA DE TÉRMINO:</span>
              <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-6 flex-grow">
                {diveLog.end_time || diveLog.arrival_time || 'N/A'}
              </div>
            </div>
          </div>
        </section>

        {/* Team de Buceo Section - Optimizada para A4 */}
        <section className="mb-4 p-2 border border-gray-400">
          <h2 className="font-bold text-sm mb-2 text-center bg-gray-200 p-1 -m-2 mb-2">TEAM DE BUCEO</h2>
          <p className="text-center font-semibold mb-2 text-xs">COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES</p>
          <div className="border border-gray-600 text-xs">
            <table className="w-full border-collapse" style={{ fontSize: '9px' }}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-600 p-1 text-center font-semibold" style={{ width: '5%' }}>BUZO</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold" style={{ width: '18%' }}>IDENTIFICACIÓN</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold" style={{ width: '12%' }}>Nº MATRICULA</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold" style={{ width: '10%' }}>CARGO</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold leading-tight" style={{ width: '15%' }}>
                    BUCEO ESTÁNDAR<br/>PROF. 20M MAX<br/>(SÍ/NO)
                  </th>
                  <th className="border border-gray-600 p-1 text-center font-semibold leading-tight" style={{ width: '12%' }}>
                    PROF.<br/>TRABAJO<br/>(m)
                  </th>
                  <th className="border border-gray-600 p-1 text-center font-semibold leading-tight" style={{ width: '10%' }}>INICIO</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold leading-tight" style={{ width: '10%' }}>TÉRMINO</th>
                  <th className="border border-gray-600 p-1 text-center font-semibold leading-tight" style={{ width: '8%' }}>
                    TIEMPO<br/>(min)
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
                        <div className="border border-gray-400 px-1 py-1 text-gray-700 h-5 w-full text-xs overflow-hidden">
                          {diver?.name || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-1 text-gray-700 h-5 w-full text-xs overflow-hidden">
                          {diver?.license || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-1 text-gray-700 h-5 w-full text-xs overflow-hidden">
                          {diver?.role || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 border border-black flex items-center justify-center">
                              {diver?.standard_depth === true && <span className="text-xs font-bold">X</span>}
                            </div>
                            <span className="text-xs">S</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 border border-black flex items-center justify-center">
                              {diver?.standard_depth === false && <span className="text-xs font-bold">X</span>}
                            </div>
                            <span className="text-xs">N</span>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-1 text-gray-700 h-5 w-full text-xs text-center overflow-hidden">
                          {diver?.working_depth || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-1 text-gray-700 h-5 w-full text-xs text-center overflow-hidden">
                          {diver?.start_time || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-1 text-gray-700 h-5 w-full text-xs text-center overflow-hidden">
                          {diver?.end_time || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-1">
                        <div className="border border-gray-400 px-1 py-1 text-gray-700 h-5 w-full text-xs text-center overflow-hidden">
                          {diver?.dive_time || ''}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-1 text-center">Nota: Capacidad máxima permitida de 20 metros.</p>
        </section>
      </div>
    );
  }
);

PrintableDiveLogPage1.displayName = 'PrintableDiveLogPage1';
