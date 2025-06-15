
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2 } from "lucide-react";

interface DiveSitesTableProps {
  diveSites: Tables<'dive_sites'>[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onEdit: (diveSite: Tables<'dive_sites'>) => void;
  onDelete: (diveSite: Tables<'dive_sites'>) => void;
}

const renderTableContent = ({ diveSites, isLoading, isError, onEdit, onDelete }: DiveSitesTableProps) => {
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
        <Button variant="ghost" size="icon" className="h-8 w-8 text-ocean-300 hover:text-white" onClick={() => onEdit(site)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-500" onClick={() => onDelete(site)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  ));
};

export const DiveSitesTable = (props: DiveSitesTableProps) => {
  return (
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
          {renderTableContent(props)}
        </TableBody>
      </Table>
    </div>
  );
};
