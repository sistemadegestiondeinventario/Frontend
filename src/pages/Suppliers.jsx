import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Plus, Edit, Trash2, Building2, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import Pagination from '../components/ui/Pagination';
import { LoadingOverlay } from '../components/ui/Spinner';
import { proveedoresApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Suppliers() {
  const { isAdmin, isEncargado } = useAuth();
  const canEdit = isAdmin() || isEncargado();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [pagination, setPagination] = useState({ pagina: 1, limite: 9, total: 0, totalPaginas: 0 });
  const [buscar, setBuscar] = useState('');

  // Modal de formulario
  const [formModal, setFormModal] = useState({ open: false, proveedor: null });
  const [formData, setFormData] = useState({
    nombre: '', contacto: '', telefono: '', email: '', direccion: '', cuit: '', condiciones_pago: ''
  });
  const [saving, setSaving] = useState(false);

  // Modal de desactivación
  const [deactivateModal, setDeactivateModal] = useState({ open: false, proveedor: null });
  const [deactivating, setDeactivating] = useState(false);

  const fetchProveedores = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { pagina: pagination.pagina, limite: pagination.limite };
      if (buscar) params.buscar = buscar;

      const data = await proveedoresApi.getAll(params);
      setProveedores(data.proveedores || data || []);
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
  };

  useEffect(() => {
    fetchProveedores();
  }, [pagination.pagina, buscar]);

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, pagina: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [buscar]);

  const openCreateModal = () => {
    setFormData({ nombre: '', contacto: '', telefono: '', email: '', direccion: '', cuit: '', condiciones_pago: '' });
    setFormModal({ open: true, proveedor: null });
  };

  const openEditModal = (proveedor) => {
    setFormData({
      nombre: proveedor.nombre || '',
      contacto: proveedor.contacto || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      direccion: proveedor.direccion || '',
      cuit: proveedor.cuit || '',
      condiciones_pago: proveedor.condiciones_pago || ''
    });
    setFormModal({ open: true, proveedor });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    setSaving(true);
    try {
      if (formModal.proveedor) {
        await proveedoresApi.update(formModal.proveedor.id, formData);
        setSuccess('Proveedor actualizado correctamente');
      } else {
        await proveedoresApi.create(formData);
        setSuccess('Proveedor creado correctamente');
      }
      setFormModal({ open: false, proveedor: null });
      fetchProveedores();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateModal.proveedor) return;

    setDeactivating(true);
    try {
      await proveedoresApi.desactivar(deactivateModal.proveedor.id);
      setSuccess('Proveedor desactivado correctamente');
      setDeactivateModal({ open: false, proveedor: null });
      fetchProveedores();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeactivating(false);
    }
  };

  if (loading && proveedores.length === 0) {
    return <LoadingOverlay message="Cargando proveedores..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Proveedores</h2>
          <p className="text-slate-500 text-sm mt-1">{pagination.total} proveedores</p>
        </div>
        {isAdmin() && (
          <Button icon={Plus} onClick={openCreateModal}>Nuevo Proveedor</Button>
        )}
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, contacto o email..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid de proveedores */}
      {proveedores.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Building2 size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No hay proveedores</h3>
          <p className="text-slate-500 text-sm mb-4">Comienza agregando tu primer proveedor</p>
          {isAdmin() && (
            <Button icon={Plus} onClick={openCreateModal}>Nuevo Proveedor</Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proveedores.map((proveedor) => (
              <div
                key={proveedor.id}
                className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-all ${proveedor.activo === false ? 'opacity-60' : ''
                  }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-slate-800 truncate">{proveedor.nombre}</h3>
                      {proveedor.activo === false && (
                        <Badge color="gray">Inactivo</Badge>
                      )}
                    </div>
                    {proveedor.contacto && (
                      <p className="text-sm text-slate-500">{proveedor.contacto}</p>
                    )}
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  {proveedor.telefono && (
                    <div className="flex gap-3 items-center">
                      <Phone size={16} className="text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{proveedor.telefono}</span>
                    </div>
                  )}
                  {proveedor.email && (
                    <div className="flex gap-3 items-center">
                      <Mail size={16} className="text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{proveedor.email}</span>
                    </div>
                  )}
                  {proveedor.direccion && (
                    <div className="flex gap-3 items-center">
                      <MapPin size={16} className="text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{proveedor.direccion}</span>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {proveedor.cuit && (
                    <Badge color="gray">CUIT: {proveedor.cuit}</Badge>
                  )}
                  {proveedor.condiciones_pago && (
                    <Badge color="blue">{proveedor.condiciones_pago}</Badge>
                  )}
                </div>

                {/* Actions */}
                {canEdit && proveedor.activo !== false && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="ghost"
                      className="flex-1 justify-center"
                      onClick={() => openEditModal(proveedor)}
                    >
                      <Edit size={16} className="mr-1" /> Editar
                    </Button>
                    {isAdmin() && (
                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => setDeactivateModal({ open: true, proveedor })}
                      >
                        <ToggleRight size={16} />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={pagination.pagina}
            totalPages={pagination.totalPaginas}
            onPageChange={(page) => setPagination(prev => ({ ...prev, pagina: page }))}
          />
        </>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, proveedor: null })}
        title={formModal.proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre del proveedor"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contacto</label>
              <input
                type="text"
                value={formData.contacto}
                onChange={(e) => setFormData(prev => ({ ...prev, contacto: e.target.value }))}
                placeholder="Persona de contacto"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="+54 11 1234-5678"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@ejemplo.com"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CUIT</label>
              <input
                type="text"
                value={formData.cuit}
                onChange={(e) => setFormData(prev => ({ ...prev, cuit: e.target.value }))}
                placeholder="20-12345678-9"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Condiciones de Pago</label>
              <select
                value={formData.condiciones_pago}
                onChange={(e) => setFormData(prev => ({ ...prev, condiciones_pago: e.target.value }))}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Seleccionar</option>
                <option value="Contado">Contado</option>
                <option value="15 días">15 días</option>
                <option value="30 días">30 días</option>
                <option value="60 días">60 días</option>
                <option value="90 días">90 días</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
              placeholder="Dirección completa"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFormModal({ open: false, proveedor: null })}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : (formModal.proveedor ? 'Guardar' : 'Crear')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deactivate Modal */}
      <Modal
        isOpen={deactivateModal.open}
        onClose={() => setDeactivateModal({ open: false, proveedor: null })}
        title="Desactivar Proveedor"
        size="sm"
      >
        <p className="text-slate-600 mb-6">
          ¿Estás seguro de desactivar el proveedor <strong>{deactivateModal.proveedor?.nombre}</strong>?
          No podrás asignar nuevos productos a este proveedor.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => setDeactivateModal({ open: false, proveedor: null })}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeactivate}
            disabled={deactivating}
          >
            {deactivating ? 'Desactivando...' : 'Desactivar'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}