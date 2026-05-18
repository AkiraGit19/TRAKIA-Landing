import PageHeader from '../../components/ui/PageHeader'
import { mockCompany, mockSites, mockUser } from '../../data/mock'

export default function Settings() {
  return (
    <div className="max-w-2xl flex flex-col gap-5">
      <PageHeader title="Configuración" sub="Empresa, sedes y usuarios" />

      {/* Company */}
      <div className="bg-white border border-border rounded shadow-card p-5">
        <h2 className="text-sm font-semibold font-sora text-navy mb-4">Datos de la empresa</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Razón social</label>
            <input defaultValue={mockCompany.nombre} className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">RUC</label>
            <input defaultValue={mockCompany.ruc} className="w-full border border-border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Plan activo</label>
            <div className="flex items-center gap-2 py-2">
              <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize font-sans">{mockCompany.plan}</span>
              <a href="#" className="text-xs text-primary hover:underline">Cambiar plan</a>
            </div>
          </div>
        </div>
        <button className="mt-4 bg-primary hover:bg-primary-dark text-white text-sm font-semibold font-sora px-4 py-2 rounded transition-colors">Guardar</button>
      </div>

      {/* Sites */}
      <div className="bg-white border border-border rounded shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold font-sora text-navy">Sedes / Obras</h2>
          <button className="text-xs text-primary hover:underline font-semibold">+ Agregar sede</button>
        </div>
        <div className="flex flex-col gap-3">
          {mockSites.map(site => (
            <div key={site.id} className="flex items-start justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-navy">{site.nombre}</p>
                <p className="text-xs text-muted">{site.direccion}</p>
                <p className="text-[10px] text-muted mt-0.5 font-mono">GPS: {site.lat}, {site.lng} · Radio: {site.radio_metros}m</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-slate hover:text-navy">Editar</button>
                <button className="text-xs text-status-red-text hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users */}
      <div className="bg-white border border-border rounded shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold font-sora text-navy">Usuarios supervisores</h2>
          <button className="text-xs text-primary hover:underline font-semibold">+ Invitar usuario</button>
        </div>
        <div className="flex items-center gap-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-sora">
            {mockUser.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium text-navy">{mockUser.nombre}</p>
            <p className="text-xs text-muted">{mockUser.email} · <span className="capitalize font-semibold">{mockUser.rol}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
