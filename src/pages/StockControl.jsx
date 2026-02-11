import { useState, useEffect, useCallback } from 'react';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, Plus, AlertTriangle, Search, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Table, TableHeader, Th, Tr, Td } from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import Pagination from '../components/ui/Pagination';
import { LoadingOverlay } from '../components/ui/Spinner';
import { movimientosApi, productosApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StockControl() {
  const { isAdmin, isEncargado } = useAuth();
  const canCreate = isAdmin() || isEncargado();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [movimientos, setMovimientos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [pagination, setPagination] = useState({ pagina: 1, limite: 15, total: 0, totalPaginas: 0 });

  // Filtros
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Modal de nuevo movimiento
  const [moveModal, setMoveModal] = useState({ open: false, tipo: 'entrada' });
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    producto_id: '',
    cantidad: '',
    motivo: '',
    observaciones: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchMovimientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { pagina: pagination.pagina, limite: pagination.limite };
      if (tipoFiltro) params.tipo_movimiento = tipoFiltro;
      if (fechaDesde) params.desde = fechaDesde;
      if (fechaHasta) params.hasta = fechaHasta;

      const data = await movimientosApi.getAll(params);
      setMovimientos(data.movimientos || data || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPaginas: data.totalPaginas || 1
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.pagina, pagination.limite, tipoFiltro, fechaDesde, fechaHasta]);

  const fetchAlertas = async () => {
    try {
      const data = await productosApi.getAlertasStock();
      setAlertas(data.alertas || data || []);
    } catch (err) {
      console.error('Error cargando alertas:', err);
    }
  };

  const fetchProductos = async () => {
    try {
      const data = await productosApi.getAll({ limite: 200 });
      setProductos(data.productos || []);
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  };

  useEffect(() => {
    fetchMovimientos();
    fetchAlertas();
  }, [fetchMovimientos]);

  const openMoveModal = (tipo) => {
    fetchProductos();
    setFormData({ producto_id: '', cantidad: '', motivo: '', observaciones: '' });
    setMoveModal({ open: true, tipo });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.producto_id || !formData.cantidad) {
      setError('Producto y cantidad son obligatorios');
      return;
    }

    setSaving(true);
    try {
      await movimientosApi.create({
        producto_id: Number(formData.producto_id),
        tipo_movimiento: moveModal.tipo,
        cantidad: Number(formData.cantidad),
        motivo: formData.motivo || `${moveModal.tipo.charAt(0).toUpperCase() + moveModal.tipo.slice(1)} de stock`,
        observaciones: formData.observaciones
      });

      setSuccess(`${moveModal.tipo.charAt(0).toUpperCase() + moveModal.tipo.slice(1)} registrada correctamente`);
      setMoveModal({ open: false, tipo: 'entrada' });
      fetchMovimientos();
      fetchAlertas();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'entrada':
        return <ArrowDownCircle size={18} className="text-green-500" />;
      case 'salida':
        return <ArrowUpCircle size={18} className="text-red-500" />;
      default:
        return <RefreshCw size={18} className="text-blue-500" />;
    }
  };

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case 'entrada':
        return <Badge color="green">Entrada</Badge>;
      case 'salida':
        return <Badge color="red">Salida</Badge>;
      default:
        return <Badge color="blue">Ajuste</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Control de Movimientos</h1>
          <p className="text-slate-500 text-sm mt-1">Gestión de entradas, salidas y ajustes de stock</p>
        </div>
        {canCreate && (
          <div className="flex gap-2">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              icon={ArrowDownCircle}
              onClick={() => openMoveModal('entrada')}
            >
              Entrada
            </Button>
            <Button
              variant="danger"
              icon={ArrowUpCircle}
              onClick={() => openMoveModal('salida')}
            >
              Salida
            </Button>
            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={() => openMoveModal('ajuste')}
            >
              Ajuste
            </Button>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Stock Alerts */}
      {alertas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {alertas.slice(0, 4).map((alerta, index) => {
            const isCritical = alerta.nivel === 'critico' || alerta.stock_actual <= alerta.stock_critico;
            return (
              <div
                key={alerta.id || index}
                className={`p-4 rounded-lg flex justify-between items-center ${isCritical
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-orange-50 border border-orange-200'
                  }`}
              >
                <div>
                  <h3 className={`font-bold ${isCritical ? 'text-red-800' : 'text-orange-800'}`}>
                    {alerta.nombre}
                  </h3>
                  <p className={`text-sm ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
                    Stock: {alerta.stock_actual} | Mínimo: {alerta.stock_minimo}
                  </p>
                </div>
                <Badge color={isCritical ? 'red' : 'orange'}>
                  {isCritical ? 'CRÍTICO' : 'BAJO'}
                </Badge>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex flex-wrap gap-4">
          <select
            value={tipoFiltro}
            onChange={(e) => { setTipoFiltro(e.target.value); setPagination(prev => ({ ...prev, pagina: 1 })); }}
            className="p-2 border rounded-lg bg-white min-w-[160px]"
          >
            <option value="">Todos los tipos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="ajuste">Ajuste</option>
          </select>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" />
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => { setFechaDesde(e.target.value); setPagination(prev => ({ ...prev, pagina: 1 })); }}
              className="p-2 border rounded-lg"
              placeholder="Desde"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => { setFechaHasta(e.target.value); setPagination(prev => ({ ...prev, pagina: 1 })); }}
              className="p-2 border rounded-lg"
              placeholder="Hasta"
            />
          </div>
          {(tipoFiltro || fechaDesde || fechaHasta) && (
            <Button
              variant="ghost"
              onClick={() => {
                setTipoFiltro('');
                setFechaDesde('');
                setFechaHasta('');
                setPagination(prev => ({ ...prev, pagina: 1 }));
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingOverlay message="Cargando movimientos..." />
      ) : movimientos.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <RefreshCw size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No hay movimientos</h3>
          <p className="text-slate-500 text-sm">
            {tipoFiltro || fechaDesde || fechaHasta
              ? 'No se encontraron movimientos con los filtros aplicados'
              : 'Los movimientos de stock aparecerán aquí'}
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <Th>Tipo</Th>
              <Th>Producto</Th>
              <Th>Cantidad</Th>
              <Th>Motivo</Th>
              <Th>Usuario</Th>
              <Th>Fecha</Th>
            </TableHeader>
            <tbody>
              {movimientos.map((mov) => (
                <Tr key={mov.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      {getTipoIcon(mov.tipo_movimiento)}
                      {getTipoBadge(mov.tipo_movimiento)}
                    </div>
                  </Td>
                  <Td className="font-medium">
                    {mov.Producto?.nombre || mov.producto_nombre || 'Producto'}
                  </Td>
                  <Td>
                    <span className={`font-bold ${mov.tipo_movimiento === 'entrada' ? 'text-green-600' :
                        mov.tipo_movimiento === 'salida' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                      {mov.tipo_movimiento === 'entrada' ? '+' : mov.tipo_movimiento === 'salida' ? '-' : ''}
                      {mov.cantidad}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-slate-600">{mov.motivo || '-'}</span>
                    {mov.observaciones && (
                      <p className="text-xs text-slate-400 truncate max-w-xs">{mov.observaciones}</p>
                    )}
                  </Td>
                  <Td>
                    <span className="text-slate-600">
                      {mov.Usuario?.nombre || mov.usuario_nombre || '-'}
                    </span>
                  </Td>
                  <Td className="text-slate-500 text-sm">
                    {formatDate(mov.createdAt || mov.fecha)}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            currentPage={pagination.pagina}
            totalPages={pagination.totalPaginas}
            onPageChange={(page) => setPagination(prev => ({ ...prev, pagina: page }))}
          />
        </>
      )}

      {/* Movement Modal */}
      <Modal
        isOpen={moveModal.open}
        onClose={() => setMoveModal({ open: false, tipo: 'entrada' })}
        title={`Registrar ${moveModal.tipo.charAt(0).toUpperCase() + moveModal.tipo.slice(1)}`}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Producto <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.producto_id}
              onChange={(e) => setFormData(prev => ({ ...prev, producto_id: e.target.value }))}
              className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Seleccionar producto</option>
              {productos.map(prod => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre} (Stock: {prod.stock_actual ?? 0})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.cantidad}
              onChange={(e) => setFormData(prev => ({ ...prev, cantidad: e.target.value }))}
              placeholder="Cantidad"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Motivo</label>
            <input
              type="text"
              value={formData.motivo}
              onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
              placeholder={
                moveModal.tipo === 'entrada' ? 'Ej: Compra a proveedor' :
                  moveModal.tipo === 'salida' ? 'Ej: Venta' : 'Ej: Inventario físico'
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Observaciones</label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              rows={2}
              placeholder="Notas adicionales (opcional)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setMoveModal({ open: false, tipo: 'entrada' })}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className={
                moveModal.tipo === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  moveModal.tipo === 'salida' ? 'bg-red-600 hover:bg-red-700' : ''
              }
            >
              {saving ? 'Registrando...' : `Registrar ${moveModal.tipo}`}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}