
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (email: string, name?: string) => void;
  isLoading?: boolean;
}

export const EmailDialog = ({ open, onOpenChange, onSend, isLoading }: EmailDialogProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSend = () => {
    if (email.trim()) {
      onSend(email.trim(), name.trim() || undefined);
      setEmail("");
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-ocean-950 border-ocean-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Enviar Bitácora por Correo
          </DialogTitle>
          <DialogDescription className="text-ocean-300">
            Ingresa el email del destinatario para enviar la bitácora firmada.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-ocean-200">
              Email del destinatario *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="destinatario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-ocean-900 border-ocean-700 text-white"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-ocean-200">
              Nombre del destinatario (opcional)
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-ocean-900 border-ocean-700 text-white"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={!email.trim() || isLoading}
            className="bg-ocean-gradient hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Enviar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
