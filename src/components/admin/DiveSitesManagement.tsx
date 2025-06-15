
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDiveSites } from "@/hooks/useDiveSites";
import { useToast } from "@/components/ui/use-toast";
import { DiveSiteForm } from "./DiveSiteForm";
import { DiveSiteFormValues } from "@/lib/schemas";
import { Tables } from "@/integrations/supabase/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

export const DiveSitesManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: diveSites, isLoading, isError } = useDiveSites();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedDiveSite, setSelectedDiveSite] = useState<Tables<'dive_sites'> | null>(null);
  const [diveSiteToDelete, setDiveSiteToDelete] = useState<Tables<'dive_sites'> | null>(null);

  const upsertMutation = useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: DiveSiteFormValues }) => {
      if (id) {
        const { data, error } = await supabase.from('dive_sites').update(values).eq('id', id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from('dive_sites').insert(values).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast({ title: "Éxito", description: `Punto de buceo ${selectedDiveSite ? 'actualizado' : 'creado'} con éxito.` });
      queryClient.invalidateQueries({ queryKey: ['dive_sites'] });
      setIsDialogOpen(false);
      setSelectedDiveSite(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('dive_sites').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Éxito", description: "Punto de buceo eliminado." });
      queryClient.invalidateQueries({ queryKey: ['dive_sites'] });
      setDiveSiteToDelete(null);
      setIsAlertOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setDiveSiteToDelete(null);
      setIsAlertOpen(false);
    }
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
    upsertMutation.mutate({ id: selectedDiveSite?.id, values });
  };
  
  const handleDelete = () => {
    if (diveSiteToDelete) {
      deleteMutation.mutate(diveSiteToDelete.id);
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i} className="border-b-0">
          <TableCell colSpan={3}><Skeleton className="h-8 w-full" /></TableCell>
        </TableRow>
      ));
    }
    if (isError) {
      return <TableRow><TableCell colSpan={3} className="text-center text-red-500 py-8">Error al cargar los datos.</TableCell></TableRow>;
    }
    if (!diveSites || diveSites.length === 0) {
      return <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No hay puntos de buceo registrados.</TableCell></TableRow>;
    }
    return diveSites.map((site) => (
      <TableRow key={site.id} className="border-slate-800 hover:bg-ocean-950/30">
        <TableCell className="font-medium text-white">{site.name}</TableCell>
        <TableCell className="text-muted-foreground">{site.location || 'N/A'}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-ocean-300 hover:text-white" onClick={() => handleOpenDialog(site)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-500" onClick={() => handleOpenAlert(site)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
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
                isSubmitting={upsertMutation.isPending}
                initialData={selectedDiveSite}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-ocean-800">
          <Table>
            <TableHeader>
              <TableRow className="border-ocean-800 hover:bg-transparent">
                <TableHead className="text-ocean-300">Nombre</TableHead>
                <TableHead className="text-ocean-300">Ubicación / Descripción</TableHead>
                <TableHead className="text-right text-ocean-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableContent()}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el punto de buceo <span className="font-bold text-white">{diveSiteToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDiveSiteToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
