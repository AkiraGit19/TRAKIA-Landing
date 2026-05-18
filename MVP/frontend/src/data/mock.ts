import type {
  Company, User, Site, Worker, WorkerDocument,
  Checkin, Task, Incident, DashboardKPIs, AttendancePoint
} from '../types'

export const mockCompany: Company = {
  id: 1,
  nombre: 'Constructora Andina S.A.C.',
  ruc: '20512345678',
  plan: 'base',
}

export const mockUser: User = {
  id: 1,
  company_id: 1,
  nombre: 'Carlos Méndez',
  email: 'carlos@andina.pe',
  rol: 'admin',
}

export const mockSites: Site[] = [
  { id: 1, company_id: 1, nombre: 'Obra Miraflores', direccion: 'Av. Larco 820, Miraflores', lat: -12.1219, lng: -77.0284, radio_metros: 150 },
  { id: 2, company_id: 1, nombre: 'Obra San Isidro', direccion: 'Calle Los Libertadores 340, San Isidro', lat: -12.0931, lng: -77.0465, radio_metros: 100 },
  { id: 3, company_id: 1, nombre: 'Planta Ate', direccion: 'Av. Nicolas Ayllón 2300, Ate', lat: -12.0464, lng: -76.9605, radio_metros: 200 },
]

export const mockWorkers: Worker[] = [
  { id: 1, company_id: 1, nombre: 'Juan Huanca Quispe', dni: '45123890', telefono: '987654321', cargo: 'Operario', activo: true, site_id: 1, status: 'presente', avatar_initials: 'JH' },
  { id: 2, company_id: 1, nombre: 'Pedro Ccalli Mamani', dni: '43987654', telefono: '976543210', cargo: 'Soldador', activo: true, site_id: 1, status: 'presente', avatar_initials: 'PC' },
  { id: 3, company_id: 1, nombre: 'Luis Condori Flores', dni: '47654321', telefono: '965432109', cargo: 'Electricista', activo: true, site_id: 2, status: 'tardanza', avatar_initials: 'LC' },
  { id: 4, company_id: 1, nombre: 'Miguel Torres Salas', dni: '41234567', telefono: '954321098', cargo: 'Albañil', activo: true, site_id: 2, status: 'presente', avatar_initials: 'MT' },
  { id: 5, company_id: 1, nombre: 'Roberto Sánchez Lima', dni: '42345678', telefono: '943210987', cargo: 'Operario', activo: true, site_id: 1, status: 'presente', avatar_initials: 'RS' },
  { id: 6, company_id: 1, nombre: 'Ángel Quispe Huanca', dni: '48765432', telefono: '932109876', cargo: 'Carpintero', activo: true, site_id: 3, status: 'ausente', avatar_initials: 'AQ' },
  { id: 7, company_id: 1, nombre: 'Félix Ramos Díaz', dni: '46543219', telefono: '921098765', cargo: 'Gasfitero', activo: true, site_id: 3, status: 'presente', avatar_initials: 'FR' },
  { id: 8, company_id: 1, nombre: 'César Apaza Luna', dni: '40987654', telefono: '910987654', cargo: 'Operario', activo: false, site_id: null, status: 'libre', avatar_initials: 'CA' },
  { id: 9, company_id: 1, nombre: 'Raúl Flores Cusi', dni: '44321098', telefono: '909876543', cargo: 'Vigilante', activo: true, site_id: 1, status: 'presente', avatar_initials: 'RF' },
  { id: 10, company_id: 1, nombre: 'Jorge Mamani Ticona', dni: '45678901', telefono: '898765432', cargo: 'Soldador', activo: true, site_id: 2, status: 'ausente', avatar_initials: 'JM' },
]

export const mockDocuments: WorkerDocument[] = [
  { id: 1, worker_id: 1, tipo: 'sctr', nombre: 'SCTR Salud', archivo: 'sctr_huanca.pdf', vencimiento: '2026-06-10', status: 'vigente' },
  { id: 2, worker_id: 1, tipo: 'examen_medico', nombre: 'Examen Médico Anual', archivo: 'examen_huanca.pdf', vencimiento: '2026-05-25', status: 'por_vencer' },
  { id: 3, worker_id: 2, tipo: 'sctr', nombre: 'SCTR Salud', archivo: 'sctr_ccalli.pdf', vencimiento: '2026-04-30', status: 'vencido' },
  { id: 4, worker_id: 3, tipo: 'certificado', nombre: 'Cert. Trabajos en Altura', archivo: 'cert_condori.pdf', vencimiento: '2026-05-28', status: 'por_vencer' },
  { id: 5, worker_id: 4, tipo: 'sctr', nombre: 'SCTR Salud', archivo: 'sctr_torres.pdf', vencimiento: '2026-09-15', status: 'vigente' },
  { id: 6, worker_id: 5, tipo: 'examen_medico', nombre: 'Examen Médico Anual', archivo: 'examen_sanchez.pdf', vencimiento: '2026-05-20', status: 'por_vencer' },
  { id: 7, worker_id: 6, tipo: 'sctr', nombre: 'SCTR Salud', archivo: 'sctr_quispe.pdf', vencimiento: '2026-07-01', status: 'vigente' },
  { id: 8, worker_id: 7, tipo: 'certificado', nombre: 'Cert. Gasfitería Industrial', archivo: 'cert_ramos.pdf', vencimiento: '2026-04-18', status: 'vencido' },
]

