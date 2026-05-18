export type WorkerStatus = 'presente' | 'ausente' | 'tardanza' | 'libre'
export type DocStatus = 'vigente' | 'por_vencer' | 'vencido'
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'problema'
export type TaskPriority = 'baja' | 'normal' | 'alta'
export type IncidentSeverity = 'bajo' | 'medio' | 'alto' | 'critico'
export type IncidentStatus = 'abierto' | 'en_revision' | 'cerrado'
export type UserRole = 'admin' | 'supervisor'
export type DocType = 'sctr' | 'examen_medico' | 'certificado' | 'contrato' | 'otro'

export interface Company {
  id: number
  nombre: string
  ruc: string
  plan: 'base' | 'premium'
}

export interface User {
  id: number
  company_id: number
  nombre: string
  email: string
  rol: UserRole
}

export interface Site {
  id: number
  company_id: number
  nombre: string
  direccion: string
  lat: number
  lng: number
  radio_metros: number
}

export interface Worker {
  id: number
  company_id: number
  nombre: string
  dni: string
  telefono: string
  cargo: string
  activo: boolean
  site_id: number | null
  status: WorkerStatus
  avatar_initials: string
}

export interface WorkerDocument {
  id: number
  worker_id: number
  tipo: DocType
  nombre: string
  archivo: string
  vencimiento: string
  status: DocStatus
}

export interface Checkin {
  id: number
  worker_id: number
  worker_nombre: string
  worker_cargo: string
  site_id: number
  site_nombre: string
  tipo: 'entrada' | 'salida'
  lat: number
  lng: number
  created_at: string
}

export interface TaskAssignment {
  worker_id: number
  worker_nombre: string
  estado: TaskStatus
  nota_worker?: string
}

export interface Task {
  id: number
  company_id: number
  site_id: number
  site_nombre: string
  supervisor_nombre: string
  titulo: string
  descripcion: string
  fecha: string
  prioridad: TaskPriority
  estado: TaskStatus
  assignments: TaskAssignment[]
}

export interface Incident {
  id: number
  company_id: number
  worker_id: number
  worker_nombre: string
  site_id: number
  site_nombre: string
  descripcion: string
  foto?: string
  lat: number
  lng: number
  severidad: IncidentSeverity
  estado: IncidentStatus
  revisado_por?: string
  created_at: string
}

export interface DashboardKPIs {
  presentes: number
  ausentes: number
  tardanzas: number
  total_workers: number
  incidentes_abiertos: number
  tareas_completadas: number
  tareas_total: number
  documentos_por_vencer: number
}

export interface AttendancePoint {
  dia: string
  presentes: number
  ausentes: number
}
