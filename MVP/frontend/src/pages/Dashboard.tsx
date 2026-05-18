import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import PageHeader from '../components/ui/PageHeader'
import { mockKPIs, mockAttendance, mockIncidents, mockTasks, mockWorkers } from '../data/mock'

export default function Dashboard() {
  const recentIncidents = mockIncidents.slice(0, 3)
  const recentTasks = mockTasks.slice(0, 4)
  const presentWorkers = mockWorkers.filter(w => w.status === 'presente')

  return (
    <div>
      <PageHeader
        title="Dashboard"
        sub="Hoy · Domingo 18 de mayo de 2026"
        action={
          <span className="flex items-center gap-1.5 text-xs text-status-green-text font-semibold bg-status-green-bg px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-status-green-text animate-pulse" />
            En vivo
          </span>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Presentes hoy"
          value={mockKPIs.presentes}
          sub={`de ${mockKPIs.total_workers} trabajadores activos`}
          accent="green"
        />
        <StatCard
          label="Ausentes"
          value={mockKPIs.ausentes}
          sub={`${mockKPIs.tardanzas} con tardanza`}
          accent="red"
        />
        <StatCard
          label="Incidentes abiertos"
          value={mockKPIs.incidentes_abiertos}
          sub="requieren revisión"
          accent="amber"
        />
        <StatCard
          label="Tareas completadas"
          value={`${mockKPIs.tareas_completadas}/${mockKPIs.tareas_total}`}
          sub="del turno de hoy"
          accent="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Attendance chart */}
        <div className="lg:col-span-2 bg-white border border-border rounded shadow-card p-5">
          <h2 className="text-sm font-semibold font-sora text-navy mb-4">Asistencia — últimos 5 días</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mockAttendance} barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#667085', fontFamily: 'Source Sans 3' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#667085', fontFamily: 'Source Sans 3' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, fontFamily: 'Source Sans 3', borderColor: '#E4E7EC', borderRadius: 8 }}
                cursor={{ fill: '#F8FAFC' }}
              />
              <Bar dataKey="presentes" name="Presentes" fill="#175CD3" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ausentes" name="Ausentes" fill="#FEE2E2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Workers present now */}
        <div className="bg-white border border-border rounded shadow-card p-5">
          <h2 className="text-sm font-semibold font-sora text-navy mb-3">En sitio ahora</h2>
          <div className="flex flex-col gap-2">
            {presentWorkers.slice(0, 5).map(w => (
              <div key={w.id} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold font-sora flex-shrink-0">
                  {w.avatar_initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-navy truncate">{w.nombre}</p>
                  <p className="text-[10px] text-muted">{w.cargo}</p>
                </div>
                <Badge value={w.status} />
              </div>
            ))}
            {presentWorkers.length > 5 && (
              <p className="text-[10px] text-muted pl-9">+{presentWorkers.length - 5} más</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent incidents */}
        <div className="bg-white border border-border rounded shadow-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold font-sora text-navy">Incidentes recientes</h2>
            <a href="/incidents" className="text-xs text-primary hover:underline">Ver todos</a>
          </div>
          <div className="flex flex-col gap-3">
            {recentIncidents.map(inc => (
              <div key={inc.id} className="flex items-start gap-2.5 pb-3 border-b border-border last:border-0 last:pb-0">
                <Badge value={inc.severidad} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-navy truncate">{inc.descripcion.slice(0, 60)}…</p>
                  <p className="text-[10px] text-muted mt-0.5">{inc.site_nombre} · {inc.worker_nombre}</p>
                </div>
                <Badge value={inc.estado} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent tasks */}
        <div className="bg-white border border-border rounded shadow-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold font-sora text-navy">Tareas del día</h2>
            <a href="/tasks" className="text-xs text-primary hover:underline">Ver kanban</a>
          </div>
          <div className="flex flex-col gap-3">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center gap-2.5 pb-3 border-b border-border last:border-0 last:pb-0">
                <Badge value={task.prioridad} label={task.prioridad === 'alta' ? 'Alta' : task.prioridad === 'normal' ? 'Normal' : 'Baja'} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-navy truncate">{task.titulo}</p>
                  <p className="text-[10px] text-muted">{task.site_nombre} · {task.assignments.length} asignados</p>
                </div>
                <Badge value={task.estado} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doc alert */}
      {mockKPIs.documentos_por_vencer > 0 && (
        <div className="mt-4 bg-status-amber-bg border border-status-amber-text/20 rounded p-4 flex items-start gap-3">
          <svg className="w-4 h-4 text-status-amber-text flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-status-amber-text">
              {mockKPIs.documentos_por_vencer} documento(s) próximos a vencer
            </p>
            <p className="text-[10px] text-status-amber-text/80 mt-0.5">
              Revisa la sección de documentos para tomar acción antes de la fiscalización.
            </p>
          </div>
          <a href="/documents" className="ml-auto text-xs font-semibold text-status-amber-text underline whitespace-nowrap">Ver ahora</a>
        </div>
      )}
    </div>
  )
}
