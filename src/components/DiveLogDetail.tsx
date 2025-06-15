
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, FileText, Edit, FileSignature, Mail, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { ExportActions } from "@/components/ExportActions";
import { EmailDialog } from "@/components/EmailDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useSendDiveLogEmail } from "@/hooks/useEmailMutations";
import { useDeleteDiveLog } from "@/hooks/useDiveLogMutations";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DiveLogDetailProps {
  diveLog: DiveLogWithFullDetails;
  onEdit?: () => void;
}

export const DiveLogDetail = ({ diveLog, onEdit }: DiveLogDetailProps) => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const sendEmailMutation = useSendDiveLogEmail();
  const deleteLogMutation = useDeleteDiveLog();

  // Derive status from signature_url
  const status = diveLog.signature_url ? 'signed' : 'draft';

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  };

  // Parse divers manifest from JSON
  const diversManifest = diveLog.divers_manifest ? 
    (Array.isArray(diveLog.divers_manifest) ? diveLog.divers_manifest : []) as any[] : [];

  const handleSendEmail = () => {
    setEmailDialogOpen(true);
  };

  const handleEmailSend = (email: string, name?: string) => {
    sendEmailMutation.mutate({
      diveLogId: diveLog.id,
      recipientEmail: email,
      recipientName: name,
    }, {
      onSuccess: () => {
        setEmailDialogOpen(false);
        toast({
          title: "Correo enviado",
          description: "La bitácora ha sido enviada por correo exitosamente."
        });
      },
    });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteLogMutation.mutate({
      id: diveLog.id,
      signatureUrl: diveLog.signature_url
    }, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        toast({
          title: "Bitácora eliminada",
          description: "La bitácora ha sido eliminada correctamente."
        });
        navigate('/dive-logs');
      },
    });
  };

  const handleSign = () => {
    navigate(`/dive-logs/${diveLog.id}/sign`);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Bitácora de Buceo</h1>
            <p className="text-ocean-300">{formatDate(diveLog.log_date)}</p>
          </div>
          <div className="flex items-center space-x-3">
            <ExportActions 
              diveLogId={diveLog.id} 
              hasSignature={!!diveLog.signature_url} 
            />
            {status === 'signed' && (
              <Button 
                onClick={handleSendEmail}
                variant="outline" 
                size="sm"
                className="border-green-600 text-green-400 hover:bg-green-800"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar por Correo
              </Button>
            )}
            {onEdit && (
              <Button onClick={onEdit} className="bg-ocean-gradient hover:opacity-90">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
            {status === 'draft' && (
              <Button 
                onClick={handleSign}
                className="bg-gold-600 hover:bg-gold-700"
              >
                <FileSignature className="w-4 h-4 mr-2" />
                Firmar
              </Button>
            )}
            <Button 
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="border-red-600 text-red-400 hover:bg-red-800"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <Badge variant={diveLog.signature_url ? 'default' : 'secondary'} 
                 className={diveLog.signature_url ? 'bg-emerald-600' : 'bg-amber-600'}>
            {diveLog.signature_url ? 'Firmada' : 'Pendiente de firma'}
          </Badge>
        </div>

        {/* General Information */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-ocean-300 text-sm">Centro de Buceo</p>
                <p className="text-white font-medium">{diveLog.centers?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-ocean-300 text-sm">Supervisor</p>
                <p className="text-white font-medium">{diveLog.profiles?.username || 'N/A'}</p>
              </div>
              <div>
                <p className="text-ocean-300 text-sm">Punto de Buceo</p>
                <p className="text-white font-medium">{diveLog.dive_sites?.name || 'N/A'}</p>
                {diveLog.dive_sites?.location && (
                  <p className="text-ocean-400 text-sm">{diveLog.dive_sites.location}</p>
                )}
              </div>
              {diveLog.boats && (
                <div>
                  <p className="text-ocean-300 text-sm">Embarcación</p>
                  <p className="text-white font-medium">{diveLog.boats.name}</p>
                  <p className="text-ocean-400 text-sm">{diveLog.boats.registration_number}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diveLog.departure_time && (
                <div>
                  <p className="text-ocean-300 text-sm">Hora de Salida</p>
                  <p className="text-white font-medium">{diveLog.departure_time}</p>
                </div>
              )}
              {diveLog.arrival_time && (
                <div>
                  <p className="text-ocean-300 text-sm">Hora de Llegada</p>
                  <p className="text-white font-medium">{diveLog.arrival_time}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weather Conditions */}
        {diveLog.weather_conditions && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Condiciones Ambientales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">{diveLog.weather_conditions}</p>
            </CardContent>
          </Card>
        )}

        {/* Dive Team */}
        {diversManifest.length > 0 && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Equipo de Buceo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diversManifest.map((diver: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-ocean-950/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{diver.name || 'N/A'}</p>
                      <p className="text-ocean-400 text-sm">Matrícula: {diver.license || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-ocean-300 border-ocean-600">
                        {diver.role === 'buzo' ? 'Buzo' : 
                         diver.role === 'buzo-emergencia' ? 'Buzo de Emergencia' : 
                         diver.role === 'supervisor' ? 'Supervisor' : 'N/A'}
                      </Badge>
                      {diver.working_depth && (
                        <p className="text-ocean-400 text-sm mt-1">Prof. máx: {diver.working_depth}m</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Observations */}
        {diveLog.observations && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Observaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white whitespace-pre-wrap">{diveLog.observations}</p>
            </CardContent>
          </Card>
        )}

        {/* Signature */}
        {diveLog.signature_url && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">Firma del Supervisor</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={diveLog.signature_url} 
                alt="Firma del supervisor" 
                className="max-w-md h-32 object-contain bg-white rounded border"
              />
            </CardContent>
          </Card>
        )}
      </div>

      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSend={handleEmailSend}
        isLoading={sendEmailMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Bitácora"
        description="¿Estás seguro de que deseas eliminar esta bitácora? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLogMutation.isPending}
        variant="destructive"
      />
    </>
  );
};
