
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Anchor, Ship, Waves } from "lucide-react";
import { CentersManagement } from "@/components/admin/CentersManagement";
import { BoatsManagement } from "@/components/admin/BoatsManagement";
import { DiveSitesManagement } from "@/components/admin/DiveSitesManagement";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AdminPage = () => {
  return (
    <main className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-start md:items-center gap-4">
        <SidebarTrigger />
        <div className="text-left">
            <h1 className="text-4xl font-bold text-white">Panel de Administración</h1>
            <p className="text-xl text-ocean-300">Gestión de datos maestros del sistema.</p>
        </div>
      </div>
      <Tabs defaultValue="centers" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass">
          <TabsTrigger value="centers"><Anchor className="mr-2 h-4 w-4" /> Centros de Buceo</TabsTrigger>
          <TabsTrigger value="boats"><Ship className="mr-2 h-4 w-4" /> Embarcaciones</TabsTrigger>
          <TabsTrigger value="dive_sites"><Waves className="mr-2 h-4 w-4" /> Puntos de Buceo</TabsTrigger>
        </TabsList>
        <TabsContent value="centers" className="mt-4 glass p-6 rounded-lg">
           <CentersManagement />
        </TabsContent>
        <TabsContent value="boats" className="mt-4 glass p-6 rounded-lg">
          <BoatsManagement />
        </TabsContent>
        <TabsContent value="dive_sites" className="mt-4 glass p-6 rounded-lg">
          <DiveSitesManagement />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default AdminPage;
