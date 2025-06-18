
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Search } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useCreateUser, useUpdateUser } from "@/hooks/useUserMutations";
import { UserForm } from "./UserForm";
import { UserManagement } from "@/hooks/useUserManagement";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserManagement | null>(null);

  const { data: users = [], isLoading } = useUserManagement();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = (data: any) => {
    createUserMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
      },
    });
  };

  const handleUpdateUser = (data: any) => {
    if (editingUser) {
      updateUserMutation.mutate(
        { id: editingUser.id, ...data },
        {
          onSuccess: () => {
            setEditingUser(null);
          },
        }
      );
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge variant="destructive">Administrador</Badge>
    ) : (
      <Badge variant="secondary">Usuario</Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-600">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8 text-white">Cargando usuarios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ocean-gradient hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Usuario</DialogTitle>
            </DialogHeader>
            <UserForm 
              onSubmit={handleCreateUser} 
              isLoading={createUserMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-400 w-4 h-4" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-ocean-900/50 border-ocean-700 text-white"
          />
        </div>
      </div>

      <div className="rounded-lg border border-ocean-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-ocean-700 hover:bg-ocean-800/50">
              <TableHead className="text-ocean-300">Email</TableHead>
              <TableHead className="text-ocean-300">Nombre</TableHead>
              <TableHead className="text-ocean-300">Rol</TableHead>
              <TableHead className="text-ocean-300">Centro</TableHead>
              <TableHead className="text-ocean-300">Estado</TableHead>
              <TableHead className="text-ocean-300">Creado</TableHead>
              <TableHead className="text-ocean-300">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-ocean-700 hover:bg-ocean-800/30">
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell className="text-white">{user.full_name || '-'}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell className="text-ocean-300">
                  {user.centers?.name || 'Sin asignar'}
                </TableCell>
                <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                <TableCell className="text-ocean-300">
                  {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: es })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingUser(user)}
                    className="text-ocean-300 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-ocean-400">
          No se encontraron usuarios.
        </div>
      )}

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="glass max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Usuario</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm
              user={editingUser}
              onSubmit={handleUpdateUser}
              isLoading={updateUserMutation.isPending}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
