import { useEffect, useRef } from 'react'
import Badge from '../components/ui/Badge'
import PageHeader from '../components/ui/PageHeader'
import { mockWorkers, mockIncidents, mockSites, mockCheckins } from '../data/mock'

export default function LiveOps() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  const activeWorkers = mockWorkers.filter(w => w.status === 'presente' || w.status === 'tardanza')
  const openIncidents = mockIncidents.filter(i => i.estado === 'abierto' || i.estado === 'en_revision')
  const todayCheckins = mockCheckins.filter(c => c.tipo === 'entrada')

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    import('leaflet').then(L => {
      // Fix default icon paths in Vite
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!).setView([-12.0931, -77.0465], 12)
      mapInstance.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map)

      // Site geofences
      mockSites.forEach(site => {
        L.circle([site.lat, site.lng], {
          radius: site.radio_metros,
          color: '#175CD3',
          fillColor: '#175CD3',
          fillOpacity: 0.06,
          weight: 1.5,
        }).addTo(map)

        L.marker([site.lat, site.lng], {
          icon: L.divIcon({
            className: '',
            html: `<div style="background:#175CD3;color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;font-family:Sora,sans-serif;font-weight:600;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.2)">${site.nombre}</div>`,
            iconAnchor: [40, 10],
          }),
        }).addTo(map)
      })

      // Worker pins
      mockCheckins.filter(c => c.tipo === 'entrada').forEach(c => {
        const worker = mockWorkers.find(w => w.id === c.worker_id)
        if (!worker) return
        const color = worker.status === 'presente' ? '#16803C' : worker.status === 'tardanza' ? '#DC6803' : '#B42318'
        L.circleMarker([c.lat, c.lng], {
          radius: 8,
          color: '#fff',
          weight: 2,
          fillColor: color,
          fillOpacity: 1,
        })
          .addTo(map)
          .bindPopup(`<b style="font-family:Sora,sans-serif">${worker.nombre}</b><br/><span style="font-size:11px;color:#475467">${worker.cargo} · ${c.site_nombre}</span>`)
      })

      // Incident pins
      openIncidents.forEach(inc => {
        const incColor = inc.severidad === 'critico' || inc.severidad === 'alto' ? '#B42318' : '#DC6803'
        L.circleMarker([inc.lat, inc.lng], {
          radius: 7,
          color: '#fff',
          weight: 2,
          fillColor: incColor,
          fillOpacity: 0.85,
        })
          .addTo(map)
          .bindPopup(`<b style="font-family:Sora,sans-serif;color:#B42318">⚠ Incidente ${inc.severidad}</b><br/><span style="font-size:11px;color:#475467">${inc.descripcion.slice(0, 80)}…</span>`)
      })
    })

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 h-full">
      <PageHeader
        title="Operaciones en campo — en vivo"
        sub={`${activeWorkers.length} trabajadores activos · ${openIncidents.length} incidentes abiertos`}
        action={
          <span className="flex items-center gap-1.5 text-xs text-status-green-text font-semibold bg-status-green-bg px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-status-green-text animate-pulse" />
            En vivo
          </span>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 bg-white border border-border rounded shadow-card overflow-hidden min-h-[360px]">
          <div ref={mapRef} className="w-full h-full" style={{ minHeight: 360 }} />
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-72 flex flex-col gap-3 overflow-y-auto scrollbar-thin">
          {/* Open incidents */}
          <div className="bg-white border border-border rounded shadow-card p-4">
            <h2 className="text-xs font-semibold font-sora text-navy mb-3 uppercase tracking-wider">
              Incidentes abiertos ({openIncidents.length})
            </h2>
            {openIncidents.length === 0 ? (
              <p className="text-xs text-muted">Sin incidentes abiertos</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {openIncidents.map(inc => (
                  <div key={inc.id} className="border border-border rounded p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge value={inc.severidad} />
                      <Badge value={inc.estado} />
                    </div>
                    <p className="text-xs text-navy leading-snug">{inc.descripcion.slice(0, 70)}…</p>
                    <p className="text-[10px] text-muted mt-1">{inc.site_nombre} · {inc.worker_nombre}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-ins today */}
          <div className="bg-white border border-border rounded shadow-card p-4">
            <h2 className="text-xs font-semibold font-sora text-navy mb-3 uppercase tracking-wider">
              Check-ins de hoy ({todayCheckins.length})
            </h2>
            <div className="flex flex-col gap-2">
              {todayCheckins.map(c => (
                <div key={c.id} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold font-sora flex-shrink-0">
                    {c.worker_nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-navy truncate">{c.worker_nombre}</p>
                    <p className="text-[10px] text-muted">{c.site_nombre} · {new Date(c.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className="ml-auto text-[10px] text-status-green-text font-semibold">✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sites summary */}
          <div className="bg-white border border-border rounded shadow-card p-4">
            <h2 className="text-xs font-semibold font-sora text-navy mb-3 uppercase tracking-wider">Sedes activas</h2>
            <div className="flex flex-col gap-2">
              {mockSites.map(site => {
                const count = activeWorkers.filter(w => w.site_id === site.id).length
                return (
                  <div key={site.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-navy">{site.nombre}</p>
                      <p className="text-[10px] text-muted">{site.direccion}</p>
                    </div>
                    <span className="text-xs font-bold font-sora text-primary ml-2">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
