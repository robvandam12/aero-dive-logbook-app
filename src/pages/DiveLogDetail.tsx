
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useDiveLog } from "@/hooks/useDiveLog";
import { DiveLogDetail as DiveLogDetailComponent } from "@/components/DiveLogDetail";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DiveLogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: diveLog, isLoading, error } = useDiveLog(id);

  const handleEdit = () => {
    navigate(`/dive-logs/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/dive-logs');
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <LoadingSkeleton type="page" count={1} />
        </div>
        <LoadingSkeleton type="cards" count={3} />
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
            Volver a Bitácoras
          </Button>
        </div>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Bitácora no encontrada</h2>
          <p className="text-ocean-300 mb-8">La bitácora que buscas no existe o no tienes permisos para verla.</p>
          <Button onClick={handleBack} className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90">
            Volver a Bitácoras
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Button variant="ghost" onClick={handleBack} className="text-ocean-300 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Bitácoras
        </Button>
      </div>
      <DiveLogDetailComponent diveLog={diveLog} onEdit={handleEdit} />
    </main>
  );
};

export default DiveLogDetailPage;
