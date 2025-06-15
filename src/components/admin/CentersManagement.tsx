
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { useCenters } from "@/hooks/useCenters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CenterForm, CenterFormData } from "./CenterForm";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Center = Tables<'centers'>;

// --- Funciones de mutación ---
const createCenterFn = async (center: CenterFormData) => {
  const { error } = await supabase.from('centers').insert({ name: center.name, location: center.location });
  if (error) throw error;
};

const updateCenterFn = async (center: CenterFormData & { id: string }) => {
  const { error } = await supabase.from('centers').update({ name: center.name, location: center.location }).eq('id', center.id);
  if (error) throw error;
};

const deleteCenterFn = async (id: string) => {
  const { error } = await supabase.from('centers').delete().eq('id', id);
  if (error) throw error;
};

export const CentersManagement = () => {
  const queryClient = useQueryClient();
  const { data: centers, isLoading, isError, error } = useCenters();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [centerToEdit, setCenterToEdit] = useState<Center | undefined>(undefined);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [centerToDelete, setCenterToDelete] = useState<Center | null>(null);

  const { mutate: createCenter, isPending: isCreating } = useMutation({
    mutationFn: createCenterFn,
    onSuccess: () => {
      toast.success('Centro creado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      setIsFormOpen(false);
    },
    onError: (err) => toast.error(`Error al crear el centro: ${err.message}`),
  });

  const { mutate: updateCenter, isPending: isUpdating } = useMutation({
    mutationFn: updateCenterFn,
    onSuccess: () => {
      toast.success('Centro actualizado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      setIsFormOpen(false);
      setCenterToEdit(undefined);
    },
    onError: (err) => toast.error(`Error al actualizar el centro: ${err.message}`),
  });

  const { mutate: deleteCenter } = useMutation({
    mutationFn: deleteCenterFn,
    onSuccess: () => {
      toast.success('Centro eliminado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      setIsAlertOpen(false);
      setCenterToDelete(null);
    },
    onError: (err) => toast.error(`Error al eliminar el centro: ${err.message}`),
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
  
  const handleFormSubmit = (data: CenterFormData) => {
    if (centerToEdit) {
      updateCenter({ id: centerToEdit.id, ...data });
    } else {
      createCenter(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (centerToDelete) {
      deleteCenter(centerToDelete.id);
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
        <Button onClick={handleOpenCreate}><PlusCircle className="mr-2" />Añadir Centro</Button>
      </CardHeader>
      <CardContent>
        <div className="border border-ocean-700/30 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-ocean-700/30">
                <TableHead className="text-white">Nombre</TableHead>
                <TableHead className="text-white">Ubicación</TableHead>
                <TableHead className="text-right text-white">Acciones</TableHead>
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
                  <TableRow key={center.id} className="border-ocean-700/30">
                    <TableCell className="font-medium">{center.name}</TableCell>
                    <TableCell>{center.location}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass">
                          <DropdownMenuItem onClick={() => handleOpenEdit(center)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenDeleteDialog(center)} className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10">
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
        isPending={isCreating || isUpdating}
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
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
