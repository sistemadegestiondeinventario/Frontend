import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { productosApi } from '../services/api';

export default function DashboardLayout() {
  const { user } = useAuth();
  const [alertCount, setAlertCount] = useState(0);

  // Cargar conteo de alertas de stock
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await productosApi.getAlertasStock();
        const alerts = data.alertas || data;
        setAlertCount(Array.isArray(alerts) ? alerts.length : 0);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    fetchAlerts();
  }, []);

  const getRolLabel = (rol) => {
    const labels = {
      administrador: 'Administrador',
      encargado: 'Encargado de Depósito',
      consultor: 'Consultor',
    };
    return labels[rol] || rol;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-lg w-96">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar productos, categorías..."
              className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-6 border-l">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700">{user?.nombre || 'Usuario'}</p>
                <p className="text-xs text-slate-500">{getRolLabel(user?.rol)}</p>
              </div>
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto"><Outlet /></div>
      </main>
    </div>
  );
}