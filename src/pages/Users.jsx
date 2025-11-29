import { Shield, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Table, TableHeader, Th, Tr, Td } from '../components/ui/Table';

export default function Users() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Usuarios</h2><Button icon={User}>Crear Usuario</Button></div>
      <Table>
        <TableHeader><Th>Usuario</Th><Th>Rol</Th><Th>Estado</Th><Th>Acciones</Th></TableHeader>
        <tbody>
          <Tr>
            <Td><div><p className="font-medium">Admin User</p><p className="text-xs text-slate-500">admin@sistema.com</p></div></Td>
            <Td><Badge color="purple">Administrador</Badge></Td>
            <Td><Badge color="green">Activo</Badge></Td>
            <Td><Button variant="ghost" className="text-indigo-600">Editar</Button></Td>
          </Tr>
        </tbody>
      </Table>
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 mb-4"><Shield size={20}/><h3 className="font-bold">Permisos</h3></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border"><h4 className="font-bold text-sm mb-2">Administrador</h4><p className="text-xs text-slate-500">Acceso total</p></div>
          <div className="bg-white p-4 rounded border"><h4 className="font-bold text-sm mb-2">Depósito</h4><p className="text-xs text-slate-500">Gestión de Stock</p></div>
        </div>
      </div>
    </div>
  );
}