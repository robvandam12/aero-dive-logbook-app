
import { Button } from "@/components/ui/button";
import { Eye, Edit, FileSignature, Mail, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DiveLogsActionsProps {
  logId: string;
  status: 'draft' | 'signed';
  signatureUrl?: string | null;
  onSendEmail: (logId: string) => void;
  onDelete: (logId: string, signatureUrl?: string | null) => void;
}

export const DiveLogsActions = ({
  logId,
  status,
  signatureUrl,
  onSendEmail,
  onDelete,
}: DiveLogsActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-ocean-300 hover:text-white"
        onClick={() => navigate(`/dive-logs/${logId}`)}
        title="Ver detalles"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-ocean-300 hover:text-white"
        onClick={() => navigate(`/dive-logs/${logId}/edit`)}
        title="Editar"
      >
        <Edit className="w-4 h-4" />
      </Button>
      {status === 'draft' && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gold-400 hover:text-gold-300"
          onClick={() => navigate(`/dive-logs/${logId}/edit`)}
          title="Firmar bitácora"
        >
          <FileSignature className="w-4 h-4" />
        </Button>
      )}
      {status === 'signed' && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-green-400 hover:text-green-300"
          onClick={() => onSendEmail(logId)}
          title="Enviar por correo"
        >
          <Mail className="w-4 h-4" />
        </Button>
      )}
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-red-400 hover:text-red-300"
        onClick={() => onDelete(logId, signatureUrl)}
        title="Eliminar bitácora"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
