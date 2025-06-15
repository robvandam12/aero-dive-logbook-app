
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, X } from "lucide-react";
import { SearchFilters } from "@/hooks/useAdvancedSearch";
import { useCenters } from "@/hooks/useCenters";

interface AdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
}

export const AdvancedSearchDialog = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onClearFilters,
}: AdvancedSearchDialogProps) => {
  const { data: centersData } = useCenters();
  const centers = centersData || [];
  
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    onClearFilters();
    setLocalFilters({
      search: '',
      status: 'all',
      centerName: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-ocean-950 border-ocean-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Búsqueda Avanzada
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="search" className="text-ocean-200">
              Búsqueda general
            </Label>
            <Input
              id="search"
              placeholder="Buscar en centros, sitios de buceo, embarcaciones..."
              value={localFilters.search}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
              className="bg-ocean-900 border-ocean-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-ocean-200">Estado</Label>
              <Select 
                value={localFilters.status} 
                onValueChange={(value: 'all' | 'draft' | 'signed') => 
                  setLocalFilters(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-ocean-900 border-ocean-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ocean-950 border-ocean-700">
                  <SelectItem value="all" className="text-white">Todos</SelectItem>
                  <SelectItem value="draft" className="text-white">Borradores</SelectItem>
                  <SelectItem value="signed" className="text-white">Firmadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-ocean-200">Centro</Label>
              <Select 
                value={localFilters.centerName} 
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, centerName: value }))}
              >
                <SelectTrigger className="bg-ocean-900 border-ocean-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ocean-950 border-ocean-700">
                  <SelectItem value="all" className="text-white">Todos los centros</SelectItem>
                  {centers.map((center) => (
                    <SelectItem key={center.id} value={center.name} className="text-white">
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-ocean-200">Fecha desde</Label>
              <Input
                type="date"
                value={localFilters.dateFrom || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="bg-ocean-900 border-ocean-700 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-ocean-200">Fecha hasta</Label>
              <Input
                type="date"
                value={localFilters.dateTo || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="bg-ocean-900 border-ocean-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-ocean-200">Ordenar por</Label>
              <Select 
                value={localFilters.sortBy} 
                onValueChange={(value: 'date' | 'center' | 'status') => 
                  setLocalFilters(prev => ({ ...prev, sortBy: value }))
                }
              >
                <SelectTrigger className="bg-ocean-900 border-ocean-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ocean-950 border-ocean-700">
                  <SelectItem value="date" className="text-white">Fecha</SelectItem>
                  <SelectItem value="center" className="text-white">Centro</SelectItem>
                  <SelectItem value="status" className="text-white">Estado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-ocean-200">Orden</Label>
              <Select 
                value={localFilters.sortOrder} 
                onValueChange={(value: 'asc' | 'desc') => 
                  setLocalFilters(prev => ({ ...prev, sortOrder: value }))
                }
              >
                <SelectTrigger className="bg-ocean-900 border-ocean-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ocean-950 border-ocean-700">
                  <SelectItem value="desc" className="text-white">Descendente</SelectItem>
                  <SelectItem value="asc" className="text-white">Ascendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar todo
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-ocean-gradient hover:opacity-90"
            >
              <Filter className="w-4 h-4 mr-2" />
              Aplicar filtros
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
