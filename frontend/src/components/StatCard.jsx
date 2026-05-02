export default function StatCard({ title, value, tone = 'default' }) {
  const toneMap = {
    default: 'bg-white border-slate-200',
    success: 'bg-emerald-50 border-emerald-100',
    warning: 'bg-amber-50 border-amber-100',
    danger: 'bg-rose-50 border-rose-100'
  };

  return (
    <article
      className={`rounded-xl border p-5 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:scale-[1.02] ${toneMap[tone]}`}
    >
      <p className="text-sm text-textMuted">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </article>
  );
}
