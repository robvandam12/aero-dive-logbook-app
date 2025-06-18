import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCenters } from "@/hooks/useCenters";
import { useSendInvitationEmail } from "@/hooks/useUserMutations";
import { supabase } from "@/integrations/supabase/client";

export const InviteUserForm = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"admin" | "usuario">("usuario");
  const [centerId, setCenterId] = useState("");
  const [message, setMessage] = useState("");
  
  const { toast } = useToast();
  const { data: centers } = useCenters();
  const { mutate: sendInvitation, isPending } = useSendInvitationEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !fullName) {
      toast({
        title: "Error",
        description: "Email y nombre completo son requeridos",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting invitation form with data:', { email, full_name: fullName, role, center_id: centerId, message });

    try {
      // Check if user already exists with better error handling
      const { data: existingUsers, error: checkError } = await supabase
        .from('user_management')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing user:', checkError);
        // Continue with invitation even if check fails
      } else if (existingUsers) {
        toast({
          title: "Error",
          description: "Ya existe un usuario con este email",
          variant: "destructive",
        });
        return;
      }

      sendInvitation({
        email,
        fullName,
        role,
        centerId: centerId === "none" ? null : centerId,
        message,
      }, {
        onSuccess: () => {
          setEmail("");
          setFullName("");
          setRole("usuario");
          setCenterId("");
          setMessage("");
          toast({
            title: "Invitación enviada",
            description: `Se ha enviado una invitación a ${email}`,
          });
        },
        onError: (error) => {
          console.error('Error sending invitation:', error);
          toast({
            title: "Error al enviar invitación",
            description: error.message || "Ocurrió un error inesperado",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-slate-950 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="fullName">Nombre Completo</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="bg-slate-950 border-slate-700 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Rol</Label>
          <Select value={role} onValueChange={(value: "admin" | "usuario") => setRole(value)}>
            <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-700">
              <SelectItem value="usuario">Usuario</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="center">Centro (Opcional)</Label>
          <Select value={centerId} onValueChange={setCenterId}>
            <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
              <SelectValue placeholder="Seleccionar centro" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-700">
              <SelectItem value="none">Sin centro asignado</SelectItem>
              {centers?.map((center) => (
                <SelectItem key={center.id} value={center.id}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">Mensaje personalizado (Opcional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Añade un mensaje personalizado a la invitación..."
          className="bg-slate-950 border-slate-700 text-white"
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Enviando..." : "Enviar Invitación"}
      </Button>
    </form>
  );
};
