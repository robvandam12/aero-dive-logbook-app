
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUpdateUser } from "@/hooks/useUserMutations";
import { useCenters } from "@/hooks/useCenters";
import { UserManagement } from "@/hooks/useUserManagement";
import { Loader2 } from "lucide-react";

const userEditSchema = z.object({
  full_name: z.string().min(1, "Nombre completo requerido"),
  role: z.enum(['admin', 'usuario']),
  center_id: z.string().optional(),
  is_active: z.boolean(),
  allow_multi_center: z.boolean(),
});

type UserEditForm = z.infer<typeof userEditSchema>;

interface UserEditDialogProps {
  user: UserManagement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserEditDialog = ({ user, open, onOpenChange }: UserEditDialogProps) => {
  const { data: centers } = useCenters();
  const updateUser = useUpdateUser();

  const form = useForm<UserEditForm>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      role: user?.role || "usuario",
      center_id: user?.center_id || undefined,
      is_active: user?.is_active ?? true,
      allow_multi_center: user?.allow_multi_center ?? false,
    },
  });

  // Reset form when user changes
  useState(() => {
    if (user) {
      form.reset({
        full_name: user.full_name || "",
        role: user.role,
        center_id: user.center_id || undefined,
        is_active: user.is_active,
        allow_multi_center: user.allow_multi_center,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserEditForm) => {
    if (!user) return;

    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: {
          full_name: data.full_name,
          role: data.role,
          center_id: data.center_id === 'none' ? null : data.center_id,
          is_active: data.is_active,
          allow_multi_center: data.allow_multi_center,
        }
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-ocean-200">Nombre Completo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-ocean-900/50 border-ocean-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-ocean-200">Rol</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-ocean-900/50 border-ocean-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-ocean-900 border-ocean-700">
                      <SelectItem value="usuario" className="text-white">Usuario</SelectItem>
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
                  <FormLabel className="text-ocean-200">Centro</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "none"}>
                    <FormControl>
                      <SelectTrigger className="bg-ocean-900/50 border-ocean-700 text-white">
                        <SelectValue />
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

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-ocean-700 p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-ocean-200">Usuario Activo</FormLabel>
                    <div className="text-sm text-ocean-400">
                      Permitir acceso al sistema
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#6555FF]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allow_multi_center"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-ocean-700 p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-ocean-200">Multi-Centro</FormLabel>
                    <div className="text-sm text-ocean-400">
                      Acceso a múltiples centros
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#6555FF]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-ocean-700 text-ocean-200 hover:bg-ocean-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateUser.isPending}
                className="flex-1 bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90"
              >
                {updateUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
