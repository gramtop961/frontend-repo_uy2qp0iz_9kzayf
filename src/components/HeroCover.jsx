import React from 'react';
import Spline from '@splinetool/react-spline';
import { Bell, Search, User } from 'lucide-react';

export default function HeroCover({ onSearch }) {
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border bg-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/1VHYoewWfi45VYZ5/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white"></div>
      <div className="relative z-10 flex h-full items-start justify-between p-6 md:p-8">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">Tableau de bord immobilier</h1>
          <p className="text-gray-600">Suivez la valeur de votre patrimoine, vos revenus et vos performances locatives en un coup d'œil.</p>
          <div className="pointer-events-auto mt-4 flex items-center gap-2 rounded-xl border bg-white/80 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
            <Search className="h-4 w-4 text-gray-400 ml-2" />
            <input
              placeholder="Rechercher un bien, un locataire, un contrat..."
              className="w-full bg-transparent p-2 text-sm outline-none"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
        <div className="pointer-events-auto hidden md:flex items-center gap-3">
          <button className="relative rounded-full border bg-white/80 p-2 shadow-sm hover:bg-white">
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-medium text-white">3</span>
          </button>
          <div className="flex items-center gap-3 rounded-full border bg-white/80 px-3 py-2 shadow-sm">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white grid place-items-center">
              <User className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Camille Dupont</div>
              <div className="text-xs text-gray-500">Propriétaire</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
