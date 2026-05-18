import { useEffect, useRef } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { mockCheckins, mockWorkers } from '../../data/mock'

export default function CheckinList() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      const map = L.map(mapRef.current!).setView([-12.0931, -77.0465], 12)
      mapInstance.current = map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
      mockCheckins.filter(c => c.tipo === 'entrada').forEach(c => {
        L.circleMarker([c.lat, c.lng], { radius: 7, color: '#fff', weight: 2, fillColor: '#175CD3', fillOpacity: 1 })
          .addTo(map)
          .bindPopup(`<b style="font-family:Sora,sans-serif">${c.worker_nombre}</b><br/><span style="font-size:11px;color:#475467">${c.site_nombre}</span>`)
      })
    })
    return () => { mapInstance.current?.remove(); mapInstance.current = null }
  }, [])

  return (
    <div>
      <PageHeader title="Check-ins de hoy" sub={`${mockCheckins.length} registros — 18 May 2026`} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Map */}
        <div className="bg-white border border-border rounded shadow-card overflow-hidden" style={{ height: 340 }}>
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Table */}
        <div className="bg-white border border-border rounded shadow-card overflow-hidden">
          <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface">
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Trabajador</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Sede</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted uppercase tracking-wider">Hora</th>
                </tr>
              </thead>
              <tbody>
                {mockCheckins.map(c => {
                  const worker = mockWorkers.find(w => w.id === c.worker_id)
                  return (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold font-sora flex-shrink-0">
                            {worker?.avatar_initials}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-navy">{c.worker_nombre}</p>
                            <p className="text-[10px] text-muted">{c.worker_cargo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate">{c.site_nombre}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-semibold ${c.tipo === 'entrada' ? 'text-status-green-text' : 'text-slate'}`}>
                          {c.tipo === 'entrada' ? '→ Entrada' : '← Salida'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted">
                        {new Date(c.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary by worker */}
      <div className="mt-4 bg-white border border-border rounded shadow-card p-5">
        <h2 className="text-sm font-semibold font-sora text-navy mb-3">Resumen de asistencia</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {mockWorkers.filter(w => w.activo).map(w => (
            <div key={w.id} className="flex items-center gap-2 py-2 px-3 border border-border rounded">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold font-sora flex-shrink-0">
                {w.avatar_initials}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-navy truncate">{w.nombre.split(' ')[0]}</p>
                <Badge value={w.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
