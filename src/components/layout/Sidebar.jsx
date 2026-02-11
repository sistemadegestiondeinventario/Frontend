import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ArrowRightLeft, Truck, Layers, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAdmin } = useAuth();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 text-sm font-medium
    ${isActive(path)
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
  `;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">I</div>
        <span className="text-xl font-bold text-white tracking-wide">InvControl</span>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 px-4 mt-2">Principal</p>
        <Link to="/dashboard" className={linkClass('/dashboard')}><LayoutDashboard size={18} /> Dashboard</Link>
        <Link to="/dashboard/products" className={linkClass('/dashboard/products')}><Package size={18} /> Productos</Link>
        <Link to="/dashboard/categories" className={linkClass('/dashboard/categories')}><Layers size={18} /> Categorías</Link>
        <Link to="/dashboard/stock" className={linkClass('/dashboard/stock')}><ArrowRightLeft size={18} /> Movimientos</Link>

        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-8 mb-4 px-4">Administración</p>
        <Link to="/dashboard/suppliers" className={linkClass('/dashboard/suppliers')}><Truck size={18} /> Proveedores</Link>
        {isAdmin() && (
          <Link to="/dashboard/users" className={linkClass('/dashboard/users')}><Users size={18} /> Usuarios</Link>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {/* User info */}
        <div className="px-4 py-2 mb-2">
          <p className="text-sm font-medium text-slate-300 truncate">{user?.nombre}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}