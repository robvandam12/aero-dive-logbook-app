import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileSignature } from "lucide-react";
import { useDiveLog } from "@/hooks/useDiveLog";
import { DigitalSignature } from "@/components/DigitalSignature";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useUpdateDiveLog } from "@/hooks/useDiveLogMutations";
import { useAuth } from "@/contexts/AuthProvider";
import { useToast } from "@/hooks/use-toast";

const SignDiveLogPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: diveLog, isLoading, error } = useDiveLog(id);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const updateDiveLogMutation = useUpdateDiveLog();

  const handleBack = () => {
    navigate(`/dive-logs/${id}`);
  };

  const handleSaveSignature = (signature: string) => {
    setSignatureData(signature);
  };

  const handleSubmitSignature = () => {
    if (!signatureData || !user || !diveLog) return;

    // Properly cast divers_manifest to expected type
    const diversManifest = Array.isArray(diveLog.divers_manifest) 
      ? diveLog.divers_manifest as Array<{
          name?: string;
          role?: "supervisor" | "buzo" | "buzo-emergencia";
          license?: string;
          working_depth?: number;
        }>
      : [];

    const formData = {
      log_date: diveLog.log_date,
      center_id: diveLog.center_id,
      dive_site_id: diveLog.dive_site_id,
      boat_id: diveLog.boat_id || '',
      weather_condition: 'N/A' as any,
      wind_knots: undefined,
      wave_height_meters: undefined,
      divers_manifest: diversManifest,
      observations: diveLog.observations || '',
      departure_time: diveLog.departure_time || '',
      arrival_time: diveLog.arrival_time || '',
      signature_data: signatureData
    };

    updateDiveLogMutation.mutate(
      { 
        id: diveLog.id, 
        data: formData, 
        userId: user.id,
        currentSignatureUrl: diveLog.signature_url 
      },
      {
        onSuccess: () => {
          toast({
            title: "Bitácora firmada",
            description: "La bitácora ha sido firmada correctamente."
          });
          navigate(`/dive-logs/${id}`);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </main>
    );
  }

  if (error || !diveLog) {
    return (
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Button variant="ghost" onClick={handleBack} className="text-ocean-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la Bitácora
          </Button>
        </div>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Error al cargar la bitácora</h2>
          <p className="text-ocean-300 mb-8">No se pudo cargar la bitácora para firmar.</p>
          <Button onClick={handleBack} className="bg-ocean-gradient hover:opacity-90">
            Volver a la Bitácora
          </Button>
        </div>
      </main>
    );
  }

  // Check if already signed
  if (diveLog.signature_url) {
    return (
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Button variant="ghost" onClick={handleBack} className="text-ocean-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la Bitácora
          </Button>
        </div>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Bitácora ya firmada</h2>
          <p className="text-ocean-300 mb-8">Esta bitácora ya ha sido firmada anteriormente.</p>
          <Button onClick={handleBack} className="bg-ocean-gradient hover:opacity-90">
            Volver a la Bitácora
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-start md:items-center gap-4">
        <SidebarTrigger />
        <Button variant="ghost" onClick={handleBack} className="text-ocean-300 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la Bitácora
        </Button>
        <div className="text-left">
          <h1 className="text-4xl font-bold text-white">
            Firmar Bitácora de Buceo
          </h1>
          <p className="text-xl text-ocean-300 max-w-2xl">
            Firme la bitácora para finalizar y validar el registro.
          </p>
        </div>
      </div>

      <Card className="glass max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileSignature className="w-5 h-5 mr-2" />
            Firma Digital del Supervisor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-ocean-300 text-sm">
              <strong>Fecha:</strong> {new Date(diveLog.log_date).toLocaleDateString('es-ES')}
            </p>
            <p className="text-ocean-300 text-sm">
              <strong>Centro:</strong> {diveLog.centers?.name}
            </p>
            <p className="text-ocean-300 text-sm">
              <strong>Punto de Buceo:</strong> {diveLog.dive_sites?.name}
            </p>
            <p className="text-ocean-300 text-sm">
              <strong>Supervisor:</strong> {diveLog.profiles?.username}
            </p>
          </div>

          <div className="border-t border-ocean-700 pt-6">
            <p className="text-sm text-ocean-400 mb-4">
              Su firma digital certificará que la información registrada en esta bitácora es correcta y completa.
            </p>
            <DigitalSignature onSave={handleSaveSignature} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 border-ocean-600 text-ocean-300 hover:bg-ocean-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitSignature}
              disabled={!signatureData || updateDiveLogMutation.isPending}
              className={`flex-1 ${!signatureData ? 'opacity-60 cursor-not-allowed' : 'bg-gold-gradient hover:opacity-90'}`}
            >
              {updateDiveLogMutation.isPending ? (
                "Firmando..."
              ) : (
                <>
                  <FileSignature className="w-4 h-4 mr-2" />
                  Firmar Bitácora
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignDiveLogPage;
