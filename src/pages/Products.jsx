import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Table, TableHeader, Th, Tr, Td } from '../components/ui/Table';

export default function Products() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Productos</h2>
        <Link to="/dashboard/products/new"><Button icon={Plus}>Nuevo Producto</Button></Link>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"/>
        </div>
        <Button variant="secondary" icon={Filter}>Filtros</Button>
      </div>
      <Table>
        <TableHeader><Th>Producto</Th><Th>Categoría</Th><Th>Precio</Th><Th>Stock</Th><Th>Estado</Th><Th>Acciones</Th></TableHeader>
        <tbody>
          <Tr>
            <Td className="font-medium">Taladro Percutor</Td><Td>Herramientas</Td><Td>$ 150.00</Td><Td>45</Td><Td><Badge color="green">Normal</Badge></Td>
            <Td><div className="flex gap-2"><Button variant="ghost" className="p-2"><Edit size={16}/></Button><Button variant="ghost" className="p-2 text-red-500"><Trash2 size={16}/></Button></div></Td>
          </Tr>
          <Tr>
            <Td className="font-medium">Lija #180</Td><Td>Insumos</Td><Td>$ 0.50</Td><Td>2</Td><Td><Badge color="red">Crítico</Badge></Td>
            <Td><div className="flex gap-2"><Button variant="ghost" className="p-2"><Edit size={16}/></Button><Button variant="ghost" className="p-2 text-red-500"><Trash2 size={16}/></Button></div></Td>
          </Tr>
        </tbody>
      </Table>
    </div>
  );
}