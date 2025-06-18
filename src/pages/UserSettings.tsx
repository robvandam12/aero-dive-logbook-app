import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { User, Lock, Save, Bell, Monitor, Globe, Shield, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const userSettingsSchema = z.object({
  username: z.string().min(1, "Nombre de usuario requerido"),
  email: z.string().email("Email inválido"),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  weeklyReports: z.boolean().optional(),
  theme: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type UserSettingsForm = z.infer<typeof userSettingsSchema>;

const UserSettings = () => {
  const { user } = useAuth();
  const { data: userProfile, isLoading } = useUserProfile();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');

  const form = useForm<UserSettingsForm>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      username: userProfile?.username || "",
      email: user?.email || "",
      fullName: "",
      phone: "",
      bio: "",
      timezone: "America/Santiago",
      language: "es",
      emailNotifications: true,
      pushNotifications: true,
      weeklyReports: false,
      theme: "dark",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (userProfile && user) {
      form.reset({
        username: userProfile.username || "",
        email: user.email || "",
        fullName: (userProfile as any).full_name || "",
        phone: (userProfile as any).phone || "",
        bio: (userProfile as any).bio || "",
        timezone: (userProfile as any).timezone || "America/Santiago",
        language: (userProfile as any).language || "es",
        emailNotifications: (userProfile as any).email_notifications ?? true,
        pushNotifications: (userProfile as any).push_notifications ?? true,
        weeklyReports: (userProfile as any).weekly_reports ?? false,
        theme: (userProfile as any).theme || "dark",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [userProfile, user, form]);

  const onSubmit = async (data: UserSettingsForm) => {
    try {
      setIsUpdating(true);

      // Actualizar perfil de usuario
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          full_name: data.fullName,
          phone: data.phone,
          bio: data.bio,
          timezone: data.timezone,
          language: data.language,
          email_notifications: data.emailNotifications,
          push_notifications: data.pushNotifications,
          weekly_reports: data.weeklyReports,
          theme: data.theme,
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Actualizar email si ha cambiado
      if (data.email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        });
        if (emailError) throw emailError;
      }

      // Actualizar contraseña si se proporcionó una nueva
      if (data.newPassword && data.newPassword.length > 0) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: data.newPassword,
        });
        if (passwordError) throw passwordError;
      }

      toast({
        title: "Configuración actualizada",
        description: "Tu información ha sido actualizada correctamente.",
      });

      // Limpiar campos de contraseña
      form.setValue("currentPassword", "");
      form.setValue("newPassword", "");
      form.setValue("confirmPassword", "");

    } catch (error: any) {
      console.error('Error updating user settings:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la configuración",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <LoadingSkeleton type="page" count={1} />
        </div>
        <LoadingSkeleton type="form" count={3} />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'preferences', label: 'Preferencias', icon: Monitor },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#6555FF] to-purple-700 bg-clip-text text-transparent">
            Configuración de Usuario
          </h2>
          <p className="text-ocean-300">Gestiona tu perfil y preferencias del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de navegación */}
        <Card className="glass lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#6555FF] to-purple-700 text-white"
                      : "text-ocean-300 hover:bg-ocean-800"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Contenido principal */}
        <div className="lg:col-span-3 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Pestaña Perfil */}
              {activeTab === 'profile' && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Información Personal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-ocean-200">Nombre de Usuario</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Tu nombre de usuario"
                                className="bg-ocean-900/50 border-ocean-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-ocean-200">Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="tu@email.com"
                                className="bg-ocean-900/50 border-ocean-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-ocean-200">Nombre Completo</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Tu nombre completo"
                                className="bg-ocean-900/50 border-ocean-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-ocean-200">Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="+56 9 1234 5678"
                                className="bg-ocean-900/50 border-ocean-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-ocean-200">Biografía</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Cuéntanos sobre ti..."
                              className="bg-ocean-900/50 border-ocean-700 text-white"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Pestaña Seguridad */}
              {activeTab === 'security' && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Seguridad y Acceso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-ocean-200">Nueva Contraseña</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Nueva contraseña (mínimo 6 caracteres)"
                              className="bg-ocean-900/50 border-ocean-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-ocean-200">Confirmar Nueva Contraseña</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Confirma tu nueva contraseña"
                              className="bg-ocean-900/50 border-ocean-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Pestaña Notificaciones */}
              {activeTab === 'notifications' && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Configuración de Notificaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div>
                            <FormLabel className="text-ocean-200">Notificaciones por Email</FormLabel>
                            <p className="text-sm text-ocean-400">Recibe alertas importantes por correo</p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div>
                            <FormLabel className="text-ocean-200">Notificaciones Push</FormLabel>
                            <p className="text-sm text-ocean-400">Notificaciones en tiempo real</p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weeklyReports"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div>
                            <FormLabel className="text-ocean-200">Reportes Semanales</FormLabel>
                            <p className="text-sm text-ocean-400">Resumen semanal de actividades</p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Pestaña Preferencias */}
              {activeTab === 'preferences' && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Preferencias del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-ocean-200">Idioma</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-ocean-900/50 border-ocean-700 text-white">
                                  <SelectValue placeholder="Seleccionar idioma" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-ocean-950 border-ocean-700">
                                <SelectItem value="es" className="text-white">Español</SelectItem>
                                <SelectItem value="en" className="text-white">English</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-ocean-200">Zona Horaria</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-ocean-900/50 border-ocean-700 text-white">
                                  <SelectValue placeholder="Seleccionar zona horaria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-ocean-950 border-ocean-700">
                                <SelectItem value="America/Santiago" className="text-white">Santiago (GMT-3)</SelectItem>
                                <SelectItem value="America/Lima" className="text-white">Lima (GMT-5)</SelectItem>
                                <SelectItem value="America/Bogota" className="text-white">Bogotá (GMT-5)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-ocean-200">Tema</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-ocean-900/50 border-ocean-700 text-white">
                                  <SelectValue placeholder="Seleccionar tema" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-ocean-950 border-ocean-700">
                                <SelectItem value="dark" className="text-white">Oscuro</SelectItem>
                                <SelectItem value="light" className="text-white">Claro</SelectItem>
                                <SelectItem value="auto" className="text-white">Automático</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90"
                >
                  {isUpdating ? "Guardando..." : "Guardar Cambios"}
                  <Save className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
