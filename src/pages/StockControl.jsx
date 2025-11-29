import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Table, TableHeader, Th, Tr, Td } from '../components/ui/Table';

export default function StockControl() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Control de Movimientos</h1>
        <div className="flex gap-2">
           <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" icon={ArrowDownCircle}>Entrada</Button>
           <Button variant="danger" icon={ArrowUpCircle}>Salida</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex justify-between items-center">
            <div><h3 className="font-bold text-red-800">Cemento Rápido</h3><p className="text-sm text-red-600">Stock: 2 | Mínimo: 10</p></div>
            <Badge color="red">CRÍTICO</Badge>
          </div>
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex justify-between items-center">
            <div><h3 className="font-bold text-orange-800">Lijadora</h3><p className="text-sm text-orange-600">Stock: 4 | Mínimo: 5</p></div>
            <Badge color="orange">BAJO</Badge>
          </div>
      </div>
      <Table>
          <TableHeader><Th>Tipo</Th><Th>Producto</Th><Th>Cantidad</Th><Th>Fecha</Th></TableHeader>
          <tbody>
            <Tr><Td><span className="flex items-center gap-2 text-green-600 font-bold"><ArrowDownCircle size={16}/> Entrada</span></Td><Td>Martillos</Td><Td>+50</Td><Td>25/11/2023</Td></Tr>
            <Tr><Td><span className="flex items-center gap-2 text-red-600 font-bold"><ArrowUpCircle size={16}/> Salida</span></Td><Td>Clavos</Td><Td>-200</Td><Td>24/11/2023</Td></Tr>
          </tbody>
      </Table>
    </div>
  );
}