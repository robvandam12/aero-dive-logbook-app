
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useCenters } from "@/hooks/useCenters";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";

const inviteUserSchema = z.object({
  email: z.string().email("Email inválido"),
  full_name: z.string().min(1, "Nombre completo requerido"),
  role: z.enum(['admin', 'supervisor'], {
    required_error: "Rol requerido",
  }),
  center_id: z.string().optional(),
  message: z.string().optional(),
});

type InviteUserForm = z.infer<typeof inviteUserSchema>;

interface InviteUserFormProps {
  onSuccess?: () => void;
}

export const InviteUserForm = ({ onSuccess }: InviteUserFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: centers } = useCenters();
  const { toast } = useToast();

  const form = useForm<InviteUserForm>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      full_name: "",
      role: "supervisor",
      center_id: "",
      message: "",
    },
  });

  const onSubmit = async (data: InviteUserForm) => {
    try {
      setIsLoading(true);
      console.log("Submitting invitation form with data:", data);

      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Usuario no autenticado');
      }

      // Preparar datos para la función edge
      const invitationData = {
        email: data.email,
        fullName: data.full_name,
        role: data.role,
        centerId: data.center_id && data.center_id !== "" ? data.center_id : null,
        message: data.message || "",
        createdBy: userData.user.id
      };

      console.log("Sending invitation data:", invitationData);

      // Enviar invitación usando la función edge
      const { data: result, error } = await supabase.functions.invoke('send-invitation-email', {
        body: invitationData,
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      if (!result?.success) {
        console.error('Function returned error:', result?.error);
        throw new Error(result?.error || 'Error al enviar la invitación');
      }

      console.log("Invitation sent successfully:", result);

      toast({
        title: "Invitación enviada",
        description: `Se ha enviado una invitación a ${data.email}`,
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar la invitación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Invitar Nuevo Usuario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="usuario@empresa.com"
                        className="bg-ocean-900/50 border-ocean-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ocean-200">Nombre Completo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Juan Pérez"
                        className="bg-ocean-900/50 border-ocean-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ocean-200">Rol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-ocean-900/50 border-ocean-700 text-white">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-ocean-900 border-ocean-700">
                        <SelectItem value="supervisor" className="text-white">Supervisor</SelectItem>
                        <SelectItem value="admin" className="text-white">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="center_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ocean-200">Centro de Buceo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-ocean-900/50 border-ocean-700 text-white">
                          <SelectValue placeholder="Seleccionar centro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-ocean-900 border-ocean-700">
                        <SelectItem value="sin-centro" className="text-white">Sin centro asignado</SelectItem>
                        {centers?.map((center) => (
                          <SelectItem key={center.id} value={center.id} className="text-white">
                            {center.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-ocean-200">Mensaje Personalizado (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Mensaje adicional para incluir en la invitación..."
                      className="bg-ocean-900/50 border-ocean-700 text-white"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Invitación
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
