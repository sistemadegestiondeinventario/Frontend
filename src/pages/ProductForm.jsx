import { useForm } from "react-hook-form";
import { Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function ProductForm() {
  const { register } = useForm();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Alta de Producto</h2>
        <Link to="/dashboard/products"><Button variant="secondary" icon={X}>Cancelar</Button></Link>
      </div>
      <Card>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium mb-2">Nombre</label><input {...register("nombre")} className="w-full p-3 border rounded-lg"/></div>
            <div><label className="block text-sm font-medium mb-2">SKU</label><input {...register("sku")} className="w-full p-3 border rounded-lg"/></div>
          </div>
          <div className="grid grid-cols-3 gap-6">
             <div><label className="block text-sm font-medium mb-2">Categoría</label><select {...register("cat")} className="w-full p-3 border rounded-lg bg-white"><option>Herramientas</option></select></div>
             <div><label className="block text-sm font-medium mb-2">Precio</label><input type="number" {...register("precio")} className="w-full p-3 border rounded-lg"/></div>
             <div><label className="block text-sm font-medium mb-2">Stock Inicial</label><input type="number" {...register("stock")} className="w-full p-3 border rounded-lg"/></div>
          </div>
          <div className="flex justify-end pt-4"><Button icon={Save}>Guardar Producto</Button></div>
        </form>
      </Card>
    </div>
  );
}