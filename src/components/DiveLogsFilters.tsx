
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useCenters } from "@/hooks/useCenters";

interface DiveLogsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  centerFilter: string;
  onCenterFilterChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const DiveLogsFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  centerFilter,
  onCenterFilterChange,
  hasActiveFilters,
  onClearFilters,
}: DiveLogsFiltersProps) => {
  const { data: centersData } = useCenters();
  const centers = centersData || [];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-400 w-4 h-4" />
        <Input
          placeholder="Buscar bitácoras..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-ocean-950/50 border-ocean-700 text-white placeholder:text-ocean-400"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ocean-400" />
          <span className="text-ocean-300 text-sm">Filtros:</span>
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[140px] bg-ocean-950/50 border-ocean-700 text-white">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-ocean-950 border-ocean-700">
            <SelectItem value="all" className="text-white">Todos</SelectItem>
            <SelectItem value="draft" className="text-white">Borradores</SelectItem>
            <SelectItem value="signed" className="text-white">Firmadas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={centerFilter} onValueChange={onCenterFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-ocean-950/50 border-ocean-700 text-white">
            <SelectValue placeholder="Centro" />
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

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
};
