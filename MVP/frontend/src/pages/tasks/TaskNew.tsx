import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import { mockSites, mockWorkers } from '../../data/mock'

export default function TaskNew() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<number[]>([])

  const toggleWorker = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Nueva tarea"
        action={<button onClick={() => navigate('/tasks')} className="text-sm text-slate hover:text-navy">← Volver</button>}
      />
      <div className="bg-white border border-border rounded shadow-card p-6">
        <form onSubmit={e => { e.preventDefault(); navigate('/tasks') }} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Título *</label>
            <input className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" placeholder="Ej: Encofrado piso 4 — eje A-D" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Descripción</label>
            <textarea rows={3} className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none" placeholder="Instrucciones detalladas para el trabajador…" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Sede</label>
              <select className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
                {mockSites.map(s => <option key={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Prioridad</label>
              <select className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Fecha</label>
              <input type="date" defaultValue="2026-05-18" className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-2">Asignar trabajadores</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-thin">
              {mockWorkers.filter(w => w.activo).map(w => (
                <label key={w.id} className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${selected.includes(w.id) ? 'border-primary bg-primary/5' : 'border-border hover:bg-surface'}`}>
                  <input type="checkbox" className="accent-primary" checked={selected.includes(w.id)} onChange={() => toggleWorker(w.id)} />
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold font-sora flex-shrink-0">
                    {w.avatar_initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-navy truncate">{w.nombre.split(' ').slice(0, 2).join(' ')}</p>
                    <p className="text-[10px] text-muted">{w.cargo}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold font-sora px-5 py-2 rounded transition-colors">
              Crear tarea
            </button>
            <button type="button" onClick={() => navigate('/tasks')} className="text-sm text-slate hover:text-navy">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
