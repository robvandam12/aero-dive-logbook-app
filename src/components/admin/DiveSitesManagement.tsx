
import { useState } from "react";
import { useDiveSites } from "@/hooks/useDiveSites";
import { DiveSiteForm } from "./DiveSiteForm";
import { DiveSiteFormValues } from "@/lib/schemas";
import { Tables } from "@/integrations/supabase/types";
import { useDiveSiteMutations } from "@/hooks/useDiveSiteMutations";
import { DiveSitesTable } from "./DiveSitesTable";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle } from "lucide-react";

export const DiveSitesManagement = () => {
  const { data: diveSites, isLoading, isError } = useDiveSites();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedDiveSite, setSelectedDiveSite] = useState<Tables<'dive_sites'> | null>(null);
  const [diveSiteToDelete, setDiveSiteToDelete] = useState<Tables<'dive_sites'> | null>(null);
  
  const closeAllModals = () => {
    setIsDialogOpen(false);
    setSelectedDiveSite(null);
    setIsAlertOpen(false);
    setDiveSiteToDelete(null);
  }

  const { createMutation, updateMutation, deleteMutation } = useDiveSiteMutations({
    onSuccess: closeAllModals,
    onError: closeAllModals
  });

  const handleOpenDialog = (diveSite: Tables<'dive_sites'> | null = null) => {
    setSelectedDiveSite(diveSite);
    setIsDialogOpen(true);
  };

  const handleOpenAlert = (diveSite: Tables<'dive_sites'>) => {
    setDiveSiteToDelete(diveSite);
    setIsAlertOpen(true);
  };
  
  const handleSubmit = (values: DiveSiteFormValues) => {
    if (selectedDiveSite) {
      updateMutation.mutate({ id: selectedDiveSite.id, values });
    } else {
      createMutation.mutate({ values });
    }
  };
  
  const handleDelete = () => {
    if (diveSiteToDelete) {
      deleteMutation.mutate(diveSiteToDelete.id);
    }
  };
  
  return (
    <Card className="bg-transparent border-none text-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestionar Puntos de Buceo</CardTitle>
            <CardDescription className="text-ocean-300">
              Añade, edita o elimina los puntos de buceo registrados.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedDiveSite(null);
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="bg-ocean-gradient hover:opacity-90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Punto
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader>
                <DialogTitle className="text-white">{selectedDiveSite ? 'Editar' : 'Añadir'} Punto de Buceo</DialogTitle>
              </DialogHeader>
              <DiveSiteForm
                onSubmit={handleSubmit}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
                initialData={selectedDiveSite}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <DiveSitesTable
          diveSites={diveSites}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleOpenDialog}
          onDelete={handleOpenAlert}
        />
      </CardContent>
      <AlertDialog open={isAlertOpen} onOpenChange={(open) => {
        setIsAlertOpen(open);
        if (!open) setDiveSiteToDelete(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el punto de buceo <span className="font-bold text-white">{diveSiteToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
