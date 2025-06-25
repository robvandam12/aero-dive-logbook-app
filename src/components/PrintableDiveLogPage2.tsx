
import React from 'react';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';

interface PrintableDiveLogPage2Props {
  diveLog: DiveLogWithFullDetails;
  hasSignature: boolean;
}

export const PrintableDiveLogPage2 = React.forwardRef<HTMLDivElement, PrintableDiveLogPage2Props>(
  ({ diveLog, hasSignature }, ref) => {
    const diversManifest = Array.isArray(diveLog.divers_manifest) 
      ? diveLog.divers_manifest as any[]
      : [];

    return (
      <div ref={ref} className="bg-white p-6 font-sans text-gray-800" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Header pequeño para página 2 */}
        <header className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
                alt="Aerocam Logo" 
                className="h-8 w-8 object-contain"
              />
              <div>
                <span className="text-lg font-bold text-blue-600">aerocam</span>
                <p className="text-xs text-gray-600">Bitácora de Buceo - Página 2</p>
              </div>
            </div>
            <div className="text-right bg-gray-100 p-2 rounded">
              <p className="text-xs text-gray-600">Nº</p>
              <p className="font-bold text-blue-600">{diveLog.id?.slice(-6) || ''}</p>
            </div>
          </div>
        </header>

        {/* Detalle de Trabajo Section */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
            DETALLE DE TRABAJO REALIZADO POR BUZO
          </h2>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map(buzoNum => {
              const diver = diversManifest[buzoNum - 1];
              return (
                <div key={buzoNum} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      BUZO {buzoNum}
                    </div>
                    {diver?.name && (
                      <span className="ml-3 text-sm text-gray-600">
                        {diver.name}
                      </span>
                    )}
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-blue-200 min-h-[60px]">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {diver?.work_description || ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Observaciones Generales Section */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
            OBSERVACIONES GENERALES
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-white p-4 rounded border-l-4 border-green-200 min-h-[80px]">
              <p className="text-sm text-gray-800 leading-relaxed">
                {diveLog.observations || 'Faena realizada normal, buzos sin novedad.'}
              </p>
            </div>
          </div>
        </section>

        {/* Firmas Section */}
        <section className="mt-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
            FIRMAS Y AUTORIZACIONES
          </h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 rounded-lg mb-4 h-24 flex items-center justify-center">
                <span className="text-gray-500 italic text-sm">Área de Firma</span>
              </div>
              <div className="space-y-2">
                <div className="border-t-2 border-gray-800 pt-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nombre y Cargo</p>
                  <p className="font-bold text-sm text-gray-800 mt-1">ENCARGADO DE CENTRO</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 rounded-lg mb-4 h-24 flex items-center justify-center">
                {hasSignature && diveLog.signature_url ? (
                  <img src={diveLog.signature_url} alt="Firma Digital" className="max-h-20 max-w-full object-contain" />
                ) : (
                  <span className="text-gray-500 italic text-sm">Área de Firma y Timbre</span>
                )}
              </div>
              <div className="space-y-2">
                <div className="border-t-2 border-gray-800 pt-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nombre y Cargo</p>
                  <p className="font-bold text-sm text-gray-800 mt-1">SUPERVISOR DE BUCEO</p>
                  {hasSignature && (
                    <div className="mt-3 bg-green-100 border border-green-300 p-2 rounded">
                      <p className="text-xs text-green-700 font-semibold">
                        ✓ FIRMADO DIGITALMENTE
                      </p>
                      <p className="text-xs text-green-600 font-mono">
                        Código: DL-{diveLog.id?.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-xs text-center text-gray-600 leading-relaxed italic">
              Este documento contiene información confidencial de Aerocam SPA. 
              Queda prohibida su reproducción, distribución o transformación sin autorización expresa.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PrintableDiveLogPage2.displayName = 'PrintableDiveLogPage2';
