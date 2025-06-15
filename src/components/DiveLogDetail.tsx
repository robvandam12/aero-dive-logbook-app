
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Ship, Users, FileText, Edit } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";

interface DiveLogDetailProps {
  diveLog: DiveLogWithFullDetails;
  onEdit?: () => void;
}

export const DiveLogDetail = ({ diveLog, onEdit }: DiveLogDetailProps) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Bitácora de Buceo</h1>
          <p className="text-ocean-300">{formatDate(diveLog.log_date)}</p>
        </div>
        {onEdit && (
          <Button onClick={onEdit} className="bg-ocean-gradient hover:opacity-90">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        )}
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
              <p className="text-white font-medium">{diveLog.supervisor_name}</p>
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
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Equipo de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {diveLog.divers_manifest?.map((diver: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-ocean-950/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{diver.name}</p>
                  <p className="text-ocean-400 text-sm">Matrícula: {diver.license}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-ocean-300 border-ocean-600">
                    {diver.role === 'buzo' ? 'Buzo' : 
                     diver.role === 'buzo-emergencia' ? 'Buzo de Emergencia' : 'Supervisor'}
                  </Badge>
                  <p className="text-ocean-400 text-sm mt-1">Prof. máx: {diver.working_depth}m</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Details */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Ship className="w-5 h-5 mr-2" />
            Detalle de Trabajos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {diveLog.work_type && (
            <div>
              <p className="text-ocean-300 text-sm">Tipo de Faena</p>
              <p className="text-white font-medium capitalize">{diveLog.work_type}</p>
            </div>
          )}
          <Separator className="bg-ocean-700" />
          <div>
            <p className="text-ocean-300 text-sm mb-2">Descripción de Trabajos</p>
            <p className="text-white whitespace-pre-wrap">{diveLog.work_details}</p>
          </div>
        </CardContent>
      </Card>

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
  );
};
