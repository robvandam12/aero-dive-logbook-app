import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";

export const usePDFPreview = (diveLog?: DiveLogWithFullDetails) => {
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [fullDiveLog, setFullDiveLog] = useState<DiveLogWithFullDetails | null>(null);

  const handlePreview = async (diveLogId: string) => {
    setIsLoadingPreview(true);
    try {
      // If we already have the dive log data, use it directly
      if (diveLog) {
        setFullDiveLog(diveLog);
        return;
      }

      // Otherwise, try to fetch from the edge function (fallback)
      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: { diveLogId, preview: true },
      });

      if (error) {
        console.log("Edge function not available, using existing dive log data");
        // Fallback to using existing data if available
        if (diveLog) {
          setFullDiveLog(diveLog);
        }
        return;
      }

      if (data.success && data.diveLog) {
        setFullDiveLog(data.diveLog);
      }
    } catch (error) {
      console.error('Error previewing PDF:', error);
      // Fallback to using existing data
      if (diveLog) {
        setFullDiveLog(diveLog);
      }
    } finally {
      setIsLoadingPreview(false);
    }
  };

  return {
    isLoadingPreview,
    fullDiveLog,
    handlePreview
  };
};