export const mockCheckins: Checkin[] = [
  { id: 1, worker_id: 1, worker_nombre: 'Juan Huanca Quispe', worker_cargo: 'Operario', site_id: 1, site_nombre: 'Obra Miraflores', tipo: 'entrada', lat: -12.1219, lng: -77.0284, created_at: '2026-05-18T07:02:00' },
  { id: 2, worker_id: 2, worker_nombre: 'Pedro Ccalli Mamani', worker_cargo: 'Soldador', site_id: 1, site_nombre: 'Obra Miraflores', tipo: 'entrada', lat: -12.1221, lng: -77.0282, created_at: '2026-05-18T06:58:00' },
  { id: 3, worker_id: 3, worker_nombre: 'Luis Condori Flores', worker_cargo: 'Electricista', site_id: 2, site_nombre: 'Obra San Isidro', tipo: 'entrada', lat: -12.0934, lng: -77.0462, created_at: '2026-05-18T07:47:00' },
  { id: 4, worker_id: 4, worker_nombre: 'Miguel Torres Salas', worker_cargo: 'Albañil', site_id: 2, site_nombre: 'Obra San Isidro', tipo: 'entrada', lat: -12.0929, lng: -77.0468, created_at: '2026-05-18T07:01:00' },
  { id: 5, worker_id: 5, worker_nombre: 'Roberto Sánchez Lima', worker_cargo: 'Operario', site_id: 1, site_nombre: 'Obra Miraflores', tipo: 'entrada', lat: -12.1218, lng: -77.0286, created_at: '2026-05-18T06:55:00' },
  { id: 6, worker_id: 7, worker_nombre: 'Félix Ramos Díaz', worker_cargo: 'Gasfitero', site_id: 3, site_nombre: 'Planta Ate', tipo: 'entrada', lat: -12.0466, lng: -76.9603, created_at: '2026-05-18T07:10:00' },
  { id: 7, worker_id: 9, worker_nombre: 'Raúl Flores Cusi', worker_cargo: 'Vigilante', site_id: 1, site_nombre: 'Obra Miraflores', tipo: 'entrada', lat: -12.1220, lng: -77.0283, created_at: '2026-05-18T06:50:00' },
  { id: 8, worker_id: 2, worker_nombre: 'Pedro Ccalli Mamani', worker_cargo: 'Soldador', site_id: 1, site_nombre: 'Obra Miraflores', tipo: 'salida', lat: -12.1222, lng: -77.0281, created_at: '2026-05-18T12:30:00' },
]

