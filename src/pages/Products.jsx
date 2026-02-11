import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Table, TableHeader, Th, Tr, Td } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import { LoadingOverlay } from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import { productosApi, categoriasApi, proveedoresApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const navigate = useNavigate();
  const { isAdmin, isEncargado } = useAuth();
  const canEdit = isAdmin() || isEncargado();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [productos, setProductos] = useState([]);
  const [pagination, setPagination] = useState({
    pagina: 1,
    limite: 10,
    total: 0,
    totalPaginas: 0
  });

  // Filtros
  const [buscar, setBuscar] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [proveedorFiltro, setProveedorFiltro] = useState('');
  const [stockFiltro, setStockFiltro] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Datos para filtros
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // Modal de confirmación de eliminación
  const [deleteModal, setDeleteModal] = useState({ open: false, producto: null });
  const [deleting, setDeleting] = useState(false);

  // Modal de detalles
  const [detailModal, setDetailModal] = useState({ open: false, producto: null });

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        pagina: pagination.pagina,
        limite: pagination.limite,
      };
      if (buscar) params.buscar = buscar;
      if (categoriaFiltro) params.categoria = categoriaFiltro;
      if (proveedorFiltro) params.proveedor = proveedorFiltro;
      if (stockFiltro) params.stock = stockFiltro;

      const data = await productosApi.getAll(params);
      setProductos(data.productos || []);
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
  }, [pagination.pagina, pagination.limite, buscar, categoriaFiltro, proveedorFiltro, stockFiltro]);

  // Cargar categorías y proveedores para filtros
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [catsData, provsData] = await Promise.all([
          categoriasApi.getAll(),
          proveedoresApi.getAll({ limite: 100 })
        ]);
        setCategorias(catsData.categorias || catsData || []);
        setProveedores(provsData.proveedores || provsData || []);
      } catch (err) {
        console.error('Error cargando filtros:', err);
      }
    };
    fetchFiltersData();
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, pagina: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [buscar]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, pagina: page }));
  };

  const handleDelete = async () => {
    if (!deleteModal.producto) return;

    setDeleting(true);
    try {
      await productosApi.delete(deleteModal.producto.id);
      setSuccess('Producto eliminado correctamente');
      setDeleteModal({ open: false, producto: null });
      fetchProductos();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const getStockBadge = (producto) => {
    const stock = producto.stock_actual ?? producto.stock ?? 0;
    const minimo = producto.stock_minimo ?? 10;
    const critico = producto.stock_critico ?? 5;

    if (stock <= critico) {
      return <Badge color="red">Crítico</Badge>;
    } else if (stock <= minimo) {
      return <Badge color="orange">Bajo</Badge>;
    }
    return <Badge color="green">Normal</Badge>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price || 0);
  };

  const clearFilters = () => {
    setCategoriaFiltro('');
    setProveedorFiltro('');
    setStockFiltro('');
    setBuscar('');
    setPagination(prev => ({ ...prev, pagina: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Productos</h2>
          <p className="text-slate-500 text-sm mt-1">
            {pagination.total} productos en total
          </p>
        </div>
        {canEdit && (
          <Link to="/dashboard/products/new">
            <Button icon={Plus}>Nuevo Producto</Button>
          </Link>
        )}
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button
            variant="secondary"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'ring-2 ring-indigo-500' : ''}
          >
            Filtros
          </Button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <select
              value={categoriaFiltro}
              onChange={(e) => { setCategoriaFiltro(e.target.value); setPagination(prev => ({ ...prev, pagina: 1 })); }}
              className="p-2 border rounded-lg bg-white"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            <select
              value={proveedorFiltro}
              onChange={(e) => { setProveedorFiltro(e.target.value); setPagination(prev => ({ ...prev, pagina: 1 })); }}
              className="p-2 border rounded-lg bg-white"
            >
              <option value="">Todos los proveedores</option>
              {proveedores.map(prov => (
                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
              ))}
            </select>
            <select
              value={stockFiltro}
              onChange={(e) => { setStockFiltro(e.target.value); setPagination(prev => ({ ...prev, pagina: 1 })); }}
              className="p-2 border rounded-lg bg-white"
            >
              <option value="">Todo el stock</option>
              <option value="bajo">Stock bajo</option>
              <option value="critico">Stock crítico</option>
            </select>
            <Button variant="secondary" icon={X} onClick={clearFilters}>
              Limpiar
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <LoadingOverlay message="Cargando productos..." />
      ) : productos.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="text-slate-400 mb-4">
            <Search size={48} className="mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">No se encontraron productos</h3>
          <p className="text-slate-500 text-sm">
            {buscar || categoriaFiltro || proveedorFiltro || stockFiltro
              ? 'Intenta con otros filtros de búsqueda'
              : 'Comienza agregando tu primer producto'}
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <Th>Código</Th>
              <Th>Producto</Th>
              <Th>Categoría</Th>
              <Th>Precio</Th>
              <Th>Stock</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </TableHeader>
            <tbody>
              {productos.map((producto) => (
                <Tr key={producto.id}>
                  <Td className="font-mono text-xs text-slate-500">{producto.codigo}</Td>
                  <Td>
                    <div>
                      <p className="font-medium">{producto.nombre}</p>
                      {producto.Proveedor && (
                        <p className="text-xs text-slate-400">{producto.Proveedor.nombre}</p>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <Badge color="blue">{producto.Categoria?.nombre || 'Sin categoría'}</Badge>
                  </Td>
                  <Td>{formatPrice(producto.precio_venta)}</Td>
                  <Td className="font-medium">{producto.stock_actual ?? producto.stock ?? 0}</Td>
                  <Td>{getStockBadge(producto)}</Td>
                  <Td>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        className="p-2"
                        onClick={() => setDetailModal({ open: true, producto })}
                      >
                        <Eye size={16} />
                      </Button>
                      {canEdit && (
                        <>
                          <Button
                            variant="ghost"
                            className="p-2"
                            onClick={() => navigate(`/dashboard/products/${producto.id}/edit`)}
                          >
                            <Edit size={16} />
                          </Button>
                          {isAdmin() && (
                            <Button
                              variant="ghost"
                              className="p-2 text-red-500"
                              onClick={() => setDeleteModal({ open: true, producto })}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            currentPage={pagination.pagina}
            totalPages={pagination.totalPaginas}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, producto: null })}
        title="Eliminar Producto"
        size="sm"
      >
        <p className="text-slate-600 mb-6">
          ¿Estás seguro de que deseas eliminar el producto <strong>{deleteModal.producto?.nombre}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ open: false, producto: null })}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </Modal>

      {/* Detail modal */}
      <Modal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, producto: null })}
        title={detailModal.producto?.nombre || 'Detalle del Producto'}
        size="lg"
      >
        {detailModal.producto && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Código</p>
                <p className="font-medium">{detailModal.producto.codigo}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Categoría</p>
                <p className="font-medium">{detailModal.producto.Categoria?.nombre || 'Sin categoría'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Proveedor</p>
                <p className="font-medium">{detailModal.producto.Proveedor?.nombre || 'Sin proveedor'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Ubicación</p>
                <p className="font-medium">{detailModal.producto.ubicacion || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Precio Compra</p>
                <p className="font-medium">{formatPrice(detailModal.producto.precio_compra)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Precio Venta</p>
                <p className="font-medium">{formatPrice(detailModal.producto.precio_venta)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Stock Actual</p>
                <p className="font-medium">{detailModal.producto.stock_actual ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Stock Mínimo / Crítico</p>
                <p className="font-medium">{detailModal.producto.stock_minimo} / {detailModal.producto.stock_critico}</p>
              </div>
            </div>
            {detailModal.producto.descripcion && (
              <div>
                <p className="text-sm text-slate-500">Descripción</p>
                <p className="text-slate-700">{detailModal.producto.descripcion}</p>
              </div>
            )}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="secondary" onClick={() => setDetailModal({ open: false, producto: null })}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}