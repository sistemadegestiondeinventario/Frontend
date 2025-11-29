import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { LayoutDashboard, AlertTriangle, TrendingUp } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const data = {
    labels: ['Normal', 'Bajo', 'Crítico'],
    datasets: [{ data: [15, 5, 2], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'], borderWidth: 0 }]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Productos" value="1,240" icon={LayoutDashboard} colorClass="bg-indigo-600" />
        <StatCard title="Stock Crítico" value="12" icon={AlertTriangle} colorClass="bg-red-500" />
        <StatCard title="Movimientos Hoy" value="35" icon={TrendingUp} colorClass="bg-emerald-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <h3 className="font-bold text-slate-700 mb-4">Estado del Stock</h3>
          <div className="h-64 flex justify-center"><Doughnut data={data} options={{ maintainAspectRatio: false }} /></div>
        </Card>
        <Card className="col-span-2">
          <h3 className="font-bold text-slate-700 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2"><p>Entrada: Martillos</p><span className="text-green-600 font-bold">+50</span></div>
            <div className="flex justify-between border-b pb-2"><p>Salida: Clavos</p><span className="text-red-600 font-bold">-200</span></div>
            <div className="flex justify-between border-b pb-2"><p>Entrada: Cemento</p><span className="text-green-600 font-bold">+20</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}