import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { mockDocuments, mockWorkers } from '../../data/mock'

const DOC_LABELS: Record<string, string> = {
  sctr: 'SCTR Salud', examen_medico: 'Examen Médico', certificado: 'Certificado',
  contrato: 'Contrato', otro: 'Otro',
}

export default function DocumentList() {
  const vencidos = mockDocuments.filter(d => d.status === 'vencido')
  const porVencer = mockDocuments.filter(d => d.status === 'por_vencer')
  const vigentes = mockDocuments.filter(d => d.status === 'vigente')

  const workerName = (id: number) => mockWorkers.find(w => w.id === id)?.nombre ?? '—'

  const Section = ({ title, docs, accent }: { title: string; docs: typeof mockDocuments; accent: string }) => (
    <div>
      <h2 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${accent}`}>{title} ({docs.length})</h2>
      {docs.length === 0 ? (
        <p className="text-xs text-muted py-3">Ninguno en esta categoría.</p>
      ) : (
        <div className="bg-white border border-border rounded shadow-card overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Trabajador</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Documento</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Tipo</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Vencimiento</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Estado</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => (
                <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-4 py-2.5 text-xs font-medium text-navy">{workerName(doc.worker_id)}</td>
                  <td className="px-4 py-2.5 text-xs text-slate">{doc.nombre}</td>
                  <td className="px-4 py-2.5 text-xs text-muted">{DOC_LABELS[doc.tipo]}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate">{doc.vencimiento}</td>
                  <td className="px-4 py-2.5"><Badge value={doc.status} /></td>
                  <td className="px-4 py-2.5 text-right">
                    <button className="text-xs text-primary hover:underline">Renovar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Documentos"
        sub={`${vencidos.length} vencidos · ${porVencer.length} por vencer · ${vigentes.length} vigentes`}
        action={
          <button className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold font-sora px-4 py-2 rounded transition-colors">
            + Subir documento
          </button>
        }
      />
      <Section title="Vencidos — acción inmediata" docs={vencidos} accent="text-status-red-text" />
      <Section title="Por vencer — próximos 30 días" docs={porVencer} accent="text-status-amber-text" />
      <Section title="Vigentes" docs={vigentes} accent="text-muted" />
    </div>
  )
}
