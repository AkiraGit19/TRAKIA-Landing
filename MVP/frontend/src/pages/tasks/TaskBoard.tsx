import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { mockTasks } from '../../data/mock'
import type { TaskStatus } from '../../types'

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'pendiente', label: 'Pendiente' },
  { status: 'en_progreso', label: 'En progreso' },
  { status: 'completada', label: 'Completada' },
  { status: 'problema', label: 'Problema' },
]

const PRIORITY_COLOR: Record<string, string> = {
  alta: 'border-l-status-red-text',
  normal: 'border-l-primary',
  baja: 'border-l-border',
}

export default function TaskBoard() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Tareas"
        sub="Tablero del día · 18 May 2026"
        action={
          <button
            onClick={() => navigate('/tasks/new')}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold font-sora px-4 py-2 rounded transition-colors"
          >
            + Nueva tarea
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const tasks = mockTasks.filter(t => t.estado === col.status)
          return (
            <div key={col.status} className="bg-surface border border-border rounded p-3 flex flex-col gap-2 min-h-[200px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold font-sora text-navy">{col.label}</span>
                <span className="text-xs font-bold text-muted bg-white border border-border rounded-full w-5 h-5 flex items-center justify-center">
                  {tasks.length}
                </span>
              </div>
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`bg-white border border-border border-l-2 ${PRIORITY_COLOR[task.prioridad]} rounded p-3 cursor-pointer hover:shadow-card transition-shadow`}
                >
                  <p className="text-xs font-semibold text-navy leading-snug mb-1.5">{task.titulo}</p>
                  <p className="text-[10px] text-muted mb-2 leading-snug">{task.descripcion.slice(0, 60)}…</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted">{task.site_nombre}</span>
                    <Badge value={task.prioridad} label={task.prioridad === 'alta' ? 'Alta' : task.prioridad === 'normal' ? 'Normal' : 'Baja'} />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.assignments.map(a => (
                      <span key={a.worker_id} className="text-[9px] bg-surface border border-border rounded-full px-2 py-0.5 text-slate">
                        {a.worker_nombre.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                  {task.assignments.some(a => a.nota_worker) && (
                    <p className="text-[10px] text-slate mt-1.5 italic border-t border-border pt-1.5">
                      "{task.assignments.find(a => a.nota_worker)?.nota_worker?.slice(0, 50)}…"
                    </p>
                  )}
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="flex items-center justify-center h-20 text-[11px] text-muted border border-dashed border-border rounded">
                  Sin tareas
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
