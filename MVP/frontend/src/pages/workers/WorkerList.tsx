import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { mockWorkers, mockDocuments } from '../../data/mock'

export default function WorkerList() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = mockWorkers.filter(w =>
    w.nombre.toLowerCase().includes(search.toLowerCase()) ||
    w.cargo.toLowerCase().includes(search.toLowerCase()) ||
    w.dni.includes(search)
  )

  const hasExpiredDoc = (workerId: number) =>
    mockDocuments.some(d => d.worker_id === workerId && (d.status === 'vencido' || d.status === 'por_vencer'))

  return (
    <div>
      <PageHeader
        title="Trabajadores"
        sub={`${mockWorkers.filter(w => w.activo).length} activos de ${mockWorkers.length} total`}
        action={
          <button
            onClick={() => navigate('/workers/new')}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold font-sora px-4 py-2 rounded transition-colors"
          >
            + Nuevo trabajador
          </button>
        }
      />

      <div className="bg-white border border-border rounded shadow-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <input
            type="text"
            placeholder="Buscar por nombre, cargo o DNI…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-sm border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Trabajador</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">DNI</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Cargo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Documentos</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr
                  key={w.id}
                  className="border-b border-border last:border-0 hover:bg-surface cursor-pointer transition-colors"
                  onClick={() => navigate(`/workers/${w.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-sora flex-shrink-0">
                        {w.avatar_initials}
                      </div>
                      <div>
                        <p className="font-medium text-navy">{w.nombre}</p>
                        <p className="text-[11px] text-muted">{w.telefono}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate">{w.dni}</td>
                  <td className="px-4 py-3 text-slate">{w.cargo}</td>
                  <td className="px-4 py-3">
                    {w.activo ? <Badge value={w.status} /> : <Badge value="libre" />}
                  </td>
                  <td className="px-4 py-3">
                    {hasExpiredDoc(w.id) ? (
                      <Badge value="por_vencer" label="Revisar docs" />
                    ) : (
                      <Badge value="vigente" label="OK" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-primary hover:underline">Ver perfil</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                    No se encontraron trabajadores con ese criterio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
