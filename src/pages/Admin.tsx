
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { CentersManagement } from "@/components/admin/CentersManagement";
import { BoatsManagement } from "@/components/admin/BoatsManagement";
import { DiveSitesManagement } from "@/components/admin/DiveSitesManagement";

const Admin = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Administración</h1>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900">
          <TabsTrigger value="users" className="text-white">Usuarios</TabsTrigger>
          <TabsTrigger value="centers" className="text-white">Centros</TabsTrigger>
          <TabsTrigger value="boats" className="text-white">Embarcaciones</TabsTrigger>
          <TabsTrigger value="dive-sites" className="text-white">Sitios de Buceo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card className="bg-slate-950 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Gestión de Usuarios</CardTitle>
              <CardDescription className="text-slate-400">
                Administra los usuarios del sistema y sus permisos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="centers">
          <Card className="bg-slate-950 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Gestión de Centros de Cultivo</CardTitle>
              <CardDescription className="text-slate-400">
                Administra los centros de cultivo disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CentersManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="boats">
          <Card className="bg-slate-950 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Gestión de Embarcaciones</CardTitle>
              <CardDescription className="text-slate-400">
                Administra las embarcaciones disponibles para buceo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BoatsManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dive-sites">
          <Card className="bg-slate-950 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Gestión de Sitios de Buceo</CardTitle>
              <CardDescription className="text-slate-400">
                Administra los puntos de buceo disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiveSitesManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
