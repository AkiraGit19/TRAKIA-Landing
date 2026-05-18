import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { mockIncidents } from '../../data/mock'

export default function IncidentList() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Incidentes"
        sub={`${mockIncidents.filter(i => i.estado === 'abierto').length} abiertos · ${mockIncidents.length} total`}
        action={
          <button
            onClick={() => navigate('/incidents/new')}
            className="bg-status-red-bg border border-status-red-text/30 text-status-red-text text-sm font-semibold font-sora px-4 py-2 rounded hover:bg-red-100 transition-colors"
          >
            + Reportar incidente
          </button>
        }
      />
      <div className="bg-white border border-border rounded shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Severidad</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Descripción</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Trabajador</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Sede</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {mockIncidents.map(inc => (
                <tr
                  key={inc.id}
                  className="border-b border-border last:border-0 hover:bg-surface cursor-pointer"
                  onClick={() => navigate(`/incidents/${inc.id}`)}
                >
                  <td className="px-4 py-3"><Badge value={inc.severidad} /></td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-navy text-xs leading-snug line-clamp-2">{inc.descripcion}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">{inc.worker_nombre}</td>
                  <td className="px-4 py-3 text-xs text-slate">{inc.site_nombre}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">
                    {new Date(inc.created_at).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3"><Badge value={inc.estado} /></td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-primary hover:underline">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
