
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
      <div ref={ref} className="bg-white p-4 font-sans text-gray-800 text-xs" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Header pequeño para página 2 con mejor espaciado */}
        <header className="mb-4 pb-2 border-b border-gray-300">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
                alt="Aerocam Logo" 
                className="h-6 w-6 object-contain"
              />
              <span className="text-base font-bold text-blue-600">aerocam</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">BITÁCORA DE BUCEO - Página 2</p>
              <p className="text-xs">Nº: {diveLog.id?.slice(-6) || ''}</p>
            </div>
          </div>
        </header>

        {/* Detalle de Trabajo Section con mejor espaciado */}
        <section className="mb-4 border border-gray-400">
          <div className="bg-gray-200 p-1 border-b border-gray-400">
            <h2 className="font-bold text-sm text-center">DETALLE DE TRABAJO REALIZADO POR BUZO</h2>
          </div>
          <div className="p-2">
            {[1, 2, 3, 4].map(buzoNum => {
              const diver = diversManifest[buzoNum - 1];
              return (
                <div key={buzoNum} className="mb-3">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">
                      BUZO {buzoNum}:
                    </span>
                  </div>
                  <div className="border border-gray-400 px-2 py-2 text-gray-700 text-xs min-h-[3rem] w-full bg-gray-50">
                    {diver?.work_description || ''}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Observaciones Generales Section con mejor diseño */}
        <section className="mb-6 border border-gray-400">
          <div className="bg-gray-200 p-1 border-b border-gray-400">
            <h3 className="font-semibold text-sm text-center">OBSERVACIONES GENERALES</h3>
          </div>
          <div className="p-2">
            <div className="border border-gray-400 px-2 py-2 text-gray-700 text-xs min-h-[4rem] w-full bg-gray-50">
              {diveLog.observations || 'Faena realizada normal, buzos sin novedad.'}
            </div>
          </div>
        </section>

        {/* Firmas Section con diseño mejorado */}
        <section className="mt-8 border border-gray-400">
          <div className="bg-gray-200 p-1 border-b border-gray-400">
            <h3 className="font-semibold text-sm text-center">FIRMAS Y AUTORIZACIONES</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-2 border-gray-400 px-2 py-2 text-gray-700 text-xs h-16 w-full flex items-center justify-center mb-2 bg-gray-50">
                  <span className="text-gray-500 italic">(Firma)</span>
                </div>
                <div className="border-t-2 border-black pt-2 mt-2">
                  <p className="text-xs font-semibold">NOMBRE Y CARGO</p>
                  <p className="font-bold text-xs mt-1">FIRMA ENCARGADO DE CENTRO</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-2 border-gray-400 px-2 py-2 text-gray-700 text-xs h-16 w-full flex items-center justify-center mb-2 bg-gray-50">
                  {hasSignature && diveLog.signature_url ? (
                    <img src={diveLog.signature_url} alt="Firma" className="max-h-14 max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-500 italic">(Firma y Timbre)</span>
                  )}
                </div>
                <div className="border-t-2 border-black pt-2 mt-2">
                  <p className="text-xs font-semibold">NOMBRE Y CARGO</p>
                  <p className="font-bold text-xs mt-1">FIRMA Y TIMBRE SUPERVISOR DE BUCEO</p>
                  {hasSignature && (
                    <p className="text-xs text-green-600 font-bold mt-2 bg-green-100 px-2 py-1 rounded">
                      FIRMADO DIGITALMENTE - Código: DL-{diveLog.id?.slice(0, 8).toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer con mejor diseño */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-xs text-center text-gray-600 leading-relaxed italic">
              Queda prohibido cualquier tipo de explotación y, en particular, la reproducción, distribución, 
              comunicación pública y/o transformación, total o parcial, por cualquier medio, de este documento 
              sin el previo consentimiento expreso y por escrito de Aerocam SPA.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PrintableDiveLogPage2.displayName = 'PrintableDiveLogPage2';
