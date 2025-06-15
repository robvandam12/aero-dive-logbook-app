
import { DiveLogWizard } from "@/components/DiveLogWizard";
import { SidebarTrigger } from "@/components/ui/sidebar";

const NewDiveLogPage = () => {
  return (
    <main className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-start md:items-center gap-4">
        <SidebarTrigger />
        <div className="text-left">
          <h1 className="text-4xl font-bold text-white">
            Nueva Bitácora de Buceo
          </h1>
          <p className="text-xl text-ocean-300 max-w-2xl">
            Complete los siguientes pasos para registrar una nueva faena.
          </p>
        </div>
      </div>
      <DiveLogWizard />
    </main>
  );
};

export default NewDiveLogPage;
