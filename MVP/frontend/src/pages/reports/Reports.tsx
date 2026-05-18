import PageHeader from '../../components/ui/PageHeader'
import { mockCheckins, mockWorkers } from '../../data/mock'

export default function Reports() {
  const rows = mockWorkers.filter(w => w.activo).map(w => {
    const workerCheckins = mockCheckins.filter(c => c.worker_id === w.id)
    const entrada = workerCheckins.find(c => c.tipo === 'entrada')
    const salida = workerCheckins.find(c => c.tipo === 'salida')
    return { worker: w, entrada, salida }
  })

  return (
    <div>
      <PageHeader
        title="Reportes"
        sub="Exportar asistencia en formato PLAME"
        action={
          <button className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold font-sora px-4 py-2 rounded transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar CSV
          </button>
        }
      />

      <div className="bg-white border border-border rounded shadow-card p-5 mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Desde</label>
            <input type="date" defaultValue="2026-05-01" className="border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Hasta</label>
            <input type="date" defaultValue="2026-05-18" className="border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <button className="bg-surface border border-border text-navy text-sm font-semibold px-4 py-2 rounded hover:bg-gray-100 transition-colors">
            Filtrar
          </button>
        </div>
      </div>

      <div className="bg-white border border-border rounded shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-xs text-muted">Mostrando asistencia del 18 May 2026 — <span className="font-semibold text-navy">{rows.length} trabajadores</span></p>
          <span className="text-[10px] text-muted bg-surface border border-border rounded px-2 py-1">Formato PLAME</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">DNI</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Apellidos y nombres</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Cargo</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Entrada</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Salida</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Horas</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ worker, entrada, salida }) => {
                const horas = entrada && salida
                  ? ((new Date(salida.created_at).getTime() - new Date(entrada.created_at).getTime()) / 3600000).toFixed(1)
                  : '—'
                return (
                  <tr key={worker.id} className="border-b border-border last:border-0 hover:bg-surface">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate">{worker.dni}</td>
                    <td className="px-4 py-2.5 text-xs font-medium text-navy">{worker.nombre}</td>
                    <td className="px-4 py-2.5 text-xs text-slate">{worker.cargo}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate">
                      {entrada ? new Date(entrada.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate">
                      {salida ? new Date(salida.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate">{horas !== '—' ? `${horas}h` : '—'}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${worker.status === 'presente' ? 'bg-status-green-bg text-status-green-text' : worker.status === 'tardanza' ? 'bg-status-amber-bg text-status-amber-text' : 'bg-status-red-bg text-status-red-text'}`}>
                        {worker.status === 'presente' ? 'Asistió' : worker.status === 'tardanza' ? 'Tardanza' : 'Faltó'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
