
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
      <div ref={ref} className="bg-white p-4 font-sans text-gray-800 text-xs" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Header Section with better spacing */}
        <header className="mb-3 pb-2 border-b border-gray-300">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <img 
                  src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
                  alt="Aerocam Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-bold text-blue-600">aerocam</span>
              </div>
              <p className="text-xs font-bold leading-tight">SOCIEDAD DE SERVICIOS AEROCAM SPA</p>
              <p className="text-xs leading-tight">Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</p>
              <p className="text-xs leading-tight">(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</p>
            </div>
            <div className="text-right">
              <div className="flex justify-end items-center mb-1">
                <span className="font-semibold text-gray-600 pr-2 text-xs">Fecha:</span>
                <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-5 w-24 flex items-center">
                  {diveLog.log_date || ''}
                </div>
              </div>
              <div className="flex justify-end items-center">
                <span className="font-semibold text-xs pr-2">Nº:</span>
                <div className="border border-gray-400 px-2 py-1 text-green-600 font-bold text-xs h-5 w-24 flex items-center">
                  {diveLog.id?.slice(-6) || ''}
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-base font-bold text-center my-2">BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</h1>
          
          <div className="flex items-center">
            <span className="font-bold text-gray-600 pr-2 text-xs whitespace-nowrap">CENTRO DE CULTIVO:</span>
            <div className="border border-gray-400 px-2 py-1 text-gray-700 text-xs h-5 flex-grow flex items-center">
              {diveLog.centers?.name || 'N/A'}
            </div>
          </div>
        </header>

        {/* Datos Generales Section with improved layout */}
        <section className="mb-3 border border-gray-400">
          <div className="bg-gray-200 p-1 border-b border-gray-400">
            <h2 className="font-bold text-xs text-center">DATOS GENERALES</h2>
          </div>
          <div className="p-2">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 pr-2 text-xs w-20 shrink-0">SUPERVISOR:</span>
                  <div className="border border-gray-400 px-1 py-1 text-gray-700 text-xs h-5 flex-grow flex items-center">
                    {diveLog.profiles?.username || 'N/A'}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 pr-2 text-xs w-20 shrink-0">N° MATRICULA:</span>
                  <div className="border border-gray-400 px-1 py-1 text-gray-700 text-xs h-5 flex-grow flex items-center">
                    {diveLog.supervisor_license || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 pr-2 text-xs w-24 shrink-0">JEFE DE CENTRO:</span>
                  <div className="border border-gray-400 px-1 py-1 text-gray-700 text-xs h-5 flex-grow flex items-center">
                    {diveLog.center_manager || 'N/A'}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 pr-2 text-xs w-24 shrink-0">ASISTENTE DE CENTRO:</span>
                  <div className="border border-gray-400 px-1 py-1 text-gray-700 text-xs h-5 flex-grow flex items-center">
                    {diveLog.center_assistant || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Weather conditions with proper spacing */}
            <div className="border-t border-gray-300 pt-2 mb-2">
              <h3 className="font-semibold text-xs text-center mb-1">CONDICIÓN TIEMPO VARIABLES</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border border-black flex items-center justify-center">
                      {diveLog.weather_good === true && <span className="text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-xs">SÍ</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border border-black flex items-center justify-center">
                      {diveLog.weather_good === false && <span className="text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-xs">NO</span>
                  </div>
                </div>
                <div className="flex items-center flex-grow">
                  <span className="font-semibold text-gray-600 pr-2 text-xs whitespace-nowrap">OBSERVACIONES:</span>
                  <div className="border border-gray-400 px-1 py-1 text-gray-700 text-xs h-5 flex-grow flex items-center">
                    {diveLog.weather_conditions || 'Buen tiempo'}
                  </div>
                </div>
              </div>
            </div>

            {/* Compressors section with better alignment */}
            <div className="border-t border-gray-300 pt-2">
              <h3 className="font-semibold text-xs text-center mb-1">REGISTRO DE COMPRESORES</h3>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-xs whitespace-nowrap">COMPRESOR 1:</span>
                  <div className="border border-gray-400 px-1 py-1 text-gray-700 text-xs h-5 w-20 flex items-center">
                    {diveLog.compressor_1 || ''}
                  </div>
                  <span className="font-semibold text-xs whitespace-nowrap ml-3">COMPRESOR 2:</span>
                  <div className="border border-gray-400 px-1 py-1 text-gray-700 text-xs h-5 w-20 flex items-center">
                    {diveLog.compressor_2 || ''}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 pr-2 text-xs whitespace-nowrap">Nº SOLICITUD DE FAENA:</span>
                  <div className="border border-gray-400 px-1 py-1 text-gray-700 text-xs h-5 flex-grow flex items-center">
                    {diveLog.work_order_number || 'N/A'}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 pr-2 text-xs whitespace-nowrap">FECHA Y HORA DE INICIO:</span>
                  <div className="border border-gray-400 px-1 py-1 text-gray-700 text-xs h-5 flex-grow flex items-center">
                    {diveLog.start_time || diveLog.departure_time || 'N/A'}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 pr-2 text-xs whitespace-nowrap">FECHA Y HORA DE TÉRMINO:</span>
                  <div className="border border-gray-400 px-1 py-1 text-gray-700 text-xs h-5 flex-grow flex items-center">
                    {diveLog.end_time || diveLog.arrival_time || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team de Buceo Section - Optimized table */}
        <section className="border border-gray-400">
          <div className="bg-gray-200 p-1 border-b border-gray-400">
            <h2 className="font-bold text-xs text-center">TEAM DE BUCEO</h2>
            <p className="text-center font-semibold text-xs">COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES</p>
          </div>
          <div className="overflow-hidden">
            <table className="w-full border-collapse text-xs" style={{ fontSize: '8px' }}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-600 p-0.5 text-center font-semibold" style={{ width: '6%' }}>BUZO</th>
                  <th className="border border-gray-600 p-0.5 text-center font-semibold leading-tight" style={{ width: '20%' }}>IDENTIFICACIÓN</th>
                  <th className="border border-gray-600 p-0.5 text-center font-semibold leading-tight" style={{ width: '12%' }}>Nº MATRICULA</th>
                  <th className="border border-gray-600 p-0.5 text-center font-semibold" style={{ width: '10%' }}>CARGO</th>
                  <th className="border border-gray-600 p-0.5 text-center font-semibold leading-tight" style={{ width: '14%' }}>
                    BUCEO ESTÁNDAR<br/>PROF. 20M MAX<br/>(SÍ/NO)
                  </th>
                  <th className="border border-gray-600 p-0.5 text-center font-semibold leading-tight" style={{ width: '10%' }}>
                    PROF.<br/>TRABAJO<br/>(m)
                  </th>
                  <th className="border border-gray-600 p-0.5 text-center font-semibold" style={{ width: '9%' }}>INICIO</th>
                  <th className="border border-gray-600 p-0.5 text-center font-semibold" style={{ width: '9%' }}>TÉRMINO</th>
                  <th className="border border-gray-600 p-0.5 text-center font-semibold leading-tight" style={{ width: '10%' }}>
                    TIEMPO<br/>(min)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map(buzoNum => {
                  const diver = diversManifest[buzoNum - 1];
                  return (
                    <tr key={buzoNum} style={{ height: '18px' }}>
                      <td className="border border-gray-600 p-0.5 text-center">{buzoNum}</td>
                      <td className="border border-gray-600 p-0.5">
                        <div className="border border-gray-400 px-1 text-gray-700 h-4 w-full flex items-center text-xs overflow-hidden">
                          {diver?.name || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-0.5">
                        <div className="border border-gray-400 px-1 text-gray-700 h-4 w-full flex items-center text-xs overflow-hidden">
                          {diver?.license || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-0.5">
                        <div className="border border-gray-400 px-1 text-gray-700 h-4 w-full flex items-center text-xs overflow-hidden">
                          {diver?.role || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-0.5 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <div className="flex items-center space-x-0.5">
                            <div className="w-2.5 h-2.5 border border-black flex items-center justify-center">
                              {diver?.standard_depth === true && <span className="text-xs font-bold">✓</span>}
                            </div>
                            <span style={{ fontSize: '7px' }}>S</span>
                          </div>
                          <div className="flex items-center space-x-0.5">
                            <div className="w-2.5 h-2.5 border border-black flex items-center justify-center">
                              {diver?.standard_depth === false && <span className="text-xs font-bold">✓</span>}
                            </div>
                            <span style={{ fontSize: '7px' }}>N</span>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-600 p-0.5">
                        <div className="border border-gray-400 px-1 text-gray-700 h-4 w-full flex items-center text-center text-xs overflow-hidden">
                          {diver?.working_depth || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-0.5">
                        <div className="border border-gray-400 px-1 text-gray-700 h-4 w-full flex items-center text-center text-xs overflow-hidden">
                          {diver?.start_time || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-0.5">
                        <div className="border border-gray-400 px-1 text-gray-700 h-4 w-full flex items-center text-center text-xs overflow-hidden">
                          {diver?.end_time || ''}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-0.5">
                        <div className="border border-gray-400 px-1 text-gray-700 h-4 w-full flex items-center text-center text-xs overflow-hidden">
                          {diver?.dive_time || ''}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-1 text-center">
            <p className="text-xs">Nota: Capacidad máxima permitida de 20 metros.</p>
          </div>
        </section>
      </div>
    );
  }
);

PrintableDiveLogPage1.displayName = 'PrintableDiveLogPage1';
