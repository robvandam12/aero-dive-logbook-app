
import { z } from "zod";

export const diverSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  license: z.string().min(1, "Número de matrícula es requerido"),
  role: z.enum(['buzo', 'asistente', 'supervisor_equipo'], {
    required_error: "Rol es requerido",
  }),
  working_depth: z.number().min(0, "La profundidad debe ser positiva"),
  standard_depth: z.boolean().optional().default(true),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  dive_time: z.string().optional(),
});

export const diveLogSchema = z.object({
  log_date: z.string().min(1, "Fecha es requerida"),
  center_id: z.string().min(1, "Centro de cultivo es requerido"),
  supervisor_name: z.string().min(1, "Supervisor de buceo es requerido"),
  supervisor_license: z.string().optional(),
  center_manager: z.string().optional(),
  center_assistant: z.string().optional(),
  dive_site_id: z.string().min(1, "Sitio de buceo es requerido"),
  boat_id: z.string().optional(),
  departure_time: z.string().optional(),
  arrival_time: z.string().optional(),
  weather_condition: z.enum(['soleado', 'nublado', 'lluvioso', 'ventoso', 'despejado'], {
    required_error: "Condición climática es requerida",
  }).optional(),
  wind_knots: z.number().min(0).max(100).optional(),
  wave_height_meters: z.number().min(0).max(20).optional(),
  compressor1_serial: z.string().optional(),
  compressor2_serial: z.string().optional(),
  work_type: z.enum(['MANTENCIÓN', 'INSPECCIÓN', 'REPARACIÓN', 'LIMPIEZA', 'INSTALACIÓN'], {
    required_error: "Tipo de trabajo es requerido",
  }).optional(),
  work_details: z.string().optional(),
  boat_id_work: z.string().optional(),
  divers_manifest: z.array(diverSchema).min(1, "Debe agregar al menos un buzo"),
  observations: z.string().optional(),
  signature_data: z.string().optional(),
});

export const centerSchema = z.object({
  name: z.string().min(1, "Nombre del centro es requerido"),
  location: z.string().optional(),
});

export const boatSchema = z.object({
  name: z.string().min(1, "Nombre de la embarcación es requerido"),
  registration_number: z.string().min(1, "Número de matrícula es requerido"),
});

export const diveSiteSchema = z.object({
  name: z.string().min(1, "Nombre del punto de buceo es requerido"),
  location: z.string().optional(),
});

export type DiverFormValues = z.infer<typeof diverSchema>;
export type DiveLogFormValues = z.infer<typeof diveLogSchema>;
export type CenterFormValues = z.infer<typeof centerSchema>;
export type BoatFormValues = z.infer<typeof boatSchema>;
export type DiveSiteFormValues = z.infer<typeof diveSiteSchema>;
