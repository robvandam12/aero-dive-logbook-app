
import { DiveLogsList } from "@/components/DiveLogsList";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ExportActionsExtended } from "@/components/ExportActionsExtended";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Suspense, useState } from "react";
import { useCenters } from "@/hooks/useCenters";

const AllDiveLogsPage = () => {
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const { data: centersData } = useCenters();
  const centers = centersData || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#6555FF] to-purple-700 bg-clip-text text-transparent">
            Gestión de Bitácoras
          </h2>
          <p className="text-ocean-300">Administra todas tus bitácoras de buceo</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Filtros y Exportación */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Filtros de Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-ocean-200 text-sm mb-2 block">Fecha Desde</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-ocean-700 text-ocean-300",
                            !dateRange.from && "text-muted-foreground"
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
                      <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                          initialFocus
                          className="bg-slate-900"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex-1">
                    <label className="text-ocean-200 text-sm mb-2 block">Fecha Hasta</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-ocean-700 text-ocean-300",
                            !dateRange.to && "text-muted-foreground"
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
                      <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                          initialFocus
                          className="bg-slate-900"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-ocean-200 text-sm mb-2 block">Centro de Cultivo</label>
                    <Select value={selectedCenter} onValueChange={setSelectedCenter}>
                      <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                        <SelectValue placeholder="Seleccionar centro" />
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

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDateRange({});
                        setSelectedCenter('all');
                      }}
                      className="border-ocean-700 text-ocean-300 hover:bg-ocean-800"
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <ExportActionsExtended 
            showMultipleExport={true}
            dateRange={dateRange}
            selectedCenter={selectedCenter}
          />
        </div>

        {/* Lista de Bitácoras */}
        <Suspense fallback={<LoadingSkeleton type="table" count={5} />}>
          <DiveLogsList 
            dateRange={dateRange}
            selectedCenter={selectedCenter}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default AllDiveLogsPage;