export const mockTasks: Task[] = [
  {
    id: 1, company_id: 1, site_id: 1, site_nombre: 'Obra Miraflores',
    supervisor_nombre: 'Carlos Méndez',
    titulo: 'Encofrado piso 4 — eje A-D',
    descripcion: 'Completar encofrado de columnas en el eje A-D del cuarto piso antes del mediodía.',
    fecha: '2026-05-18', prioridad: 'alta', estado: 'en_progreso',
    assignments: [
      { worker_id: 1, worker_nombre: 'Juan Huanca Quispe', estado: 'en_progreso' },
      { worker_id: 5, worker_nombre: 'Roberto Sánchez Lima', estado: 'en_progreso' },
    ],
  },
  {
    id: 2, company_id: 1, site_id: 1, site_nombre: 'Obra Miraflores',
    supervisor_nombre: 'Carlos Méndez',
    titulo: 'Instalación eléctrica sótano',
    descripcion: 'Tendido de cableado en bandeja metálica, sótano 1 y 2.',
    fecha: '2026-05-18', prioridad: 'normal', estado: 'completada',
    assignments: [
      { worker_id: 2, worker_nombre: 'Pedro Ccalli Mamani', estado: 'completada', nota_worker: 'Finalizado al 100%, falta solo etiquetado.' },
    ],
  },
  {
    id: 3, company_id: 1, site_id: 2, site_nombre: 'Obra San Isidro',
    supervisor_nombre: 'Carlos Méndez',
    titulo: 'Vaciado de concreto — losa piso 2',
    descripcion: 'Coordinación con mixer. Inicio 8am. Vibrado cada 30cm.',
    fecha: '2026-05-18', prioridad: 'alta', estado: 'pendiente',
    assignments: [
      { worker_id: 3, worker_nombre: 'Luis Condori Flores', estado: 'pendiente' },
      { worker_id: 4, worker_nombre: 'Miguel Torres Salas', estado: 'pendiente' },
    ],
  },
  {
    id: 4, company_id: 1, site_id: 3, site_nombre: 'Planta Ate',
    supervisor_nombre: 'Carlos Méndez',
    titulo: 'Mantenimiento compresores línea B',
    descripcion: 'Revisión de válvulas y cambio de filtros en compresores 3, 4 y 5.',
    fecha: '2026-05-18', prioridad: 'normal', estado: 'problema',
    assignments: [
      { worker_id: 7, worker_nombre: 'Félix Ramos Díaz', estado: 'problema', nota_worker: 'Falta repuesto para válvula del compresor 4. Solicitando a almacén.' },
    ],
  },
  {
    id: 5, company_id: 1, site_id: 1, site_nombre: 'Obra Miraflores',
    supervisor_nombre: 'Carlos Méndez',
    titulo: 'Colocación de acero — columnas C1-C8',
    descripcion: 'Habilitación y colocación de acero corrugado 3/8" en columnas C1 a C8.',
    fecha: '2026-05-18', prioridad: 'normal', estado: 'pendiente',
    assignments: [
      { worker_id: 9, worker_nombre: 'Raúl Flores Cusi', estado: 'pendiente' },
    ],
  },
]

export const mockIncidents: Incident[] = [
  {
    id: 1, company_id: 1, worker_id: 1, worker_nombre: 'Juan Huanca Quispe',
    site_id: 1, site_nombre: 'Obra Miraflores',
    descripcion: 'Casi-accidente: andamio del piso 3 sin anclaje lateral. Se detectó durante recorrido de seguridad. Se detuvo trabajo en la zona.',
    lat: -12.1219, lng: -77.0284,
    severidad: 'alto', estado: 'en_revision',
    revisado_por: 'Carlos Méndez',
    created_at: '2026-05-18T09:14:00',
  },
  {
    id: 2, company_id: 1, worker_id: 3, worker_nombre: 'Luis Condori Flores',
    site_id: 2, site_nombre: 'Obra San Isidro',
    descripcion: 'Corte leve en mano derecha al manipular varilla de acero sin guantes. Atendido en obra con botiquín.',
    lat: -12.0931, lng: -77.0465,
    severidad: 'bajo', estado: 'cerrado',
    revisado_por: 'Carlos Méndez',
    created_at: '2026-05-17T14:30:00',
  },
  {
    id: 3, company_id: 1, worker_id: 7, worker_nombre: 'Félix Ramos Díaz',
    site_id: 3, site_nombre: 'Planta Ate',
    descripcion: 'Fuga menor de aceite en compresor 3. Zona delimitada. Producción pausada en línea B.',
    lat: -12.0464, lng: -76.9605,
    severidad: 'medio', estado: 'abierto',
    created_at: '2026-05-18T10:45:00',
  },
  {
    id: 4, company_id: 1, worker_id: 4, worker_nombre: 'Miguel Torres Salas',
    site_id: 2, site_nombre: 'Obra San Isidro',
    descripcion: 'EPP incompleto detectado: trabajador sin casco en zona de carga. Se le retiró de la zona y se registró el incidente.',
    lat: -12.0929, lng: -77.0468,
    severidad: 'medio', estado: 'cerrado',
    revisado_por: 'Carlos Méndez',
    created_at: '2026-05-16T11:20:00',
  },
]

export const mockKPIs: DashboardKPIs = {
  presentes: 6,
  ausentes: 2,
  tardanzas: 1,
  total_workers: 9,
  incidentes_abiertos: 2,
  tareas_completadas: 1,
  tareas_total: 5,
  documentos_por_vencer: 3,
}

export const mockAttendance: AttendancePoint[] = [
  { dia: 'Lun', presentes: 8, ausentes: 1 },
  { dia: 'Mar', presentes: 7, ausentes: 2 },
  { dia: 'Mié', presentes: 9, ausentes: 0 },
  { dia: 'Jue', presentes: 8, ausentes: 1 },
  { dia: 'Vie', presentes: 6, ausentes: 2 },
]
