
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  FileText, 
  Mail, 
  FileSpreadsheet, 
  Calendar,
  Filter,
  Loader2 
} from "lucide-react";
import { useExcelExport } from "@/hooks/useExcelExport";
import { usePDFExport } from "@/hooks/usePDFExport";
import { useSendDiveLogEmail } from "@/hooks/useEmailMutations";
import { useToast } from "@/hooks/use-toast";
import { EmailDialog } from "./EmailDialog";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";

interface ExportActionsExtendedProps {
  diveLog?: DiveLogWithFullDetails;
  showMultipleExport?: boolean;
  dateRange?: { from?: Date; to?: Date };
}

export const ExportActionsExtended = ({ 
  diveLog, 
  showMultipleExport = false,
  dateRange 
}: ExportActionsExtendedProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { exportSingleDiveLog, exportMultipleDiveLogs } = useExcelExport();
  const { exportToPDF } = usePDFExport();
  const sendDiveLogEmail = useSendDiveLogEmail();
  const { toast } = useToast();

  const handleExportPDF = async () => {
    if (!diveLog) return;
    
    try {
      setIsExporting(true);
      await exportToPDF.mutateAsync({ diveLogId: diveLog.id });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo exportar el PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!diveLog) return;
    
    try {
      setIsExporting(true);
      await exportSingleDiveLog(diveLog);
    } catch (error) {
      console.error('Error exporting Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMultipleExcel = async () => {
    try {
      setIsExporting(true);
      await exportMultipleDiveLogs(dateRange);
    } catch (error) {
      console.error('Error exporting multiple Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendEmail = async (email: string, name?: string) => {
    if (!diveLog) return;

    try {
      await sendDiveLogEmail.mutateAsync({
        diveLogId: diveLog.id,
        recipientEmail: email,
        recipientName: name,
      });
      setShowEmailDialog(false);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="w-5 h-5" />
          Exportación y Envío
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exportación Individual */}
        {diveLog && (
          <div className="space-y-2">
            <h4 className="text-ocean-200 font-medium">Bitácora Individual</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleExportPDF}
                disabled={isExporting || exportToPDF.isPending}
                variant="outline"
                size="sm"
                className="border-ocean-700 text-ocean-300 hover:bg-ocean-800"
              >
                {isExporting || exportToPDF.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Exportar PDF
              </Button>
              
              <Button
                onClick={handleExportExcel}
                disabled={isExporting}
                variant="outline"
                size="sm"
                className="border-ocean-700 text-ocean-300 hover:bg-ocean-800"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                )}
                Exportar Excel
              </Button>
              
              <Button
                onClick={() => setShowEmailDialog(true)}
                disabled={sendDiveLogEmail.isPending}
                variant="outline"
                size="sm"
                className="border-ocean-700 text-ocean-300 hover:bg-ocean-800"
              >
                {sendDiveLogEmail.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Enviar Email
              </Button>
            </div>
          </div>
        )}

        {/* Exportación Múltiple */}
        {showMultipleExport && (
          <div className="space-y-2 pt-4 border-t border-ocean-800">
            <h4 className="text-ocean-200 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Exportación Múltiple
              {dateRange?.from && (
                <span className="text-xs text-ocean-400">
                  (Filtrado por fechas)
                </span>
              )}
            </h4>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleExportMultipleExcel}
                disabled={isExporting}
                variant="outline"
                size="sm"
                className="border-ocean-700 text-ocean-300 hover:bg-ocean-800"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                )}
                Reporte Excel
              </Button>
              
              <Button
                onClick={handleExportMultipleExcel}
                disabled={isExporting}
                variant="outline"
                size="sm"
                className="border-ocean-700 text-ocean-300 hover:bg-ocean-800"
              >
                <Filter className="w-4 h-4 mr-2" />
                Últimas 30 Bitácoras
              </Button>
            </div>
          </div>
        )}

        {/* Dialog de Email */}
        {diveLog && (
          <EmailDialog
            open={showEmailDialog}
            onOpenChange={setShowEmailDialog}
            onSend={handleSendEmail}
            diveLog={diveLog}
            isLoading={sendDiveLogEmail.isPending}
          />
        )}
      </CardContent>
    </Card>
  );
};
