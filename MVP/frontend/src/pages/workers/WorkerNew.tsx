import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import { mockSites } from '../../data/mock'

export default function WorkerNew() {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/workers')
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Nuevo trabajador"
        sub="Registrar trabajador de campo"
        action={<button onClick={() => navigate('/workers')} className="text-sm text-slate hover:text-navy">← Volver</button>}
      />
      <div className="bg-white border border-border rounded shadow-card p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Nombre completo *</label>
              <input className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">DNI *</label>
              <input className="w-full border border-border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" placeholder="12345678" maxLength={8} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Cargo *</label>
              <input className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" placeholder="Ej: Operario, Soldador" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Teléfono</label>
              <input className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" placeholder="9XXXXXXXX" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Sede asignada</label>
              <select className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
                <option value="">Sin sede</option>
                {mockSites.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">PIN de acceso (app)</label>
              <input className="w-full border border-border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" placeholder="6 dígitos" maxLength={6} />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold font-sora px-5 py-2 rounded transition-colors">
              Guardar trabajador
            </button>
            <button type="button" onClick={() => navigate('/workers')} className="text-sm text-slate hover:text-navy">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
