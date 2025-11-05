import React from 'react';
import { Building2, Coins, Percent, TrendingUp } from 'lucide-react';

function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value || 0);
}

export default function KPICards({ kpis }) {
  const items = [
    {
      label: 'Nombre de biens',
      value: kpis.totalProperties,
      icon: Building2,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Valeur totale',
      value: formatCurrency(kpis.totalValue),
      icon: Coins,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Revenus mensuels',
      value: formatCurrency(kpis.monthlyIncome),
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Rdt. net moyen',
      value: `${(kpis.averageNetYield || 0).toFixed(1)}%`,
      icon: Percent,
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="group rounded-2xl border bg-white/80 p-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
            </div>
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
      <div className="rounded-2xl border bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white shadow-sm">
        <div className="text-xs uppercase tracking-wide/loose opacity-80">Revenus annuels projetés</div>
        <div className="mt-1 text-2xl font-semibold">{formatCurrency(kpis.projectedAnnualIncome)}</div>
        <div className="mt-2 text-xs opacity-80">Basé sur vos loyers actuels</div>
      </div>
    </div>
  );
}
