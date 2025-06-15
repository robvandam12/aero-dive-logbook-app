
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { useCenters } from "@/hooks/useCenters";
import { useBoats } from "@/hooks/useBoats";
import { useBoatMutations } from "@/hooks/useBoatMutations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BoatForm, BoatFormData } from "./BoatForm";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Boat = Tables<'boats'>;

export const BoatsManagement = () => {
  const [selectedCenterId, setSelectedCenterId] = useState<string | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [boatToEdit, setBoatToEdit] = useState<Boat | undefined>(undefined);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [boatToDelete, setBoatToDelete] = useState<Boat | null>(null);

  const { data: centers, isLoading: isLoadingCenters } = useCenters();
  const { data: boats, isLoading: isLoadingBoats, isError, error } = useBoats(selectedCenterId);
  
  const { createMutation, updateMutation, deleteMutation } = useBoatMutations({
    centerId: selectedCenterId,
    onSuccess: () => {
      setIsFormOpen(false);
      setBoatToEdit(undefined);
      setIsAlertOpen(false);
      setBoatToDelete(null);
    }
  });

  const handleOpenCreate = () => {
    setBoatToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (boat: Boat) => {
    setBoatToEdit(boat);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (boat: Boat) => {
    setBoatToDelete(boat);
    setIsAlertOpen(true);
  };
  
  const handleFormSubmit = (data: BoatFormData) => {
    if (!selectedCenterId) {
      return;
    }
    if (boatToEdit) {
      updateMutation.mutate({ id: boatToEdit.id, values: data });
    } else {
      createMutation.mutate({ values: { center_id: selectedCenterId, ...data } });
    }
  };

  const handleDeleteConfirm = () => {
    if (boatToDelete) {
      deleteMutation.mutate(boatToDelete.id);
    }
  };
  
  return (
    <Card className="bg-transparent border-none text-white">
      <CardHeader>
        <CardTitle>Gestionar Embarcaciones</CardTitle>
        <CardDescription className="text-ocean-300">
          Añade, edita o elimina las embarcaciones asociadas a cada centro.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-64">
            <Select onValueChange={setSelectedCenterId} value={selectedCenterId}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Selecciona un centro de buceo" />
              </SelectTrigger>
              <SelectContent className="glass">
                {isLoadingCenters ? (
                  <SelectItem value="loading" disabled>Cargando centros...</SelectItem>
                ) : (
                  centers?.map(center => (
                    <SelectItem key={center.id} value={center.id}>{center.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleOpenCreate} disabled={!selectedCenterId}>
            <PlusCircle className="mr-2" />Añadir Embarcación
          </Button>
        </div>
        
        <div className="border border-ocean-700/30 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-ocean-700/30">
                <TableHead className="text-white">Nombre</TableHead>
                <TableHead className="text-white">Matrícula</TableHead>
                <TableHead className="text-right text-white">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingBoats ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="border-ocean-700/30">
                    <TableCell><Skeleton className="h-4 w-48 bg-ocean-700/50" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 bg-ocean-700/50" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto bg-ocean-700/50" /></TableCell>
                  </TableRow>
                ))
              ) : !selectedCenterId ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-ocean-300 py-8">
                    Por favor, selecciona un centro de buceo para ver sus embarcaciones.
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-red-400 py-8">
                    Error al cargar las embarcaciones: {error.message}
                  </TableCell>
                </TableRow>
              ) : boats?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-ocean-300 py-8">
                    No hay embarcaciones registradas para este centro.
                  </TableCell>
                </TableRow>
              ) : (
                boats?.map((boat) => (
                  <TableRow key={boat.id} className="border-ocean-700/30">
                    <TableCell className="font-medium">{boat.name}</TableCell>
                    <TableCell>{boat.registration_number}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass">
                          <DropdownMenuItem onClick={() => handleOpenEdit(boat)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenDeleteDialog(boat)} className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10">
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

      <BoatForm 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onSubmit={handleFormSubmit}
        defaultValues={boatToEdit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="glass text-white border-ocean-700/30">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-ocean-300">
              Esta acción no se puede deshacer. Se eliminará permanentemente la embarcación
              <span className="font-bold text-white"> {boatToDelete?.name}</span>.
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
