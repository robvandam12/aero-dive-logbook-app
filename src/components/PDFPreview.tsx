
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, Eye } from "lucide-react";
import { usePDFExport } from "@/hooks/usePDFExport";

interface PDFPreviewProps {
  diveLogId: string;
  hasSignature: boolean;
}

export const PDFPreview = ({ diveLogId, hasSignature }: PDFPreviewProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const { exportToPDF } = usePDFExport();

  const handlePreview = async () => {
    try {
      const response = await fetch(`https://ujtuzthydhfckpxommcv.supabase.co/functions/v1/export-dive-log-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diveLogId }),
      });

      if (!response.ok) {
        throw new Error('Error generando preview');
      }

      const data = await response.json();
      if (data.success && data.html) {
        setPreviewContent(data.html);
        setPreviewOpen(true);
      }
    } catch (error) {
      console.error('Error previewing PDF:', error);
    }
  };

  const handleDownload = () => {
    exportToPDF.mutate({
      diveLogId,
      includeSignature: hasSignature,
    });
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePreview}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Eye className="w-4 h-4 mr-2" />
        Preview PDF
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownload}
        disabled={exportToPDF.isPending}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Download className="w-4 h-4 mr-2" />
        Descargar PDF
      </Button>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Preview de Bitácora PDF</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto bg-white rounded">
            <div 
              className="w-full h-full p-4"
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
