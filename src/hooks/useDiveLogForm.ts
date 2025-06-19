
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diveLogSchema, DiveLogFormValues } from "@/lib/schemas";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { useEffect } from "react";

// Parse weather conditions for edit mode
const parseWeatherConditions = (conditions: string | null) => {
  if (!conditions) return { weather_condition: undefined, wind_knots: undefined, wave_height_meters: undefined };
  
  const windMatch = conditions.match(/Viento:\s*(\d+)/);
  const waveMatch = conditions.match(/Oleaje:\s*(\d+\.?\d*)/);
  const weatherMatch = conditions.split(',')[0].trim();
  
  return {
    weather_condition: weatherMatch !== 'N/A' ? weatherMatch : undefined,
    wind_knots: windMatch ? parseInt(windMatch[1]) : undefined,
    wave_height_meters: waveMatch ? parseFloat(waveMatch[1]) : undefined
  };
};

const getDefaultValues = (isEditMode: boolean, diveLog?: DiveLogWithFullDetails): Partial<DiveLogFormValues> => {
  if (isEditMode && diveLog) {
    const weather = parseWeatherConditions(diveLog.weather_conditions);
    const diversManifest = Array.isArray(diveLog.divers_manifest) 
      ? diveLog.divers_manifest as any[]
      : [];

    return {
      log_date: diveLog.log_date,
      center_id: diveLog.center_id,
      supervisor_name: diveLog.supervisor_name || '',
      supervisor_license: '',
      center_manager: '',
      center_assistant: '',
      dive_site_id: diveLog.dive_site_id,
      boat_id: diveLog.boat_id || '',
      weather_condition: weather.weather_condition as any,
      wind_knots: weather.wind_knots,
      wave_height_meters: weather.wave_height_meters,
      work_type: diveLog.work_type as any,
      work_details: diveLog.work_details || '',
      divers_manifest: diversManifest.length > 0 ? diversManifest : [{ 
        name: '', 
        license: '', 
        role: 'buzo', 
        working_depth: 0,
        standard_depth: true,
        start_time: '',
        end_time: '',
        dive_time: '',
        work_performed: ''
      }],
      observations: diveLog.observations || '',
      departure_time: diveLog.departure_time || '',
      arrival_time: diveLog.arrival_time || '',
      signature_data: diveLog.signature_url || undefined
    };
  }

  return {
    divers_manifest: [{ 
      name: '', 
      license: '', 
      role: 'buzo', 
      working_depth: 0,
      standard_depth: true,
      start_time: '',
      end_time: '',
      dive_time: '',
      work_performed: ''
    }],
    log_date: new Date().toISOString().split('T')[0],
    center_id: '',
    dive_site_id: '',
    supervisor_name: '',
    supervisor_license: '',
    center_manager: '',
    center_assistant: '',
  };
};

export const useDiveLogForm = (isEditMode: boolean, diveLog?: DiveLogWithFullDetails) => {
  const methods = useForm<DiveLogFormValues>({
    resolver: zodResolver(diveLogSchema),
    defaultValues: getDefaultValues(isEditMode, diveLog)
  });

  const { reset } = methods;

  // Reset form when diveLog changes (edit mode)
  useEffect(() => {
    if (isEditMode && diveLog) {
      reset(getDefaultValues(isEditMode, diveLog));
    }
  }, [diveLog, isEditMode, reset]);

  return methods;
};
