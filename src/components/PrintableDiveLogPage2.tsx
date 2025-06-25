
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
      <div ref={ref} className="bg-white p-8 font-sans text-gray-800 text-sm" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Header pequeño para página 2 */}
        <header className="mb-6 border-b border-gray-300 pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
                alt="Aerocam Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-bold text-blue-600">aerocam</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">BITÁCORA DE BUCEO - Página 2</p>
              <p className="text-xs">Nº: {diveLog.id?.slice(-6) || ''}</p>
            </div>
          </div>
        </header>

        {/* Detalle de Trabajo Section */}
        <section className="mb-6 p-3 border border-gray-400">
          <h2 className="font-bold text-base mb-3 text-center bg-gray-200 p-2 -m-3 mb-3">DETALLE DE TRABAJO REALIZADO POR BUZO</h2>
          {[1, 2, 3, 4].map(buzoNum => {
            const diver = diversManifest[buzoNum - 1];
            return (
              <div key={buzoNum} className="flex flex-col text-sm mb-4">
                <span className="font-semibold text-gray-600 mb-1">BUZO {buzoNum}:</span>
                <div className="border border-gray-400 px-2 py-2 text-gray-700 text-sm min-h-[4rem] w-full">
                  {diver?.work_description || ''}
                </div>
              </div>
            );
          })}
        </section>

        {/* Observaciones Generales Section */}
        <section className="mb-8 p-3 border border-gray-400">
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-gray-600 mb-2">OBSERVACIONES GENERALES:</span>
            <div className="border border-gray-400 px-2 py-2 text-gray-700 text-sm min-h-[5rem] w-full">
              {diveLog.observations || 'Faena realizada normal, buzos sin novedad.'}
            </div>
          </div>
        </section>

        {/* Firmas Section */}
        <section className="mt-8 pt-6 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-12">
            <div className="text-center">
              <div className="border border-gray-400 px-2 py-2 text-gray-700 text-sm h-20 w-full flex items-center justify-center mb-2">
                (Firma)
              </div>
              <p className="border-t border-black pt-2 text-sm">NOMBRE Y CARGO</p>
              <p className="font-semibold text-sm">FIRMA ENCARGADO DE CENTRO</p>
            </div>
            <div className="text-center">
              <div className="border border-gray-400 px-2 py-2 text-gray-700 text-sm h-20 w-full flex items-center justify-center mb-2">
                {hasSignature && diveLog.signature_url ? (
                  <img src={diveLog.signature_url} alt="Firma" className="max-h-16 max-w-full object-contain" />
                ) : (
                  '(Firma y Timbre)'
                )}
              </div>
              <p className="border-t border-black pt-2 text-sm">NOMBRE Y CARGO</p>
              <p className="font-semibold text-sm">FIRMA Y TIMBRE SUPERVISOR DE BUCEO</p>
              {hasSignature && (
                <p className="text-xs text-green-600 font-bold mt-2">
                  FIRMADO DIGITALMENTE - Código: DL-{diveLog.id?.slice(0, 8).toUpperCase()}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500 leading-relaxed">
              Queda prohibido cualquier tipo de explotación y, en particular, la reproducción, distribución, 
              comunicación pública y/o transformación, total o parcial, por cualquier medio, de este documento 
              sin el previo consentimiento expreso y por escrito de Aerocam SPA.
            </p>
          </div>
        </section>
      </div>
    );
  }
);

PrintableDiveLogPage2.displayName = 'PrintableDiveLogPage2';
