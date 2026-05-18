import type { WorkerStatus, IncidentSeverity, IncidentStatus, TaskStatus, DocStatus, TaskPriority } from '../../types'

type BadgeVariant = WorkerStatus | IncidentSeverity | IncidentStatus | TaskStatus | DocStatus | TaskPriority

const STYLES: Record<string, string> = {
  // worker status
  presente:     'bg-status-green-bg text-status-green-text',
  tardanza:     'bg-status-amber-bg text-status-amber-text',
  ausente:      'bg-status-red-bg text-status-red-text',
  libre:        'bg-gray-100 text-gray-500',
  // incident severity
  bajo:         'bg-status-blue-bg text-status-blue-text',
  medio:        'bg-status-amber-bg text-status-amber-text',
  alto:         'bg-status-red-bg text-status-red-text',
  critico:      'bg-red-100 text-red-800',
  // incident status
  abierto:      'bg-status-red-bg text-status-red-text',
  en_revision:  'bg-status-amber-bg text-status-amber-text',
  cerrado:      'bg-status-green-bg text-status-green-text',
  // task status
  pendiente:    'bg-gray-100 text-gray-600',
  en_progreso:  'bg-status-blue-bg text-status-blue-text',
  completada:   'bg-status-green-bg text-status-green-text',
  problema:     'bg-status-red-bg text-status-red-text',
  // doc status
  vigente:      'bg-status-green-bg text-status-green-text',
  por_vencer:   'bg-status-amber-bg text-status-amber-text',
  vencido:      'bg-status-red-bg text-status-red-text',
}

const LABELS: Record<string, string> = {
  presente: 'Presente', tardanza: 'Tardanza', ausente: 'Ausente', libre: 'Inactivo',
  bajo: 'Bajo', medio: 'Medio', alto: 'Alto', critico: 'Crítico',
  abierto: 'Abierto', en_revision: 'En revisión', cerrado: 'Cerrado',
  pendiente: 'Pendiente', en_progreso: 'En progreso', completada: 'Completada', problema: 'Problema',
  vigente: 'Vigente', por_vencer: 'Por vencer', vencido: 'Vencido',
}

interface Props {
  value: BadgeVariant
  label?: string
}

export default function Badge({ value, label }: Props) {
  const cls = STYLES[value] ?? 'bg-gray-100 text-gray-600'
  const text = label ?? LABELS[value] ?? value
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-sans ${cls}`}>
      {text}
    </span>
  )
}
