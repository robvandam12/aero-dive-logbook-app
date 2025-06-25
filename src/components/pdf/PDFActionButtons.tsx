
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

interface PDFActionButtonsProps {
  onPreview: () => void;
  onDownload: () => void;
  isLoadingPreview: boolean;
  isExporting: boolean;
  hasValidData: boolean;
}

export const PDFActionButtons = ({
  onPreview,
  onDownload,
  isLoadingPreview,
  isExporting,
  hasValidData
}: PDFActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onPreview}
        disabled={isLoadingPreview}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Eye className="w-4 h-4 mr-2" />
        {isLoadingPreview ? 'Cargando...' : 'Previsualizar PDF'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDownload}
        disabled={isExporting || !hasValidData}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? 'Generando...' : 'Descargar PDF'}
      </Button>
    </div>
  );
};
