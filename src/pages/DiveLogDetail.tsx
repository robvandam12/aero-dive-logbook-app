
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
      <div className="w-full h-full">
        <div className="flex items-center gap-4 mb-6 px-8 pt-8">
          <SidebarTrigger />
          <LoadingSkeleton type="page" count={1} />
        </div>
        <div className="px-8 pb-8">
          <LoadingSkeleton type="cards" count={3} />
        </div>
      </div>
    );
  }

  if (error || !diveLog) {
    return (
      <div className="w-full h-full">
        <div className="flex items-center gap-4 mb-6 px-8 pt-8">
          <SidebarTrigger />
          <Button variant="ghost" onClick={handleBack} className="text-ocean-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Bitácoras
          </Button>
        </div>
        <div className="px-8 pb-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">Bitácora no encontrada</h2>
            <p className="text-ocean-300 mb-8">La bitácora que buscas no existe o no tienes permisos para verla.</p>
            <Button onClick={handleBack} className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90">
              Volver a Bitácoras
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-4 mb-6 px-8 pt-8">
        <SidebarTrigger />
        <Button variant="ghost" onClick={handleBack} className="text-ocean-300 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Bitácoras
        </Button>
      </div>
      <div className="px-8 pb-8">
        <DiveLogDetailComponent diveLog={diveLog} onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default DiveLogDetailPage;
