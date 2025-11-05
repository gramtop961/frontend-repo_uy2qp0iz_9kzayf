import React, { useMemo } from 'react';

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v || 0);
}

// Simple CSS donut via conic-gradient
function Donut({ segments }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let current = 0;
  const gradient = segments
    .map((s) => {
      const start = (current / total) * 100;
      current += s.value;
      const end = (current / total) * 100;
      return `${s.color} ${start}% ${end}%`;
    })
    .join(', ');
  return (
    <div className="relative h-40 w-40">
      <div
        className="h-full w-full rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      />
      <div className="absolute inset-4 rounded-full bg-white grid place-items-center text-xs text-gray-500">Répartition</div>
    </div>
  );
}

export default function ChartsOverview({ properties = [], transactions = [], monthlySeries = [] }) {
  const typeBreakdown = useMemo(() => {
    const m = {};
    properties.forEach((p) => { m[p.type] = (m[p.type] || 0) + (p.currentValue || 0); });
    const palette = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];
    return Object.entries(m).map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));
  }, [properties]);

  const geoBreakdown = useMemo(() => {
    const m = {};
    properties.forEach((p) => { m[p.city] = (m[p.city] || 0) + 1; });
    const entries = Object.entries(m).map(([label, value]) => ({ label, value }));
    return entries.sort((a, b) => b.value - a.value).slice(0, 5);
  }, [properties]);

  const performance = useMemo(() => {
    return properties.map((p) => {
      const net = (p.rent || 0) - (p.charges || 0) - (p.managementFee || 0) * (p.rent || 0);
      const netYield = p.purchasePrice ? ((net * 12) / p.purchasePrice) * 100 : 0;
      return { name: p.name, value: Number(netYield.toFixed(1)) };
    });
  }, [properties]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Évolution des revenus (12 mois)</h3>
          <span className="text-xs text-gray-500">Mensuel</span>
        </div>
        <div className="mt-2 h-40 w-full">
          <div className="flex h-full items-end gap-1">
            {monthlySeries.map((v, i) => (
              <div key={i} className="flex-1">
                <div className="mx-auto h-full w-full rounded-sm bg-gradient-to-t from-blue-200 to-blue-600" style={{ height: `${Math.min(100, (v.scaled || 0))}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 text-right text-sm text-gray-600">Total: {formatCurrency(monthlySeries.reduce((a, b) => a + (b.value || 0), 0))}</div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Répartition par type</h3>
          <span className="text-xs text-gray-500">Valeur</span>
        </div>
        <div className="flex items-center gap-6">
          <Donut segments={typeBreakdown} />
          <div className="space-y-2">
            {typeBreakdown.map((s) => (
              <div key={s.label} className="flex items-center gap-3 text-sm">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: s.color }} />
                <span className="text-gray-700">{s.label}</span>
                <span className="ml-auto font-medium text-gray-900">{formatCurrency(s.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Répartition géographique</h3>
          <span className="text-xs text-gray-500">Top 5</span>
        </div>
        <div className="space-y-2">
          {geoBreakdown.map((g) => (
            <div key={g.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{g.label}</span>
                <span className="text-gray-900 font-medium">{g.value}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(100, (g.value / (geoBreakdown[0]?.value || 1)) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Performance par bien (Rdt. net %)</h3>
          <span className="text-xs text-gray-500">Annuel</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {performance.map((p) => (
            <div key={p.name} className="rounded-xl border p-3">
              <div className="text-sm text-gray-600">{p.name}</div>
              <div className="mt-2 h-2 w-full rounded bg-gray-100">
                <div className="h-2 rounded bg-emerald-500" style={{ width: `${Math.min(100, p.value)}%` }} />
              </div>
              <div className="mt-1 text-sm font-medium text-gray-900">{p.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
