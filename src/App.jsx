import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import HeroCover from './components/HeroCover.jsx';
import KPICards from './components/KPICards.jsx';
import ChartsOverview from './components/ChartsOverview.jsx';

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

const demoData = {
  properties: [
    {
      id: 'p1',
      name: 'Appartement Haussmann - Paris 8',
      type: 'Appartement',
      address: '12 Rue du Faubourg Saint-Honoré',
      city: 'Paris',
      postalCode: '75008',
      country: 'France',
      area: 72,
      rooms: 3,
      acquisitionDate: '2020-03-15',
      purchasePrice: 720000,
      currentValue: 820000,
      photos: [],
      rent: 2600,
      charges: 220,
      propertyTax: 1200,
      insurance: 380,
      managementFee: 0.06,
      status: 'Loué',
      leaseStart: '2023-01-01',
      leaseEnd: '2025-01-01',
    },
    {
      id: 'p2',
      name: 'Maison familiale - Lyon',
      type: 'Maison',
      address: '8 Chemin des Mûriers',
      city: 'Lyon',
      postalCode: '69005',
      country: 'France',
      area: 128,
      rooms: 6,
      acquisitionDate: '2018-06-20',
      purchasePrice: 540000,
      currentValue: 610000,
      photos: [],
      rent: 2100,
      charges: 180,
      propertyTax: 1500,
      insurance: 420,
      managementFee: 0.05,
      status: 'Loué',
      leaseStart: '2022-09-15',
      leaseEnd: '2025-09-14',
    },
    {
      id: 'p3',
      name: 'Local commercial - Bordeaux',
      type: 'Commerce',
      address: '25 Cours de l’Intendance',
      city: 'Bordeaux',
      postalCode: '33000',
      country: 'France',
      area: 90,
      rooms: 4,
      acquisitionDate: '2019-10-01',
      purchasePrice: 430000,
      currentValue: 500000,
      photos: [],
      rent: 2800,
      charges: 300,
      propertyTax: 1700,
      insurance: 450,
      managementFee: 0.05,
      status: 'Loué',
      leaseStart: '2021-04-01',
      leaseEnd: '2026-03-31',
    },
    {
      id: 'p4',
      name: 'Studio - Lille',
      type: 'Studio',
      address: '3 Rue Nationale',
      city: 'Lille',
      postalCode: '59000',
      country: 'France',
      area: 22,
      rooms: 1,
      acquisitionDate: '2021-02-11',
      purchasePrice: 145000,
      currentValue: 160000,
      photos: [],
      rent: 650,
      charges: 90,
      propertyTax: 650,
      insurance: 180,
      managementFee: 0.07,
      status: 'Vacant',
      leaseStart: null,
      leaseEnd: null,
    },
  ],
  transactions: [
    // Minimal set for 12 months revenue series
  ],
};

function computeKPIs(properties) {
  const totalProperties = properties.length;
  const totalValue = properties.reduce((a, p) => a + (p.currentValue || 0), 0);
  const monthlyIncome = properties.reduce((a, p) => a + (p.rent || 0), 0);
  const netYields = properties.map((p) => {
    const net = (p.rent || 0) - (p.charges || 0) - (p.managementFee || 0) * (p.rent || 0);
    return p.purchasePrice ? ((net * 12) / p.purchasePrice) * 100 : 0;
  });
  const averageNetYield = netYields.length ? netYields.reduce((a, b) => a + b, 0) / netYields.length : 0;
  const projectedAnnualIncome = monthlyIncome * 12;
  return { totalProperties, totalValue, monthlyIncome, averageNetYield, projectedAnnualIncome };
}

function App() {
  const [search, setSearch] = useState('');
  const [data, setData] = useLocalStorage('immo.pro.data', demoData);

  // Monthly revenue series (12 months) based on current rents, simple model
  const monthlySeries = useMemo(() => {
    const base = data.properties.reduce((a, p) => a + (p.rent || 0), 0);
    // create slight variation to simulate seasonality
    const months = Array.from({ length: 12 }, (_, i) => {
      const factor = 0.9 + (Math.sin(i / 12 * Math.PI * 2) + 1) * 0.05; // 0.9..1.1
      const value = Math.round(base * factor);
      return { value };
    });
    const max = Math.max(...months.map((m) => m.value), 1);
    return months.map((m) => ({ ...m, scaled: (m.value / max) * 100 }));
  }, [data.properties]);

  const filteredProps = useMemo(() => {
    if (!search) return data.properties;
    const q = search.toLowerCase();
    return data.properties.filter((p) =>
      [p.name, p.type, p.address, p.city, p.postalCode, p.country].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [data.properties, search]);

  const kpis = useMemo(() => computeKPIs(data.properties), [data.properties]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-900">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <HeroCover onSearch={setSearch} />
          <div className="mt-6 space-y-6">
            <KPICards kpis={kpis} />
            <ChartsOverview properties={filteredProps} transactions={data.transactions} monthlySeries={monthlySeries} />

            <section className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium">Mes biens</h3>
                <span className="text-sm text-gray-500">{filteredProps.length} éléments</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredProps.map((p) => {
                  const netMonthly = (p.rent || 0) - (p.charges || 0) - (p.managementFee || 0) * (p.rent || 0);
                  const netYield = p.purchasePrice ? ((netMonthly * 12) / p.purchasePrice) * 100 : 0;
                  return (
                    <article key={p.id} className="rounded-xl border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{p.name}</h4>
                          <p className="text-sm text-gray-600">{p.type} • {p.city}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${p.status === 'Loué' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Vacant' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg bg-gray-50 p-2">
                          <div className="text-xs text-gray-500">Loyer</div>
                          <div className="font-medium">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p.rent || 0)}</div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2">
                          <div className="text-xs text-gray-500">Valeur</div>
                          <div className="font-medium">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p.currentValue || 0)}</div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2">
                          <div className="text-xs text-gray-500">Net/mois</div>
                          <div className="font-medium">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(netMonthly)}</div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2">
                          <div className="text-xs text-gray-500">Rdt. net</div>
                          <div className="font-medium">{netYield.toFixed(1)}%</div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
