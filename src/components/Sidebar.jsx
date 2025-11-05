import React from 'react';
import { Home, Building2, Users, FileText, TrendingUp, Wrench, Folder, BarChart2, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: Home },
  { label: 'Mes Biens', icon: Building2 },
  { label: 'Locataires', icon: Users },
  { label: 'Contrats', icon: FileText },
  { label: 'Transactions', icon: TrendingUp },
  { label: 'Travaux', icon: Wrench },
  { label: 'Documents', icon: Folder },
  { label: 'Rapports', icon: BarChart2 },
  { label: 'Paramètres', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col border-r bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="px-6 py-5 border-b">
        <div className="text-xl font-semibold tracking-tight">
          Immo<span className="text-blue-600">Pro</span>
        </div>
        <div className="text-xs text-gray-500">Gestion de patrimoine</div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <li key={label}>
              <button className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">
                <Icon className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                <span>{label}</span>
                {label === 'Contrats' && (
                  <span className="ml-auto inline-flex items-center justify-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                    2
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 text-xs text-gray-400">© {new Date().getFullYear()} ImmoPro</div>
    </aside>
  );
}
