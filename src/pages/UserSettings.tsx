
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { User, Lock, Save } from "lucide-react";

const userSettingsSchema = z.object({
  username: z.string().min(1, "Nombre de usuario requerido"),
  email: z.string().email("Email inválido"),
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

  const form = useForm<UserSettingsForm>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      username: userProfile?.username || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Actualizar el formulario cuando se carguen los datos del usuario
  React.useEffect(() => {
    if (userProfile && user) {
      form.reset({
        username: userProfile.username || "",
        email: user.email || "",
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
      <div className="w-full h-full">
        <div className="flex items-center gap-4 mb-6 px-8 pt-8">
          <SidebarTrigger />
          <LoadingSkeleton type="page" count={1} />
        </div>
        <div className="px-8 pb-8">
          <LoadingSkeleton type="form" count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-4 mb-6 px-8 pt-8">
        <SidebarTrigger />
        <PageHeader title="Configuración de Usuario" />
      </div>
      <div className="px-8 pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Información Personal */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90"
                  >
                    {isUpdating ? "Actualizando..." : "Guardar Cambios"}
                    <Save className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Cambio de Contraseña */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Cambiar Contrase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90"
                  >
                    {isUpdating ? "Actualizando..." : "Cambiar Contraseña"}
                    <Lock className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
