import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ArrowRightLeft, Truck, Layers, LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 text-sm font-medium
    ${isActive(path) 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
  `;

  return (
    <aside className="w-64 h-screen bg-slate-900 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">I</div>
        <span className="text-xl font-bold text-white tracking-wide">InvControl</span>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 px-4 mt-2">Principal</p>
        <Link to="/dashboard" className={linkClass('/dashboard')}><LayoutDashboard size={18}/> Dashboard</Link>
        <Link to="/dashboard/products" className={linkClass('/dashboard/products')}><Package size={18}/> Productos</Link>
        <Link to="/dashboard/categories" className={linkClass('/dashboard/categories')}><Layers size={18}/> Categorías</Link>
        <Link to="/dashboard/stock" className={linkClass('/dashboard/stock')}><ArrowRightLeft size={18}/> Movimientos</Link>

        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-8 mb-4 px-4">Administración</p>
        <Link to="/dashboard/suppliers" className={linkClass('/dashboard/suppliers')}><Truck size={18}/> Proveedores</Link>
        <Link to="/dashboard/users" className={linkClass('/dashboard/users')}><Users size={18}/> Usuarios</Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">
          <LogOut size={18} /> Cerrar Sesión
        </Link>
      </div>
    </aside>
  );
}