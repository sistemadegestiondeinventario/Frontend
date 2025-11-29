import { Phone, Mail, MapPin, ExternalLink, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Suppliers() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Proveedores</h2><Button icon={Plus}>Nuevo Proveedor</Button></div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-white rounded-xl border p-6 hover:shadow-md">
            <div className="flex justify-between mb-4"><h3 className="font-bold text-lg">Bosch Argentina</h3><ExternalLink size={18} className="text-slate-400"/></div>
            <div className="space-y-3 text-sm text-slate-600 mb-6">
              <div className="flex gap-3"><Phone size={16} className="text-indigo-600"/> +54 11 4455-6677</div>
              <div className="flex gap-3"><Mail size={16} className="text-indigo-600"/> ventas@bosch.ar</div>
            </div>
            <div className="flex gap-2"><Badge color="blue">Herramientas</Badge><Badge color="gray">30 días</Badge></div>
         </div>
       </div>
    </div>
  );
}