import { useParams, useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { mockIncidents } from '../../data/mock'

export default function IncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const inc = mockIncidents.find(i => i.id === Number(id))

  if (!inc) return (
    <div className="text-center py-20 text-muted text-sm">
      Incidente no encontrado. <button onClick={() => navigate('/incidents')} className="text-primary underline">Volver</button>
    </div>
  )

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={`Incidente #${inc.id}`}
        sub={new Date(inc.created_at).toLocaleString('es-PE', { dateStyle: 'full', timeStyle: 'short' })}
        action={<button onClick={() => navigate('/incidents')} className="text-sm text-slate hover:text-navy">← Volver</button>}
      />

      <div className="flex flex-col gap-4">
        <div className="bg-white border border-border rounded shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Badge value={inc.severidad} />
            <Badge value={inc.estado} />
          </div>
          <p className="text-sm text-navy leading-relaxed mb-4">{inc.descripcion}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted mb-0.5">Trabajador</p>
              <p className="font-medium text-navy">{inc.worker_nombre}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Sede</p>
              <p className="font-medium text-navy">{inc.site_nombre}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Ubicación GPS</p>
              <p className="font-mono text-xs text-slate">{inc.lat}, {inc.lng}</p>
            </div>
            {inc.revisado_por && (
              <div>
                <p className="text-xs text-muted mb-0.5">Revisado por</p>
                <p className="font-medium text-navy">{inc.revisado_por}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status update mock */}
        <div className="bg-white border border-border rounded shadow-card p-5">
          <h2 className="text-sm font-semibold font-sora text-navy mb-3">Actualizar estado</h2>
          <div className="flex flex-col gap-3">
            <textarea
              rows={3}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
              placeholder="Notas de revisión, acciones tomadas, cierre del caso…"
            />
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/incidents')}
                className="bg-status-amber-bg border border-status-amber-text/30 text-status-amber-text text-xs font-semibold px-4 py-2 rounded hover:bg-yellow-100 transition-colors"
              >
                Marcar en revisión
              </button>
              <button
                onClick={() => navigate('/incidents')}
                className="bg-status-green-bg border border-status-green-text/30 text-status-green-text text-xs font-semibold px-4 py-2 rounded hover:bg-green-100 transition-colors"
              >
                Cerrar incidente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
