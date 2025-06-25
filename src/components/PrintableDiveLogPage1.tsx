
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
      <div ref={ref} className="bg-white p-6 font-sans text-gray-800" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Header Section */}
        <header className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <img 
                  src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
                  alt="Aerocam Logo" 
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <span className="text-2xl font-bold text-blue-600">aerocam</span>
                  <p className="text-xs text-gray-600 mt-1">SOCIEDAD DE SERVICIOS AEROCAM SPA</p>
                </div>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</p>
                <p>(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Fecha</p>
                <p className="font-semibold">{diveLog.log_date || ''}</p>
                <p className="text-xs text-gray-600 mt-2 mb-1">Nº</p>
                <p className="font-bold text-blue-600">{diveLog.id?.slice(-6) || ''}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 inline-block">
              BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO
            </h1>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-semibold text-blue-800">
              Centro de Cultivo: <span className="font-normal text-gray-800">{diveLog.centers?.name || 'N/A'}</span>
            </p>
          </div>
        </header>

        {/* Datos Generales Section */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">DATOS GENERALES</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Supervisor</label>
                <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">{diveLog.profiles?.username || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">N° Matrícula</label>
                <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">{diveLog.supervisor_license || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Jefe de Centro</label>
                <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">{diveLog.center_manager || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Asistente de Centro</label>
                <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">{diveLog.center_assistant || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Weather and Conditions */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">CONDICIÓN TIEMPO VARIABLES</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${diveLog.weather_good === true ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                    {diveLog.weather_good === true && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm">Favorable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${diveLog.weather_good === false ? 'bg-red-500 border-red-500' : 'border-gray-400'}`}>
                    {diveLog.weather_good === false && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm">Desfavorable</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Observaciones</label>
                <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">{diveLog.weather_conditions || 'Buen tiempo'}</p>
              </div>
            </div>
          </div>

          {/* Compressors and Work Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Compresor 1</label>
                <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">{diveLog.compressor_1 || ''}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Hora de Inicio</label>
                <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">{diveLog.start_time || diveLog.departure_time || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Compresor 2</label>
                <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">{diveLog.compressor_2 || ''}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Hora de Término</label>
                <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">{diveLog.end_time || diveLog.arrival_time || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">N° Solicitud de Faena</label>
            <p className="text-sm text-gray-800 border-b border-gray-300 pb-1">{diveLog.work_order_number || 'N/A'}</p>
          </div>
        </section>

        {/* Team de Buceo Section */}
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">TEAM DE BUCEO</h2>
          <p className="text-sm text-gray-600 mb-4">Composición de Equipo Buzos y Asistentes</p>
          
          <div className="overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-2 text-left font-semibold" style={{ width: '5%' }}>#</th>
                  <th className="p-2 text-left font-semibold" style={{ width: '25%' }}>Identificación</th>
                  <th className="p-2 text-left font-semibold" style={{ width: '12%' }}>N° Matrícula</th>
                  <th className="p-2 text-left font-semibold" style={{ width: '12%' }}>Cargo</th>
                  <th className="p-2 text-center font-semibold" style={{ width: '12%' }}>Estándar (≤20m)</th>
                  <th className="p-2 text-center font-semibold" style={{ width: '8%' }}>Prof. (m)</th>
                  <th className="p-2 text-center font-semibold" style={{ width: '8%' }}>Inicio</th>
                  <th className="p-2 text-center font-semibold" style={{ width: '8%' }}>Término</th>
                  <th className="p-2 text-center font-semibold" style={{ width: '10%' }}>Tiempo (min)</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map(buzoNum => {
                  const diver = diversManifest[buzoNum - 1];
                  const isEven = buzoNum % 2 === 0;
                  return (
                    <tr key={buzoNum} className={`${isEven ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                      <td className="p-2 text-center font-semibold text-blue-600">{buzoNum}</td>
                      <td className="p-2 text-xs">{diver?.name || ''}</td>
                      <td className="p-2 text-xs">{diver?.license || ''}</td>
                      <td className="p-2 text-xs">{diver?.role || ''}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <div className={`w-3 h-3 rounded border flex items-center justify-center ${diver?.standard_depth === true ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                              {diver?.standard_depth === true && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className="text-xs">Sí</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className={`w-3 h-3 rounded border flex items-center justify-center ${diver?.standard_depth === false ? 'bg-red-500 border-red-500' : 'border-gray-400'}`}>
                              {diver?.standard_depth === false && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className="text-xs">No</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center text-xs">{diver?.working_depth || ''}</td>
                      <td className="p-2 text-center text-xs">{diver?.start_time || ''}</td>
                      <td className="p-2 text-center text-xs">{diver?.end_time || ''}</td>
                      <td className="p-2 text-center text-xs">{diver?.dive_time || ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-2 italic">* Capacidad máxima permitida: 20 metros de profundidad</p>
        </section>
      </div>
    );
  }
);

PrintableDiveLogPage1.displayName = 'PrintableDiveLogPage1';
