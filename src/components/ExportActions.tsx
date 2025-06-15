
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { usePDFExport } from "@/hooks/usePDFExport";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportActionsProps {
  diveLogId: string;
  hasSignature: boolean;
}

export const ExportActions = ({ diveLogId, hasSignature }: ExportActionsProps) => {
  const pdfExportMutation = usePDFExport();
  const { toast } = useToast();

  const handleExportPDF = (includeSignature: boolean = true) => {
    pdfExportMutation.mutate({
      diveLogId,
      includeSignature,
    });
  };

  const handleExportJSON = async () => {
    try {
      // Get dive log data from Supabase
      const { data, error } = await supabase
        .from('dive_logs')
        .select(`
          *,
          centers (name, location),
          dive_sites (name, location),
          boats (name, registration_number),
          profiles (username)
        `)
        .eq('id', diveLogId)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bitacora-${diveLogId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "JSON exportado",
        description: "Los datos de la bitácora han sido exportados exitosamente."
      });
    } catch (error: any) {
      toast({
        title: "Error al exportar JSON",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={pdfExportMutation.isPending}
          className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
        >
          {pdfExportMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-ocean-950 border-ocean-700">
        <DropdownMenuItem 
          onClick={() => handleExportPDF(true)}
          className="text-white hover:bg-ocean-800"
          disabled={pdfExportMutation.isPending}
        >
          <FileText className="w-4 h-4 mr-2" />
          PDF Completo
        </DropdownMenuItem>
        {hasSignature && (
          <DropdownMenuItem 
            onClick={() => handleExportPDF(false)}
            className="text-white hover:bg-ocean-800"
            disabled={pdfExportMutation.isPending}
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF sin Firma
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={handleExportJSON}
          className="text-white hover:bg-ocean-800"
        >
          <Download className="w-4 h-4 mr-2" />
          Datos JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
