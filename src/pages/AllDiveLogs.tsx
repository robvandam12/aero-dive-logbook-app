
import { DiveLogsList } from "@/components/DiveLogsList";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllDiveLogsPage = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#6555FF] to-purple-700 bg-clip-text text-transparent">
            Gestión de Bitácoras
          </h2>
          <p className="text-ocean-300">Administra todas tus bitácoras de buceo</p>
        </div>
        
        {/* Date Filter and New Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal border-ocean-700 text-ocean-300",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, "PP", { locale: es })} - ${format(dateRange.to, "PP", { locale: es })}`
                    ) : (
                      format(dateRange.from, "PP", { locale: es })
                    )
                  ) : (
                    <span>Filtrar por fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                <CalendarComponent
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    setDateRange({
                      from: range?.from,
                      to: range?.to,
                    });
                  }}
                  initialFocus
                  className="bg-slate-900"
                />
              </PopoverContent>
            </Popover>
            
            {(dateRange.from || dateRange.to) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateRange({})}
                className="text-ocean-400 hover:text-ocean-300"
              >
                Limpiar
              </Button>
            )}
          </div>

          <Button onClick={() => navigate("/new-dive-log")} className="bg-ocean-gradient hover:opacity-90">
            <FileText className="w-4 h-4 mr-2" />
            Nueva Bitácora
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Lista de Bitácoras */}
        <Suspense fallback={<LoadingSkeleton type="table" count={5} />}>
          <DiveLogsList 
            dateRange={dateRange}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default AllDiveLogsPage;
