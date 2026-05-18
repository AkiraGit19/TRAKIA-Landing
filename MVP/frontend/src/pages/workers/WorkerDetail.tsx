import { useParams, useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { mockWorkers, mockDocuments, mockCheckins, mockTasks, mockIncidents, mockSites } from '../../data/mock'

const DOC_LABELS: Record<string, string> = {
  sctr: 'SCTR Salud', examen_medico: 'Examen Médico', certificado: 'Certificado',
  contrato: 'Contrato', otro: 'Otro',
}

export default function WorkerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const worker = mockWorkers.find(w => w.id === Number(id))

  if (!worker) return (
    <div className="text-center py-20 text-muted text-sm">
      Trabajador no encontrado. <button onClick={() => navigate('/workers')} className="text-primary underline">Volver</button>
    </div>
  )

  const docs = mockDocuments.filter(d => d.worker_id === worker.id)
  const checkins = mockCheckins.filter(c => c.worker_id === worker.id)
  const incidents = mockIncidents.filter(i => i.worker_id === worker.id)
  const tasks = mockTasks.filter(t => t.assignments.some(a => a.worker_id === worker.id))
  const site = mockSites.find(s => s.id === worker.site_id)

  return (
    <div>
      <PageHeader
        title={worker.nombre}
        sub={`${worker.cargo} · DNI ${worker.dni}`}
        action={
          <button onClick={() => navigate('/workers')} className="text-sm text-slate hover:text-navy">← Volver</button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile card */}
        <div className="bg-white border border-border rounded shadow-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-bold font-sora">
              {worker.avatar_initials}
            </div>
            <div>
              <p className="font-semibold font-sora text-navy">{worker.nombre}</p>
              <Badge value={worker.activo ? worker.status : 'libre'} />
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">DNI</span>
              <span className="font-mono text-navy text-xs">{worker.dni}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Cargo</span>
              <span className="text-navy">{worker.cargo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Teléfono</span>
              <span className="text-navy">{worker.telefono}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Sede asignada</span>
              <span className="text-navy">{site?.nombre ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Estado</span>
              <span className="text-navy">{worker.activo ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>
        </div>

        {/* Docs */}
        <div className="bg-white border border-border rounded shadow-card p-5">
          <h2 className="text-sm font-semibold font-sora text-navy mb-3">Documentos</h2>
          {docs.length === 0 ? (
            <p className="text-xs text-muted">Sin documentos cargados.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {docs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-xs font-medium text-navy">{doc.nombre}</p>
                    <p className="text-[10px] text-muted">{DOC_LABELS[doc.tipo]} · Vence {doc.vencimiento}</p>
                  </div>
                  <Badge value={doc.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats quick */}
        <div className="bg-white border border-border rounded shadow-card p-5">
          <h2 className="text-sm font-semibold font-sora text-navy mb-3">Actividad</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted">Check-ins registrados</span>
              <span className="font-bold font-sora text-navy">{checkins.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted">Tareas asignadas</span>
              <span className="font-bold font-sora text-navy">{tasks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted">Incidentes reportados</span>
              <span className="font-bold font-sora text-navy">{incidents.length}</span>
            </div>
          </div>
        </div>

        {/* Checkin history */}
        <div className="bg-white border border-border rounded shadow-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold font-sora text-navy mb-3">Historial de check-ins</h2>
          {checkins.length === 0 ? (
            <p className="text-xs text-muted">Sin registros.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-muted font-semibold uppercase tracking-wider">Tipo</th>
                    <th className="text-left py-2 pr-4 text-muted font-semibold uppercase tracking-wider">Sede</th>
                    <th className="text-left py-2 text-muted font-semibold uppercase tracking-wider">Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {checkins.map(c => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4">
                        <span className={`font-semibold ${c.tipo === 'entrada' ? 'text-status-green-text' : 'text-slate'}`}>
                          {c.tipo === 'entrada' ? '→ Entrada' : '← Salida'}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-slate">{c.site_nombre}</td>
                      <td className="py-2 font-mono text-slate">
                        {new Date(c.created_at).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="bg-white border border-border rounded shadow-card p-5">
          <h2 className="text-sm font-semibold font-sora text-navy mb-3">Tareas asignadas</h2>
          {tasks.length === 0 ? (
            <p className="text-xs text-muted">Sin tareas asignadas.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map(t => {
                const assignment = t.assignments.find(a => a.worker_id === worker.id)!
                return (
                  <div key={t.id} className="border border-border rounded p-2.5">
                    <p className="text-xs font-medium text-navy">{t.titulo}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge value={assignment.estado} />
                      <span className="text-[10px] text-muted">{t.site_nombre} · {t.fecha}</span>
                    </div>
                    {assignment.nota_worker && (
                      <p className="text-[10px] text-slate mt-1 italic">"{assignment.nota_worker}"</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
