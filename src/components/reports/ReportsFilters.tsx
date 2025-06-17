
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
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
  onCenterChange,
}: ReportsFiltersProps) => {
  const { data: centers } = useCenters();

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white">Filtros de Reporte</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        {/* Selector de Centro */}
        <div className="flex-1">
          <label className="text-sm font-medium text-ocean-300 mb-2 block">
            Centro de Buceo
          </label>
          <Select value={selectedCenter} onValueChange={onCenterChange}>
            <SelectTrigger className="bg-ocean-900/50 border-ocean-700 text-white">
              <SelectValue placeholder="Todos los centros" />
            </SelectTrigger>
            <SelectContent className="bg-ocean-900 border-ocean-700">
              <SelectItem value="all" className="text-white">Todos los centros</SelectItem>
              {centers?.map((center) => (
                <SelectItem key={center.id} value={center.id} className="text-white">
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fecha Desde */}
        <div className="flex-1">
          <label className="text-sm font-medium text-ocean-300 mb-2 block">
            Fecha Desde
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-ocean-900/50 border-ocean-700 text-white",
                  !dateRange.from && "text-ocean-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  format(dateRange.from, "PPP", { locale: es })
                ) : (
                  <span>Seleccionar fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-ocean-900 border-ocean-700" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => onDateRangeChange({ ...dateRange, from: date })}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                className="text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Fecha Hasta */}
        <div className="flex-1">
          <label className="text-sm font-medium text-ocean-300 mb-2 block">
            Fecha Hasta
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-ocean-900/50 border-ocean-700 text-white",
                  !dateRange.to && "text-ocean-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? (
                  format(dateRange.to, "PPP", { locale: es })
                ) : (
                  <span>Seleccionar fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-ocean-900 border-ocean-700" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => onDateRangeChange({ ...dateRange, to: date })}
                disabled={(date) =>
                  date > new Date() || 
                  date < new Date("1900-01-01") ||
                  (dateRange.from && date < dateRange.from)
                }
                initialFocus
                className="text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Botón Limpiar Filtros */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => {
              onDateRangeChange({});
              onCenterChange('all');
            }}
            className="border-ocean-700 text-ocean-300 hover:bg-ocean-800"
          >
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
