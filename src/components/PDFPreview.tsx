
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download } from "lucide-react";
import { usePDFExport } from "@/hooks/usePDFExport";
import { supabase } from "@/integrations/supabase/client";

interface PDFPreviewProps {
  diveLogId: string;
  hasSignature: boolean;
}

export const PDFPreview = ({ diveLogId, hasSignature }: PDFPreviewProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const { exportToPDF } = usePDFExport();

  const handlePreview = async () => {
    setIsLoadingPreview(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: { diveLogId, preview: true },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success && data.html) {
        // Modificar el HTML para mostrar texto en negro y agregar el logo
        const modifiedHtml = data.html
          .replace(/color:\s*white/g, 'color: black')
          .replace(/color:\s*#fff/g, 'color: black')
          .replace('🚁 AEROCAM APP', `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
              <img src="/lovable-uploads/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" alt="Logo" style="height: 40px; width: auto;">
              <span>AEROCAM APP</span>
            </div>
          `);
        
        setPreviewContent(modifiedHtml);
        setPreviewOpen(true);
      }
    } catch (error) {
      console.error('Error previewing PDF:', error);
    } finally {
      setIsLoadingPreview(false);
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
        disabled={isLoadingPreview}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Eye className="w-4 h-4 mr-2" />
        {isLoadingPreview ? 'Cargando...' : 'Previsualizar PDF'}
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
            <DialogTitle className="text-white">Previsualización de Bitácora PDF</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto bg-white rounded">
            <div 
              className="w-full h-full p-4"
              style={{ color: 'black' }}
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
