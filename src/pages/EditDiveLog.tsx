
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useDiveLog } from "@/hooks/useDiveLog";
import { DiveLogWizard } from "@/components/DiveLogWizard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";

const EditDiveLogPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: diveLog, isLoading, error } = useDiveLog(id);

  const handleBack = () => {
    navigate(`/dive-logs/${id}`);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <LoadingSkeleton type="page" count={1} />
        </div>
        <LoadingSkeleton type="form" count={6} />
      </main>
    );
  }

  if (error || !diveLog) {
    return (
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Button variant="ghost" onClick={handleBack} className="text-ocean-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la Bitácora
          </Button>
        </div>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Error al cargar la bitácora</h2>
          <p className="text-ocean-300 mb-8">No se pudo cargar la bitácora para editar.</p>
          <Button onClick={handleBack} className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6555FF] to-purple-700 bg-clip-text text-transparent">
            Editar Bitácora de Buceo
          </h1>
          <p className="text-xl text-ocean-300 max-w-2xl">
            Modifique los datos de la bitácora según sea necesario.
          </p>
        </div>
      </div>
      <DiveLogWizard diveLog={diveLog} isEditMode={true} />
    </main>
  );
};

export default EditDiveLogPage;
