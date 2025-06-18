
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Settings as SettingsIcon, Bell, Mail, Globe, Shield, Database } from "lucide-react";

const SettingsPage = () => {
  return (
    <main className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-start md:items-center gap-4">
        <SidebarTrigger />
        <div className="text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6555FF] to-purple-700 bg-clip-text text-transparent">
            Configuración del Sistema
          </h1>
          <p className="text-xl text-ocean-300 max-w-2xl">
            Administra las configuraciones generales de la aplicación.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuraciones Generales */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Configuraciones Generales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-ocean-200">Nombre de la Empresa</Label>
              <Input 
                defaultValue="Aerocam"
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-ocean-200">Timezone</Label>
              <Input 
                defaultValue="America/Santiago"
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-ocean-200">Idioma por Defecto</Label>
              <Input 
                defaultValue="Español"
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Configuración de Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-ocean-200">Notificaciones por Email</Label>
                <p className="text-sm text-ocean-400">Enviar notificaciones importantes por correo</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-ocean-700" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-ocean-200">Notificaciones Push</Label>
                <p className="text-sm text-ocean-400">Mostrar notificaciones en el navegador</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-ocean-700" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-ocean-200">Reportes Semanales</Label>
                <p className="text-sm text-ocean-400">Envío automático de reportes</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Configuraciones de Email */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Configuración de Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-ocean-200">Email Remitente</Label>
              <Input 
                defaultValue="noreply@aerocam.cl"
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-ocean-200">Nombre Remitente</Label>
              <Input 
                defaultValue="Aerocam App"
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-ocean-200">Servidor SMTP</Label>
              <Input 
                placeholder="smtp.resend.com"
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuraciones de Seguridad */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-ocean-200">Autenticación de Dos Factores</Label>
                <p className="text-sm text-ocean-400">Requerir 2FA para administradores</p>
              </div>
              <Switch />
            </div>
            <Separator className="bg-ocean-700" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-ocean-200">Expiración de Sesión</Label>
                <p className="text-sm text-ocean-400">Cerrar sesión automáticamente</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label className="text-ocean-200">Duración de Sesión (horas)</Label>
              <Input 
                type="number"
                defaultValue="8"
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuraciones de Base de Datos */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Configuraciones Avanzadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-ocean-200">Retención de Datos (días)</Label>
                <Input 
                  type="number"
                  defaultValue="365"
                  className="bg-ocean-950/50 border-ocean-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-ocean-200">Backup Automático</Label>
                <Input 
                  defaultValue="Diario"
                  className="bg-ocean-950/50 border-ocean-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-ocean-200">Compresión de Archivos</Label>
                <Input 
                  defaultValue="Habilitada"
                  className="bg-ocean-950/50 border-ocean-700 text-white"
                />
              </div>
            </div>
            
            <Separator className="bg-ocean-700" />
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">Mantenimiento del Sistema</h3>
                <p className="text-sm text-ocean-400">Ejecutar tareas de mantenimiento y optimización</p>
              </div>
              <Button variant="outline" className="border-ocean-700 text-ocean-200 hover:bg-ocean-800">
                Ejecutar Mantenimiento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="border-ocean-700 text-ocean-200 hover:bg-ocean-800">
          Cancelar
        </Button>
        <Button className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90">
          Guardar Configuración
        </Button>
      </div>
    </main>
  );
};

export default SettingsPage;
