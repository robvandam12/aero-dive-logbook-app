
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { PrintableDiveLog } from "../PrintableDiveLog";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diveLog: DiveLogWithFullDetails | null;
  hasSignature: boolean;
  printableRef: React.RefObject<HTMLDivElement>;
}

export const PDFPreviewDialog = ({ 
  open, 
  onOpenChange, 
  diveLog, 
  hasSignature, 
  printableRef 
}: PDFPreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            Previsualización de Bitácora PDF
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto bg-white rounded max-h-[80vh] p-4">
          <div ref={printableRef} id="printable-dive-log">
            {diveLog && (
              <PrintableDiveLog 
                diveLog={diveLog} 
                hasSignature={hasSignature}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
