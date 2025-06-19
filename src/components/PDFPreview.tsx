
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download } from "lucide-react";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { PrintableDiveLog } from "./PrintableDiveLog";
import { useReactToPrint } from "react-to-print";

interface PDFPreviewProps {
  diveLogId: string;
  hasSignature: boolean;
  diveLog?: DiveLogWithFullDetails;
}

export const PDFPreview = ({ diveLogId, hasSignature, diveLog }: PDFPreviewProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handlePrint = useReactToPrint({
    contentRef: printableRef,
    documentTitle: `Bitacora_Buceo_${diveLog?.id?.slice(-6) || 'Aerocam'}`,
    pageStyle: `
      @page { 
        size: letter portrait; 
        margin: 20mm; 
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact;
        }
        .printable-page { 
          width: 190mm; 
          break-inside: avoid; 
          page-break-inside: avoid;
        }
        .no-print { 
          display: none !important; 
        }
      }
    `,
  });

  if (!diveLog) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePreview}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Eye className="w-4 h-4 mr-2" />
        Previsualizar PDF
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handlePrint}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Download className="w-4 h-4 mr-2" />
        Descargar PDF
      </Button>

      {/* Hidden printable component */}
      <div style={{ display: 'none' }}>
        <PrintableDiveLog 
          ref={printableRef}
          diveLog={diveLog}
          hasSignature={hasSignature}
        />
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Previsualización de Bitácora PDF</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto bg-white rounded max-h-[80vh] p-4">
            <PrintableDiveLog 
              diveLog={diveLog}
              hasSignature={hasSignature}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
