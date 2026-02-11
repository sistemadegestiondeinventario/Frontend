import { useState, useEffect } from 'react';
import { Folder, MoreVertical, Plus, Edit, Trash2, Package } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import { LoadingOverlay } from '../components/ui/Spinner';
import { categoriasApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const COLORS = [
  'bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
];

export default function Categories() {
  const { isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Modal de formulario
  const [formModal, setFormModal] = useState({ open: false, categoria: null });
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [saving, setSaving] = useState(false);

  // Modal de eliminación
  const [deleteModal, setDeleteModal] = useState({ open: false, categoria: null });
  const [deleting, setDeleting] = useState(false);

  // Dropdown de acciones
  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriasApi.getAll();
      setCategorias(data.categorias || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClick = () => setOpenDropdown(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const openCreateModal = () => {
    setFormData({ nombre: '', descripcion: '' });
    setFormModal({ open: true, categoria: null });
  };

  const openEditModal = (categoria) => {
    setFormData({ nombre: categoria.nombre, descripcion: categoria.descripcion || '' });
    setFormModal({ open: true, categoria });
    setOpenDropdown(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    setSaving(true);
    try {
      if (formModal.categoria) {
        await categoriasApi.update(formModal.categoria.id, formData);
        setSuccess('Categoría actualizada correctamente');
      } else {
        await categoriasApi.create(formData);
        setSuccess('Categoría creada correctamente');
      }
      setFormModal({ open: false, categoria: null });
      fetchCategorias();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.categoria) return;

    setDeleting(true);
    try {
      await categoriasApi.delete(deleteModal.categoria.id);
      setSuccess('Categoría eliminada correctamente');
      setDeleteModal({ open: false, categoria: null });
      fetchCategorias();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const getColor = (index) => COLORS[index % COLORS.length];

  if (loading) {
    return <LoadingOverlay message="Cargando categorías..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Categorías</h2>
          <p className="text-slate-500 text-sm mt-1">{categorias.length} categorías</p>
        </div>
        {isAdmin() && (
          <Button icon={Plus} onClick={openCreateModal}>Nueva Categoría</Button>
        )}
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Grid de categorías */}
      {categorias.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Folder size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No hay categorías</h3>
          <p className="text-slate-500 text-sm mb-4">Comienza creando tu primera categoría</p>
          {isAdmin() && (
            <Button icon={Plus} onClick={openCreateModal}>Nueva Categoría</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria, index) => (
            <div
              key={categoria.id}
              className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all relative group"
            >
              {/* Dropdown menu */}
              {isAdmin() && (
                <div className="absolute top-4 right-4">
                  <button
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === categoria.id ? null : categoria.id);
                    }}
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openDropdown === categoria.id && (
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border py-1 z-10">
                      <button
                        onClick={() => openEditModal(categoria)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit size={14} /> Editar
                      </button>
                      <button
                        onClick={() => {
                          setDeleteModal({ open: true, categoria });
                          setOpenDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex gap-4 items-center mb-4">
                <div className={`w-12 h-12 rounded-lg ${getColor(index)} flex items-center justify-center text-white shadow-lg`}>
                  <Folder size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{categoria.nombre}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Package size={14} />
                    {categoria.productosCount ?? categoria._count?.productos ?? 0} productos
                  </p>
                </div>
              </div>

              {categoria.descripcion && (
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{categoria.descripcion}</p>
              )}

              {/* Progress bar (decorativo) */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${getColor(index)} opacity-60`}
                  style={{ width: `${Math.min(100, (categoria.productosCount || 0) * 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, categoria: null })}
        title={formModal.categoria ? 'Editar Categoría' : 'Nueva Categoría'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Nombre de la categoría"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              rows={3}
              placeholder="Descripción opcional..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFormModal({ open: false, categoria: null })}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : (formModal.categoria ? 'Guardar' : 'Crear')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, categoria: null })}
        title="Eliminar Categoría"
        size="sm"
      >
        <p className="text-slate-600 mb-6">
          ¿Estás seguro de eliminar la categoría <strong>{deleteModal.categoria?.nombre}</strong>?
          {deleteModal.categoria?.productosCount > 0 && (
            <span className="block mt-2 text-orange-600 text-sm">
              Esta categoría tiene {deleteModal.categoria.productosCount} productos asociados.
            </span>
          )}
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ open: false, categoria: null })}
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
    </div>
  );
}