
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";

const invalidateSchema = z.object({
  reason: z.string().min(10, "La razón debe tener al menos 10 caracteres"),
});

type InvalidateForm = z.infer<typeof invalidateSchema>;

interface InvalidateDiveLogDialogProps {
  diveLogId: string;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export const InvalidateDiveLogDialog = ({ 
  diveLogId, 
  onSuccess, 
  children 
}: InvalidateDiveLogDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<InvalidateForm>({
    resolver: zodResolver(invalidateSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data: InvalidateForm) => {
    try {
      setIsLoading(true);

      // Invalidar la bitácora
      const { error: updateError } = await supabase
        .from('dive_logs')
        .update({
          status: 'invalidated',
          invalidation_reason: data.reason,
          invalidated_by: user?.id,
          invalidated_at: new Date().toISOString(),
        })
        .eq('id', diveLogId);

      if (updateError) throw updateError;

      // Registrar actividad
      const { error: logError } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user?.id || '',
          action: 'invalidate_dive_log',
          dive_log_id: diveLogId,
          details: {
            reason: data.reason,
            timestamp: new Date().toISOString(),
          },
        });

      if (logError) console.warn('Error logging activity:', logError);

      toast({
        title: "Bitácora invalidada",
        description: "La bitácora ha sido invalidada correctamente",
      });

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error invalidating dive log:', error);
      toast({
        title: "Error",
        description: "No se pudo invalidar la bitácora",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
            <XCircle className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-ocean-950 border-ocean-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            Invalidar Bitácora
          </DialogTitle>
          <DialogDescription className="text-ocean-300">
            Esta acción invalidará permanentemente la bitácora. Proporciona una razón detallada.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-ocean-200">Razón de invalidación</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe detalladamente la razón por la cual se invalida esta bitácora..."
                      className="bg-ocean-900/50 border-ocean-700 text-white"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-ocean-700 text-ocean-300"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Invalidar Bitácora
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
