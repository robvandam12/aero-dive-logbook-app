
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PDFPreview } from "./PDFPreview";
import { EmailDialog } from "./EmailDialog";
import { useExcelExport } from "@/hooks/useExcelExport";
import { useSendDiveLogEmail } from "@/hooks/useEmailMutations";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";

interface ExportActionsProps {
  diveLogId: string;
  hasSignature: boolean;
  diveLog?: DiveLogWithFullDetails;
}

export const ExportActions = ({ diveLogId, hasSignature, diveLog }: ExportActionsProps) => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const { exportSingleDiveLog } = useExcelExport();
  const { mutate: sendEmail, isPending: isSendingEmail } = useSendDiveLogEmail();

  const handleExportExcel = () => {
    if (diveLog) {
      exportSingleDiveLog(diveLog);
    }
  };

  const handleSendEmail = (email: string, name?: string) => {
    sendEmail({
      diveLogId,
      recipientEmail: email,
      recipientName: name,
      includePDF: true,
    }, {
      onSuccess: () => {
        setEmailDialogOpen(false);
      }
    });
  };

  return (
    <div className="flex gap-2">
      <PDFPreview diveLogId={diveLogId} hasSignature={hasSignature} />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Más opciones
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-950 border-slate-700">
          <DropdownMenuItem 
            onClick={handleExportExcel}
            className="text-white hover:bg-slate-800"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exportar Excel
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setEmailDialogOpen(true)}
            className="text-white hover:bg-slate-800"
          >
            <Mail className="w-4 h-4 mr-2" />
            Enviar por Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSend={handleSendEmail}
        isLoading={isSendingEmail}
      />
    </div>
  );
};
