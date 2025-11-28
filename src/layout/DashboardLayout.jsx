import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar'; // Asegúrate de que la ruta sea correcta
import { Bell, Search, User } from 'lucide-react';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-lg w-96">
            <Search size={18} className="text-slate-400"/>
            <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-sm w-full text-slate-600"/>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-indigo-600"><Bell size={20} /><span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span></button>
            <div className="flex items-center gap-3 pl-6 border-l">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700">Admin</p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700"><User size={20}/></div>
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto"><Outlet /></div>
      </main>
    </div>
  );
}