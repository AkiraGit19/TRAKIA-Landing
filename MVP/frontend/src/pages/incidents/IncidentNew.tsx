import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import { mockSites, mockWorkers } from '../../data/mock'

export default function IncidentNew() {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Reportar incidente"
        sub="Registro para trazabilidad SUNAFIL"
        action={<button onClick={() => navigate('/incidents')} className="text-sm text-slate hover:text-navy">← Volver</button>}
      />
      <div className="bg-white border border-border rounded shadow-card p-6">
        <form onSubmit={e => { e.preventDefault(); navigate('/incidents') }} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Trabajador involucrado *</label>
              <select className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
                <option value="">Seleccionar…</option>
                {mockWorkers.filter(w => w.activo).map(w => <option key={w.id}>{w.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Sede *</label>
              <select className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
                {mockSites.map(s => <option key={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Severidad *</label>
              <select className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
                <option value="bajo">Bajo — sin lesión</option>
                <option value="medio" selected>Medio — atención básica</option>
                <option value="alto">Alto — requiere médico</option>
                <option value="critico">Crítico — emergencia</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Fecha y hora *</label>
              <input type="datetime-local" defaultValue="2026-05-18T10:00" className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Descripción del incidente *</label>
            <textarea
              rows={4}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
              placeholder="Describe qué ocurrió, las condiciones, acciones tomadas inmediatamente y si hubo testigos…"
            />
          </div>

          {/* Photo upload mock */}
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Foto de evidencia</label>
            <div className="border-2 border-dashed border-border rounded p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <svg className="w-8 h-8 text-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xs text-muted">Arrastra una foto o <span className="text-primary">selecciona archivo</span></p>
              <p className="text-[10px] text-muted mt-0.5">JPG, PNG · máx. 5 MB</p>
            </div>
          </div>

          {/* GPS mock */}
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Ubicación GPS</label>
            <div className="bg-surface border border-border rounded px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-muted font-mono">-12.1219, -77.0284</span>
              </div>
              <span className="text-[10px] text-status-green-text font-semibold bg-status-green-bg px-2 py-0.5 rounded-full">Capturado</span>
            </div>
          </div>

          <div className="bg-status-amber-bg border border-status-amber-text/20 rounded p-3 flex items-start gap-2">
            <svg className="w-4 h-4 text-status-amber-text flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[11px] text-status-amber-text">
              Este reporte queda registrado con fecha, hora, GPS y usuario. Sirve como evidencia ante fiscalización SUNAFIL.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <button type="submit" className="bg-status-red-text hover:bg-red-700 text-white text-sm font-semibold font-sora px-5 py-2 rounded transition-colors">
              Registrar incidente
            </button>
            <button type="button" onClick={() => navigate('/incidents')} className="text-sm text-slate hover:text-navy">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
