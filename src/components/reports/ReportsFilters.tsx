
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useCenters } from "@/hooks/useCenters";

interface ReportsFiltersProps {
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  selectedCenter: string;
  onCenterChange: (center: string) => void;
}

export const ReportsFilters = ({
  dateRange,
  onDateRangeChange,
  selectedCenter,
  onCenterChange
}: ReportsFiltersProps) => {
  const { data: centers = [] } = useCenters();

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {/* Selector de Rango de Fechas */}
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-ocean-700 text-ocean-300">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: es })
                    )
                  ) : (
                    "Seleccionar fechas"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-ocean-900 border-ocean-700" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => onDateRangeChange(range || {})}
                  numberOfMonths={2}
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Selector de Centro */}
          <Select value={selectedCenter} onValueChange={onCenterChange}>
            <SelectTrigger className="w-[200px] bg-ocean-950/50 border-ocean-700 text-white">
              <SelectValue placeholder="Todos los centros" />
            </SelectTrigger>
            <SelectContent className="bg-ocean-900 border-ocean-700 text-white">
              <SelectItem value="all">Todos los centros</SelectItem>
              {centers.map((center) => (
                <SelectItem key={center.id} value={center.id}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Botón para limpiar filtros */}
          <Button 
            variant="outline" 
            onClick={() => {
              onDateRangeChange({});
              onCenterChange('all');
            }}
            className="border-ocean-700 text-ocean-300"
          >
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
