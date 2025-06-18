
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserManagement } from "@/hooks/useUserManagement";
import { UserEditDialog } from "./UserEditDialog";
import { Edit } from "lucide-react";

interface UserManagementTableProps {
  users: UserManagement[];
  isLoading: boolean;
}

export const UserManagementTable = ({ users, isLoading }: UserManagementTableProps) => {
  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditUser = (user: UserManagement) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-4 text-ocean-300">Cargando usuarios...</div>;
  }

  return (
    <>
      <div className="rounded-md border border-ocean-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-ocean-900">
              <TableHead className="text-ocean-200">Nombre</TableHead>
              <TableHead className="text-ocean-200">Email</TableHead>
              <TableHead className="text-ocean-200">Rol</TableHead>
              <TableHead className="text-ocean-200">Centro</TableHead>
              <TableHead className="text-ocean-200">Estado</TableHead>
              <TableHead className="text-ocean-200">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="bg-ocean-950/50 hover:bg-ocean-900/50">
                <TableCell className="text-white">{user.full_name || 'Sin nombre'}</TableCell>
                <TableCell className="text-ocean-300">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </Badge>
                </TableCell>
                <TableCell className="text-ocean-300">
                  {user.center?.name || 'Sin centro'}
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? 'default' : 'destructive'}>
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditUser(user)}
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

      <UserEditDialog
        user={selectedUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
};
