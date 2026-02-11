import { Shield, User, CheckCircle, XCircle } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { Table, TableHeader, Th, Tr, Td } from '../components/ui/Table';
import { useAuth } from '../context/AuthContext';

export default function Users() {
  const { user, isAdmin } = useAuth();

  const permisosPorRol = {
    administrador: {
      nombre: 'Administrador',
      descripcion: 'Acceso total al sistema',
      color: 'purple',
      permisos: [
        'Gestión completa de productos',
        'Gestión de categorías',
        'Gestión de proveedores',
        'Registro de movimientos',
        'Acceso a todos los reportes',
        'Gestión de usuarios',
      ]
    },
    encargado: {
      nombre: 'Encargado de Depósito',
      descripcion: 'Gestión de inventario',
      color: 'blue',
      permisos: [
        'Lectura y actualización de productos',
        'Lectura de categorías',
        'Lectura de proveedores',
        'Registro de movimientos (entradas/salidas/ajustes)',
        'Acceso a reportes de inventario',
      ]
    },
    consultor: {
      nombre: 'Consultor',
      descripcion: 'Solo lectura',
      color: 'gray',
      permisos: [
        'Lectura de productos',
        'Lectura de categorías',
        'Lectura de proveedores',
        'Lectura de historial de movimientos',
        'Acceso a reportes de consulta',
      ]
    }
  };

  const rolActual = permisosPorRol[user?.rol] || permisosPorRol.consultor;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Usuarios y Permisos</h2>
          <p className="text-slate-500 text-sm mt-1">Gestión de accesos al sistema</p>
        </div>
      </div>

      {/* Current user info */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
            <User size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800">{user?.nombre}</h3>
            <p className="text-slate-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge color={rolActual.color}>{rolActual.nombre}</Badge>
              {user?.activo !== false && (
                <Badge color="green">Activo</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* User's permissions */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={20} className="text-indigo-600" />
          <h3 className="font-bold text-slate-800">Tus Permisos</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rolActual.permisos.map((permiso, index) => (
            <div key={index} className="flex items-center gap-2 text-slate-600">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <span className="text-sm">{permiso}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Roles overview */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={20} />
          <h3 className="font-bold text-slate-800">Roles del Sistema</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(permisosPorRol).map(([key, rol]) => (
            <div
              key={key}
              className={`bg-white p-4 rounded-lg border ${user?.rol === key ? 'ring-2 ring-indigo-500 border-indigo-200' : ''
                }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge color={rol.color}>{rol.nombre}</Badge>
                {user?.rol === key && (
                  <span className="text-xs text-indigo-600 font-medium">(Tu rol)</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-3">{rol.descripcion}</p>
              <ul className="space-y-1">
                {rol.permisos.slice(0, 3).map((p, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-1">
                    <CheckCircle size={12} className="text-green-500" />
                    {p}
                  </li>
                ))}
                {rol.permisos.length > 3 && (
                  <li className="text-xs text-slate-400">
                    +{rol.permisos.length - 3} más...
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Actions available info */}
      <Card>
        <h3 className="font-bold text-slate-800 mb-4">Acciones Disponibles por Módulo</h3>
        <Table>
          <TableHeader>
            <Th>Módulo</Th>
            <Th>Ver</Th>
            <Th>Crear</Th>
            <Th>Editar</Th>
            <Th>Eliminar</Th>
          </TableHeader>
          <tbody>
            <Tr>
              <Td className="font-medium">Productos</Td>
              <Td><CheckCircle size={18} className="text-green-500" /></Td>
              <Td>{user?.rol !== 'consultor' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-slate-300" />}</Td>
              <Td>{user?.rol !== 'consultor' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-slate-300" />}</Td>
              <Td>{user?.rol === 'administrador' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-slate-300" />}</Td>
            </Tr>
            <Tr>
              <Td className="font-medium">Categorías</Td>
              <Td><CheckCircle size={18} className="text-green-500" /></Td>
              <Td>{user?.rol === 'administrador' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-slate-300" />}</Td>
              <Td>{user?.rol === 'administrador' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-slate-300" />}</Td>
              <Td>{user?.rol === 'administrador' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-slate-300" />}</Td>
            </Tr>
            <Tr>
              <Td className="font-medium">Proveedores</Td>
              <Td><CheckCircle size={18} className="text-green-500" /></Td>
              <Td>{user?.rol === 'administrador' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-slate-300" />}</Td>
              <Td>{user?.rol !== 'consultor' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-slate-300" />}</Td>
              <Td>{user?.rol === 'administrador' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-slate-300" />}</Td>
            </Tr>
            <Tr>
              <Td className="font-medium">Movimientos</Td>
              <Td><CheckCircle size={18} className="text-green-500" /></Td>
              <Td>{user?.rol !== 'consultor' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-slate-300" />}</Td>
              <Td><XCircle size={18} className="text-slate-300" /></Td>
              <Td><XCircle size={18} className="text-slate-300" /></Td>
            </Tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
}