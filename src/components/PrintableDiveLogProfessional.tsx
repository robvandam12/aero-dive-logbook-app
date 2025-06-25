
import React from 'react';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';

interface PrintableDiveLogProfessionalProps {
  diveLog: DiveLogWithFullDetails;
  hasSignature: boolean;
  isTemporary?: boolean;
}

export const PrintableDiveLogProfessional = React.forwardRef<HTMLDivElement, PrintableDiveLogProfessionalProps>(
  ({ diveLog, hasSignature, isTemporary = false }, ref) => {
    const diversManifest = Array.isArray(diveLog.divers_manifest) 
      ? diveLog.divers_manifest as any[]
      : [];

    const containerClass = isTemporary 
      ? "printable-page-professional-temp bg-white font-sans text-gray-800 text-xs min-h-[11in] w-[8.5in] mx-auto relative overflow-hidden"
      : "printable-page-professional bg-white font-sans text-gray-800 text-xs min-h-[11in] w-[8.5in] mx-auto relative overflow-hidden";

    return (
      <div ref={ref} className={containerClass}>
        <style>{`
          @media print {
            @page {
              size: letter;
              margin: 0.5in;
            }
            .printable-page-professional, .printable-page-professional-temp {
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
          
          .printable-page-professional, .printable-page-professional-temp {
            font-family: 'Arial', 'Helvetica', sans-serif !important;
            line-height: 1.3 !important;
            color: #1a1a1a !important;
            background: white !important;
            position: relative !important;
            visibility: visible !important;
            opacity: 1 !important;
            padding: 32px !important;
            box-sizing: border-box !important;
          }
          
          .printable-page-professional *, .printable-page-professional-temp * {
            box-sizing: border-box !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          .professional-header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            margin: -32px -32px 24px -32px;
            padding: 24px 32px;
            color: white;
            position: relative;
            overflow: hidden;
          }
          
          .professional-header::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            height: 100%;
            background: url('/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png') no-repeat center;
            background-size: contain;
            opacity: 0.1;
            transform: translateX(50px);
          }
          
          .professional-section {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
          }
          
          .professional-section-header {
            background: linear-gradient(135deg, #334155 0%, #475569 100%);
            color: white;
            padding: 12px 20px;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .professional-section-content {
            padding: 20px;
            background: white;
          }
          
          .professional-table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 6px;
            overflow: hidden;
          }
          
          .professional-table th {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
            font-size: 10px;
            border: none;
          }
          
          .professional-table td {
            padding: 10px 8px;
            border: 1px solid #e2e8f0;
            text-align: center;
            background: white;
          }
          
          .professional-table tbody tr:nth-child(even) {
            background: #f8fafc;
          }
          
          .professional-table tbody tr:hover {
            background: #f1f5f9;
          }
          
          .professional-input {
            border: 2px solid #cbd5e1;
            border-radius: 4px;
            padding: 8px 12px;
            background: white;
            font-size: 11px;
            color: #1a1a1a;
            min-height: 32px;
            display: flex;
            align-items: center;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
          }
          
          .professional-checkbox {
            width: 16px;
            height: 16px;
            border: 2px solid #3b82f6;
            border-radius: 2px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: white;
            margin-right: 6px;
          }
          
          .professional-checkbox.checked {
            background: #3b82f6;
            color: white;
          }
          
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 48px;
            color: rgba(59, 130, 246, 0.05);
            font-weight: bold;
            z-index: 0;
            pointer-events: none;
          }
          
          .content-wrapper {
            position: relative;
            z-index: 1;
          }
        `}</style>

        {/* Watermark */}
        <div className="watermark">AEROCAM SPA</div>

        <div className="content-wrapper">
          {/* Professional Header */}
          <header className="professional-header">
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center space-x-4">
                <img 
                  src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
                  alt="Aerocam Logo" 
                  className="h-16 w-16 object-contain bg-white/20 rounded-lg p-2"
                />
                <div>
                  <h1 className="text-3xl font-bold mb-1">aerocam</h1>
                  <p className="text-sm opacity-90 font-semibold">SOCIEDAD DE SERVICIOS AEROCAM SPA</p>
                  <p className="text-xs opacity-80 mt-1">Servicios Profesionales de Buceo Industrial</p>
                </div>
              </div>
              <div className="text-right text-white">
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-sm font-semibold mb-2">DOCUMENTO Nº</div>
                  <div className="text-2xl font-bold text-yellow-300">
                    {diveLog.id?.slice(-6) || 'N/A'}
                  </div>
                  <div className="text-xs mt-2">
                    Fecha: {diveLog.log_date || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold uppercase tracking-wide">
                Bitácora de Buceo e Informe de Trabajo Realizado
              </h2>
            </div>
          </header>

          {/* Company Info */}
          <div className="text-center mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-600">
              Ignacio Carrera Pinto Nº 200, Quellón – Chiloé • (65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl
            </p>
          </div>

          {/* Centro de Cultivo */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <span className="font-bold text-slate-700 text-sm">CENTRO DE CULTIVO:</span>
              <div className="professional-input flex-grow font-semibold text-blue-700">
                {diveLog.centers?.name || 'N/A'}
              </div>
            </div>
          </div>

          {/* Datos Generales Section */}
          <section className="professional-section">
            <div className="professional-section-header">
              📋 Datos Generales del Servicio
            </div>
            <div className="professional-section-content">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2 text-xs">SUPERVISOR RESPONSABLE</label>
                    <div className="professional-input font-medium">
                      {diveLog.profiles?.username || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2 text-xs">Nº MATRÍCULA SUPERVISOR</label>
                    <div className="professional-input">
                      {diveLog.supervisor_license || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2 text-xs">JEFE DE CENTRO</label>
                    <div className="professional-input">
                      {diveLog.center_manager || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2 text-xs">ASISTENTE DE CENTRO</label>
                    <div className="professional-input">
                      {diveLog.center_assistant || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2 text-xs">Nº SOLICITUD DE FAENA</label>
                    <div className="professional-input">
                      {diveLog.work_order_number || 'N/A'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-2 text-xs">COMPRESOR 1</label>
                      <div className="professional-input">
                        {diveLog.compressor_1 || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-2 text-xs">COMPRESOR 2</label>
                      <div className="professional-input">
                        {diveLog.compressor_2 || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <h3 className="font-semibold mb-4 text-center text-slate-700">CONDICIONES METEOROLÓGICAS</h3>
                <div className="flex items-center justify-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className={`professional-checkbox ${diveLog.weather_good === true ? 'checked' : ''}`}>
                      {diveLog.weather_good === true && <span className="text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-sm font-medium">CONDICIONES FAVORABLES</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`professional-checkbox ${diveLog.weather_good === false ? 'checked' : ''}`}>
                      {diveLog.weather_good === false && <span className="text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-sm font-medium">CONDICIONES ADVERSAS</span>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block font-semibold text-slate-700 mb-2 text-xs">OBSERVACIONES METEOROLÓGICAS</label>
                  <div className="professional-input">
                    {diveLog.weather_conditions || 'Condiciones normales de trabajo'}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2 text-xs">HORA DE INICIO</label>
                    <div className="professional-input">
                      {diveLog.start_time || diveLog.departure_time || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2 text-xs">HORA DE TÉRMINO</label>
                    <div className="professional-input">
                      {diveLog.end_time || diveLog.arrival_time || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Team de Buceo Section */}
          <section className="professional-section">
            <div className="professional-section-header">
              🤿 Equipo de Buceo Profesional
            </div>
            <div className="professional-section-content">
              <p className="text-center font-semibold mb-4 text-slate-700">REGISTRO DE BUZOS Y PERSONAL DE APOYO</p>
              <table className="professional-table">
                <thead>
                  <tr>
                    <th className="w-12">BUZO</th>
                    <th className="w-32">IDENTIFICACIÓN</th>
                    <th className="w-24">Nº MATRÍCULA</th>
                    <th className="w-20">CARGO</th>
                    <th className="w-20">BUCEO ESTÁNDAR<br/>(≤20m)</th>
                    <th className="w-16">PROF. TRABAJO<br/>(metros)</th>
                    <th className="w-16">INICIO</th>
                    <th className="w-16">TÉRMINO</th>
                    <th className="w-16">TIEMPO<br/>(min)</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map(buzoNum => {
                    const diver = diversManifest[buzoNum - 1];
                    return (
                      <tr key={buzoNum}>
                        <td className="font-bold text-blue-600">{buzoNum}</td>
                        <td>
                          <div className="professional-input text-left">
                            {diver?.name || ''}
                          </div>
                        </td>
                        <td>
                          <div className="professional-input">
                            {diver?.license || ''}
                          </div>
                        </td>
                        <td>
                          <div className="professional-input">
                            {diver?.role || ''}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center justify-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <div className={`professional-checkbox ${diver?.standard_depth === true ? 'checked' : ''}`}>
                                {diver?.standard_depth === true && <span className="text-xs font-bold">✓</span>}
                              </div>
                              <span className="text-xs">SÍ</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className={`professional-checkbox ${diver?.standard_depth === false ? 'checked' : ''}`}>
                                {diver?.standard_depth === false && <span className="text-xs font-bold">✓</span>}
                              </div>
                              <span className="text-xs">NO</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="professional-input">
                            {diver?.working_depth || ''}
                          </div>
                        </td>
                        <td>
                          <div className="professional-input">
                            {diver?.start_time || ''}
                          </div>
                        </td>
                        <td>
                          <div className="professional-input">
                            {diver?.end_time || ''}
                          </div>
                        </td>
                        <td>
                          <div className="professional-input">
                            {diver?.dive_time || ''}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-xs mt-3 text-center text-amber-700 font-medium bg-amber-50 p-2 rounded">
                ⚠️ NOTA IMPORTANTE: Profundidad máxima permitida 20 metros según normativa vigente
              </p>
            </div>
          </section>

          {/* Detalle de Trabajo Section */}
          <section className="professional-section">
            <div className="professional-section-header">
              🔧 Detalle de Trabajos Realizados
            </div>
            <div className="professional-section-content">
              <div className="space-y-4">
                {[1, 2, 3, 4].map(buzoNum => {
                  const diver = diversManifest[buzoNum - 1];
                  return (
                    <div key={buzoNum} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <label className="block font-semibold text-slate-700 mb-2 text-sm">
                        BUZO {buzoNum} - DESCRIPCIÓN DE ACTIVIDADES:
                      </label>
                      <div className="professional-input min-h-[60px] items-start">
                        {diver?.work_description || 'Sin actividades registradas'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Observaciones Generales Section */}
          <section className="professional-section">
            <div className="professional-section-header">
              📝 Observaciones y Comentarios Generales
            </div>
            <div className="professional-section-content">
              <div className="professional-input min-h-[80px] items-start">
                {diveLog.observations || 'Faena ejecutada conforme a protocolo. Personal sin novedad. Equipamiento en óptimas condiciones.'}
              </div>
            </div>
          </section>

          {/* Firmas Section */}
          <section className="mt-8">
            <div className="grid grid-cols-2 gap-12">
              <div className="text-center">
                <div className="professional-input h-20 justify-center items-center text-slate-500 bg-slate-50">
                  (Firma y Sello)
                </div>
                <div className="mt-3 pt-2 border-t-2 border-slate-400">
                  <p className="font-semibold text-sm text-slate-700">ENCARGADO DE CENTRO</p>
                  <p className="text-xs text-slate-500 mt-1">Nombre y Cargo</p>
                </div>
              </div>
              <div className="text-center">
                <div className="professional-input h-20 justify-center items-center bg-blue-50 border-blue-200">
                  {hasSignature && diveLog.signature_url ? (
                    <img src={diveLog.signature_url} alt="Firma Digital" className="max-h-16 max-w-full object-contain" />
                  ) : (
                    <span className="text-blue-600 font-medium">(Firma Digital y Timbre)</span>
                  )}
                </div>
                <div className="mt-3 pt-2 border-t-2 border-blue-400">
                  <p className="font-semibold text-sm text-blue-700">SUPERVISOR DE BUCEO</p>
                  <p className="text-xs text-blue-500 mt-1">Firma Digital y Timbre Profesional</p>
                  {hasSignature && (
                    <div className="mt-2 bg-green-100 border border-green-300 rounded px-2 py-1">
                      <p className="text-xs text-green-700 font-bold">
                        ✅ DOCUMENTO FIRMADO DIGITALMENTE
                      </p>
                      <p className="text-xs text-green-600">
                        Código: DL-{diveLog.id?.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-slate-300 text-center">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>AEROCAM SPA</strong> - Servicios Profesionales de Buceo Industrial<br/>
                Este documento es de carácter confidencial y su reproducción, distribución o comunicación pública<br/>
                requiere autorización expresa y por escrito de Aerocam SPA.
              </p>
              <div className="flex justify-center items-center mt-3 space-x-4 text-xs text-slate-500">
                <span>📞 (65) 2 353 322</span>
                <span>✉️ contacto@aerocamchile.cl</span>
                <span>🌐 www.aerocamchile.cl</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
);

PrintableDiveLogProfessional.displayName = 'PrintableDiveLogProfessional';
