
import { DiveLogsList } from "@/components/DiveLogsList";
import { PageHeader } from "@/components/PageHeader";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ExportActionsExtended } from "@/components/ExportActionsExtended";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Suspense, useState } from "react";

const AllDiveLogsPage = () => {
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-4 mb-6 px-8 pt-8">
        <SidebarTrigger />
        <PageHeader title="Mis Bitácoras" />
      </div>
      <div className="px-8 pb-8 space-y-6">
        {/* Filtros y Exportación */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Filtros de Fecha
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <div>
                  <label className="text-ocean-200 text-sm mb-2 block">Fecha Desde</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal border-ocean-700 text-ocean-300",
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
                
                <div>
                  <label className="text-ocean-200 text-sm mb-2 block">Fecha Hasta</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal border-ocean-700 text-ocean-300",
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

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setDateRange({})}
                    className="border-ocean-700 text-ocean-300 hover:bg-ocean-800"
                  >
                    Limpiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <ExportActionsExtended 
            showMultipleExport={true}
            dateRange={dateRange}
          />
        </div>

        {/* Lista de Bitácoras */}
        <Suspense fallback={<LoadingSkeleton type="table" count={5} />}>
          <DiveLogsList />
        </Suspense>
      </div>
    </div>
  );
};

export default AllDiveLogsPage;
