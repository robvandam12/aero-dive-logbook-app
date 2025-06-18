
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
      center_id: undefined, // Cambio de "" a undefined
      message: "",
    },
  });

  const onSubmit = async (data: InviteUserForm) => {
    try {
      setIsLoading(true);

      // Generar token único
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días

      // Crear invitación en la base de datos
      const { error: insertError } = await supabase
        .from('invitation_tokens')
        .insert({
          email: data.email,
          token,
          expires_at: expiresAt.toISOString(),
          user_data: {
            full_name: data.full_name,
            role: data.role,
            center_id: data.center_id || null,
          },
          created_by: (await supabase.auth.getUser()).data.user?.id || '',
        });

      if (insertError) throw insertError;

      // Enviar email de invitación
      const { error: emailError } = await supabase.functions.invoke('send-invitation-email', {
        body: {
          email: data.email,
          token,
          userData: {
            full_name: data.full_name,
            role: data.role,
            center_id: data.center_id,
          },
          message: data.message,
        },
      });

      if (emailError) throw emailError;

      toast({
        title: "Invitación enviada",
        description: `Se ha enviado una invitación a ${data.email}`,
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación. Inténtalo de nuevo.",
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
                        <SelectItem value="none" className="text-white">Sin centro asignado</SelectItem>
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
