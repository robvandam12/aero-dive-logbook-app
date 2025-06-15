
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Anchor, Ship, Waves } from "lucide-react";
import { CentersManagement } from "@/components/admin/CentersManagement";
import { BoatsManagement } from "@/components/admin/BoatsManagement";
import { DiveSitesManagement } from "@/components/admin/DiveSitesManagement";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-hero-gradient ocean-pattern">
      <Header />
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Panel de Administración</h1>
            <p className="text-xl text-ocean-300">Gestión de datos maestros del sistema.</p>
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
    </div>
  );
};

export default AdminPage;
