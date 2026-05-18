interface Props {
  label: string
  value: number | string
  sub?: string
  accent?: 'blue' | 'green' | 'amber' | 'red'
  icon?: React.ReactNode
}

const ACCENT: Record<string, string> = {
  blue:  'border-t-primary',
  green: 'border-t-status-green-text',
  amber: 'border-t-status-amber-text',
  red:   'border-t-status-red-text',
}

export default function StatCard({ label, value, sub, accent = 'blue', icon }: Props) {
  return (
    <div className={`bg-white rounded border border-border border-t-2 ${ACCENT[accent]} shadow-card p-5 flex flex-col gap-1`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">{label}</span>
        {icon && <span className="text-muted">{icon}</span>}
      </div>
      <span className="text-3xl font-bold font-sora text-navy leading-none">{value}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </div>
  )
}
