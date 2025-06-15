
import { z } from 'zod';

export const diverSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  license: z.string().min(1, "Matrícula es requerida"),
  role: z.enum(["buzo", "buzo-emergencia", "supervisor"], { errorMap: () => ({ message: "Puesto es requerido" }) }),
  working_depth: z.coerce.number().positive("Profundidad debe ser positiva"),
});

export const diveLogSchema = z.object({
  log_date: z.string({ required_error: "Fecha es requerida." }).min(1, "Fecha es requerida."),
  center_id: z.string({ required_error: "Centro es requerido." }).min(1, "Centro es requerido."),
  supervisor_name: z.string().min(1, "Supervisor es requerido"),
  dive_site_id: z.string({ required_error: "Punto de buceo es requerido." }).min(1, "Punto de buceo es requerido."),
  
  weather_condition: z.enum(["bueno", "regular", "malo"]).optional(),
  wind_knots: z.coerce.number().optional(),
  wave_height_meters: z.coerce.number().optional(),
  compressor1_serial: z.string().optional(),
  compressor2_serial: z.string().optional(),
  
  divers_manifest: z.array(diverSchema).min(1, "Se requiere al menos un buzo."),

  work_type: z.string().optional(),
  boat_id: z.string().optional(),
  work_details: z.string().min(1, "Detalle de trabajos es requerido."),
  
  observations: z.string().optional(),
  signature_data: z.string().optional(),
});

export type DiveLogFormValues = z.infer<typeof diveLogSchema>;
