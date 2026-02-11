import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { LayoutDashboard, AlertTriangle, TrendingUp, Package, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import { LoadingOverlay } from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import { reportesApi, movimientosApi, productosApi } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalMovimientos: 0,
    movimientosPorTipo: { entrada: 0, salida: 0, ajuste: 0 }
  });
  const [alertas, setAlertas] = useState([]);
  const [movimientosRecientes, setMovimientosRecientes] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Intentar cargar estadísticas
      try {
        const estadisticas = await reportesApi.getEstadisticas();
        setStats(estadisticas);
      } catch (e) {
        // Si falla reportes (puede requerir api key), usar datos básicos
        const productosData = await productosApi.getAll({ limite: 1 });
        setStats(prev => ({
          ...prev,
          totalProductos: productosData.total || 0
        }));
      }

      // Cargar alertas de stock
      try {
        const alertasData = await productosApi.getAlertasStock();
        setAlertas(alertasData.alertas || alertasData || []);
      } catch (e) {
        console.error('Error cargando alertas:', e);
      }

      // Cargar movimientos recientes
      try {
        const movData = await movimientosApi.getAll({ limite: 5 });
        setMovimientosRecientes(movData.movimientos || movData || []);
      } catch (e) {
        console.error('Error cargando movimientos:', e);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Datos para el gráfico
  const stockCritico = alertas.filter(a => a.nivel === 'critico' || a.stock_actual <= a.stock_critico).length;
  const stockBajo = alertas.filter(a => a.nivel === 'bajo' || (a.stock_actual > a.stock_critico && a.stock_actual <= a.stock_minimo)).length;
  const stockNormal = Math.max(0, (stats.totalProductos || 0) - stockCritico - stockBajo);

  const chartData = {
    labels: ['Normal', 'Bajo', 'Crítico'],
    datasets: [{
      data: [stockNormal, stockBajo, stockCritico],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingOverlay message="Cargando dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Productos"
          value={stats.totalProductos?.toLocaleString() || '0'}
          icon={Package}
          colorClass="bg-indigo-600"
        />
        <StatCard
          title="Stock Crítico"
          value={stockCritico}
          icon={AlertTriangle}
          colorClass="bg-red-500"
        />
        <StatCard
          title="Movimientos Totales"
          value={stats.totalMovimientos?.toLocaleString() || '0'}
          icon={TrendingUp}
          colorClass="bg-emerald-600"
        />
      </div>

      {/* Charts and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock chart */}
        <Card className="col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700">Estado del Stock</h3>
            <button
              onClick={fetchData}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          <div className="h-64 flex justify-center">
            <Doughnut
              data={chartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-green-50 rounded-lg p-2">
              <p className="font-bold text-green-700">{stockNormal}</p>
              <p className="text-green-600 text-xs">Normal</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-2">
              <p className="font-bold text-orange-700">{stockBajo}</p>
              <p className="text-orange-600 text-xs">Bajo</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2">
              <p className="font-bold text-red-700">{stockCritico}</p>
              <p className="text-red-600 text-xs">Crítico</p>
            </div>
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="col-span-2">
          <h3 className="font-bold text-slate-700 mb-4">Actividad Reciente</h3>
          {movimientosRecientes.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <TrendingUp size={40} className="mx-auto mb-2 opacity-50" />
              <p>No hay movimientos recientes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {movimientosRecientes.map((mov, index) => (
                <div key={mov.id || index} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-none">
                  <div className="flex items-center gap-3">
                    {mov.tipo_movimiento === 'entrada' ? (
                      <ArrowDownCircle size={20} className="text-green-500" />
                    ) : mov.tipo_movimiento === 'salida' ? (
                      <ArrowUpCircle size={20} className="text-red-500" />
                    ) : (
                      <RefreshCw size={20} className="text-blue-500" />
                    )}
                    <div>
                      <p className="font-medium text-slate-700">
                        {mov.tipo_movimiento?.charAt(0).toUpperCase() + mov.tipo_movimiento?.slice(1)}: {mov.Producto?.nombre || mov.producto_nombre || 'Producto'}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(mov.createdAt || mov.fecha)}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${mov.tipo_movimiento === 'entrada' ? 'text-green-600' :
                      mov.tipo_movimiento === 'salida' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                    {mov.tipo_movimiento === 'entrada' ? '+' : mov.tipo_movimiento === 'salida' ? '-' : ''}
                    {mov.cantidad}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Stock alerts */}
      {alertas.length > 0 && (
        <Card>
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-500" />
            Alertas de Stock ({alertas.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertas.slice(0, 6).map((alerta, index) => {
              const isCritical = alerta.nivel === 'critico' || alerta.stock_actual <= alerta.stock_critico;
              return (
                <div
                  key={alerta.id || index}
                  className={`p-4 rounded-lg border ${isCritical
                      ? 'bg-red-50 border-red-200'
                      : 'bg-orange-50 border-orange-200'
                    }`}
                >
                  <h4 className={`font-bold ${isCritical ? 'text-red-800' : 'text-orange-800'}`}>
                    {alerta.nombre}
                  </h4>
                  <p className={`text-sm ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
                    Stock: {alerta.stock_actual} | Mínimo: {alerta.stock_minimo}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}