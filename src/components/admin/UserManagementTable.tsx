
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, Mail, Shield, Users, Settings } from "lucide-react";
import { useUserManagement, UserManagement } from "@/hooks/useUserManagement";
import { useUpdateUser } from "@/hooks/useUserMutations";
import { Skeleton } from "@/components/ui/skeleton";
import { InviteUserForm } from "./InviteUserForm";
import { UserEditDialog } from "./UserEditDialog";

export const UserManagementTable = () => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserManagement | null>(null);
  const { data: users, isLoading } = useUserManagement();
  const updateUser = useUpdateUser();

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await updateUser.mutateAsync({
        id: userId,
        data: { is_active: !isActive }
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleToggleMultiCenter = async (userId: string, allowMultiCenter: boolean) => {
    try {
      await updateUser.mutateAsync({
        id: userId,
        data: { allow_multi_center: !allowMultiCenter }
      });
    } catch (error) {
      console.error('Error updating multi-center permission:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Gestión de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestión de Usuarios
            </CardTitle>
            <Button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90"
            >
              <Mail className="w-4 h-4 mr-2" />
              Invitar Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showInviteForm && (
            <div className="mb-6">
              <InviteUserForm onSuccess={() => setShowInviteForm(false)} />
            </div>
          )}

          {users && users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-ocean-800">
                  <TableHead className="text-ocean-300">Usuario</TableHead>
                  <TableHead className="text-ocean-300">Email</TableHead>
                  <TableHead className="text-ocean-300">Rol</TableHead>
                  <TableHead className="text-ocean-300">Centro</TableHead>
                  <TableHead className="text-ocean-300">Estado</TableHead>
                  <TableHead className="text-ocean-300">Multi-Centro</TableHead>
                  <TableHead className="text-ocean-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-ocean-800 hover:bg-ocean-950/30">
                    <TableCell className="font-medium text-white">
                      {user.full_name || 'Sin nombre'}
                    </TableCell>
                    <TableCell className="text-ocean-200">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-ocean-200">
                      {user.centers?.name || 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={() => handleToggleActive(user.id, user.is_active)}
                          className="data-[state=checked]:bg-[#6555FF]"
                        />
                        <span className={`text-sm ${user.is_active ? 'text-green-400' : 'text-red-400'}`}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.allow_multi_center}
                          onCheckedChange={() => handleToggleMultiCenter(user.id, user.allow_multi_center)}
                          className="data-[state=checked]:bg-[#6555FF]"
                        />
                        <span className={`text-sm ${user.allow_multi_center ? 'text-blue-400' : 'text-ocean-400'}`}>
                          {user.allow_multi_center ? 'Sí' : 'No'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-ocean-300 hover:text-white p-1"
                          title="Editar usuario"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="Configurar permisos"
                          onClick={() => setEditingUser(user)}
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-400 hover:text-purple-300 p-1"
                          title="Configuración avanzada"
                          onClick={() => setEditingUser(user)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-ocean-300">No hay usuarios registrados</p>
            </div>
          )}
        </CardContent>
      </Card>

      <UserEditDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      />
    </div>
  );
};
