import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-sora font-bold text-navy text-2xl tracking-tight">TRAKIA</span>
          <p className="text-sm text-muted mt-1">Panel de operaciones</p>
        </div>

        <div className="bg-white border border-border rounded shadow-card p-6">
          <h1 className="text-base font-semibold font-sora text-navy mb-5">Ingresar</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Correo electrónico</label>
              <input
                type="email"
                defaultValue="carlos@andina.pe"
                className="w-full border border-border rounded px-3 py-2 text-sm text-navy focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder="tu@empresa.pe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Contraseña</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full border border-border rounded px-3 py-2 text-sm text-navy focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder="Tu contraseña"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold font-sora text-sm py-2.5 rounded transition-colors"
            >
              Ingresar
            </button>
          </form>
          <p className="text-center text-xs text-muted mt-4">
            ¿Problemas para ingresar?{' '}
            <a href="#" className="text-primary hover:underline">Contactar soporte</a>
          </p>
        </div>

        <p className="text-center text-[10px] text-muted mt-6">
          TRAKIA MVP · Fase 0 — datos de prueba
        </p>
      </div>
    </div>
  )
}
