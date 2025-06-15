
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { useCenters } from "@/hooks/useCenters";
import { useCenterMutations } from "@/hooks/useCenterMutations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CenterForm } from "./CenterForm";
import { CenterFormValues } from "@/lib/schemas";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Center = Tables<'centers'>;

export const CentersManagement = () => {
  const { data: centers, isLoading, isError, error } = useCenters();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [centerToEdit, setCenterToEdit] = useState<Center | undefined>(undefined);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [centerToDelete, setCenterToDelete] = useState<Center | null>(null);

  const closeAllModals = () => {
    setIsFormOpen(false);
    setCenterToEdit(undefined);
    setIsAlertOpen(false);
    setCenterToDelete(null);
  };

  const { createMutation, updateMutation, deleteMutation } = useCenterMutations({
    onSuccess: closeAllModals,
  });

  const handleOpenCreate = () => {
    setCenterToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (center: Center) => {
    setCenterToEdit(center);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (center: Center) => {
    setCenterToDelete(center);
    setIsAlertOpen(true);
  };
  
  const handleFormSubmit = (data: CenterFormValues) => {
    if (centerToEdit) {
      updateMutation.mutate({ id: centerToEdit.id, values: data });
    } else {
      createMutation.mutate({ values: data });
    }
  };

  const handleDeleteConfirm = () => {
    if (centerToDelete) {
      deleteMutation.mutate(centerToDelete.id);
    }
  };

  return (
    <Card className="bg-transparent border-none text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Gestionar Centros de Buceo</CardTitle>
            <CardDescription className="text-ocean-300">
              Añade, edita o elimina los centros de buceo disponibles en el sistema.
            </CardDescription>
        </div>
        <Button onClick={handleOpenCreate} className="bg-ocean-gradient hover:opacity-90"><PlusCircle className="mr-2 h-4 w-4" />Añadir Centro</Button>
      </CardHeader>
      <CardContent>
        <div className="border border-ocean-700/30 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-ocean-700/30 hover:bg-transparent">
                <TableHead className="text-ocean-300">Nombre</TableHead>
                <TableHead className="text-ocean-300">Ubicación</TableHead>
                <TableHead className="text-right text-ocean-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="border-ocean-700/30">
                    <TableCell><Skeleton className="h-4 w-48 bg-ocean-700/50" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48 bg-ocean-700/50" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto bg-ocean-700/50" /></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-red-400 py-8">
                    Error al cargar los centros: {error.message}
                  </TableCell>
                </TableRow>
              ) : centers?.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={3} className="text-center text-ocean-300 py-8">
                    No hay centros de buceo registrados.
                  </TableCell>
                </TableRow>
              ) : (
                centers?.map((center) => (
                  <TableRow key={center.id} className="border-ocean-700/30 hover:bg-ocean-950/30">
                    <TableCell className="font-medium text-white">{center.name}</TableCell>
                    <TableCell className="text-muted-foreground">{center.location}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-ocean-300 hover:text-white">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass">
                          <DropdownMenuItem onClick={() => handleOpenEdit(center)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenDeleteDialog(center)} className="cursor-pointer text-rose-400 focus:text-rose-400 focus:bg-red-500/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CenterForm 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onSubmit={handleFormSubmit}
        defaultValues={centerToEdit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="glass text-white border-ocean-700/30">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-ocean-300">
              Esta acción no se puede deshacer. Se eliminará permanentemente el centro de buceo
              <span className="font-bold text-white"> {centerToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
