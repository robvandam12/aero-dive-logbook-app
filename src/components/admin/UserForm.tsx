
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserManagement } from "@/hooks/useUserManagement";
import { useCenters } from "@/hooks/useCenters";

interface UserFormProps {
  user?: UserManagement;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const UserForm = ({ user, onSubmit, isLoading, isEdit = false }: UserFormProps) => {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    password: "",
    full_name: user?.full_name || "",
    role: user?.role || "supervisor",
    center_id: user?.center_id || "",
    is_active: user?.is_active ?? true,
  });

  const { data: centers = [] } = useCenters();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isEdit}
          />
        </div>

        {!isEdit && (
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
        )}

        <div>
          <Label htmlFor="full_name">Nombre Completo</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="role">Rol</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value as 'admin' | 'supervisor' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="center">Centro de Buceo</Label>
          <Select
            value={formData.center_id}
            onValueChange={(value) => setFormData({ ...formData, center_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar centro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sin centro asignado</SelectItem>
              {centers.map((center) => (
                <SelectItem key={center.id} value={center.id}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isEdit && (
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Usuario Activo</Label>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="bg-ocean-gradient hover:opacity-90">
        {isLoading ? "Guardando..." : isEdit ? "Actualizar Usuario" : "Crear Usuario"}
      </Button>
    </form>
  );
};
