import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X, ArrowLeft, Package } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import { LoadingOverlay } from '../components/ui/Spinner';
import { productosApi, categoriasApi, proveedoresApi } from '../services/api';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria_id: '',
      proveedor_id: '',
      precio_compra: '',
      precio_venta: '',
      stock_minimo: 10,
      stock_critico: 5,
      unidad_medida: 'unidad',
      ubicacion: '',
    }
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar categorías y proveedores
        const [catsData, provsData] = await Promise.all([
          categoriasApi.getAll(),
          proveedoresApi.getAll({ limite: 100 })
        ]);
        setCategorias(catsData.categorias || catsData || []);
        setProveedores(provsData.proveedores || provsData || []);

        // Si estamos editando, cargar el producto
        if (isEditing) {
          const producto = await productosApi.getById(id);
          reset({
            codigo: producto.codigo || '',
            nombre: producto.nombre || '',
            descripcion: producto.descripcion || '',
            categoria_id: producto.categoria_id || '',
            proveedor_id: producto.proveedor_id || '',
            precio_compra: producto.precio_compra || '',
            precio_venta: producto.precio_venta || '',
            stock_minimo: producto.stock_minimo || 10,
            stock_critico: producto.stock_critico || 5,
            unidad_medida: producto.unidad_medida || 'unidad',
            ubicacion: producto.ubicacion || '',
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Convertir valores numéricos
      const payload = {
        ...data,
        categoria_id: data.categoria_id ? Number(data.categoria_id) : null,
        proveedor_id: data.proveedor_id ? Number(data.proveedor_id) : null,
        precio_compra: data.precio_compra ? Number(data.precio_compra) : 0,
        precio_venta: data.precio_venta ? Number(data.precio_venta) : 0,
        stock_minimo: Number(data.stock_minimo) || 10,
        stock_critico: Number(data.stock_critico) || 5,
      };

      if (isEditing) {
        await productosApi.update(id, payload);
      } else {
        await productosApi.create(payload);
      }

      navigate('/dashboard/products');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingOverlay message="Cargando formulario..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/products">
            <Button variant="ghost" className="p-2">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isEditing ? 'Modifica los datos del producto' : 'Completa los datos para crear un nuevo producto'}
            </p>
          </div>
        </div>
        <Link to="/dashboard/products">
          <Button variant="secondary" icon={X}>Cancelar</Button>
        </Link>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Package size={20} />
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Código <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('codigo', { required: 'El código es obligatorio' })}
                  placeholder="PROD-001"
                  className={`w-full p-3 border rounded-lg ${errors.codigo ? 'border-red-300 focus:ring-red-500' : 'focus:ring-indigo-500'} focus:ring-2 outline-none`}
                />
                {errors.codigo && (
                  <p className="text-red-500 text-sm mt-1">{errors.codigo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                  placeholder="Nombre del producto"
                  className={`w-full p-3 border rounded-lg ${errors.nombre ? 'border-red-300 focus:ring-red-500' : 'focus:ring-indigo-500'} focus:ring-2 outline-none`}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                {...register('descripcion')}
                rows={3}
                placeholder="Descripción detallada del producto..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Clasificación */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-slate-700 mb-4">Clasificación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Categoría</label>
                <select
                  {...register('categoria_id')}
                  className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Proveedor</label>
                <select
                  {...register('proveedor_id')}
                  className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map(prov => (
                    <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ubicación</label>
                <input
                  {...register('ubicacion')}
                  placeholder="Ej: Estante A1"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Precios */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-slate-700 mb-4">Precios</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Precio de Compra <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    {...register('precio_compra', { required: 'El precio de compra es obligatorio', min: 0 })}
                    placeholder="0.00"
                    className="w-full p-3 pl-8 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                {errors.precio_compra && (
                  <p className="text-red-500 text-sm mt-1">{errors.precio_compra.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Precio de Venta <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    {...register('precio_venta', { required: 'El precio de venta es obligatorio', min: 0 })}
                    placeholder="0.00"
                    className="w-full p-3 pl-8 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                {errors.precio_venta && (
                  <p className="text-red-500 text-sm mt-1">{errors.precio_venta.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unidad de Medida</label>
                <select
                  {...register('unidad_medida')}
                  className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="unidad">Unidad</option>
                  <option value="kg">Kilogramo</option>
                  <option value="litro">Litro</option>
                  <option value="metro">Metro</option>
                  <option value="caja">Caja</option>
                  <option value="paquete">Paquete</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stock */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-slate-700 mb-4">Configuración de Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Mínimo</label>
                <input
                  type="number"
                  {...register('stock_minimo', { min: 0 })}
                  placeholder="10"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-xs text-slate-400 mt-1">Alerta cuando el stock baje de este valor</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stock Crítico</label>
                <input
                  type="number"
                  {...register('stock_critico', { min: 0 })}
                  placeholder="5"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-xs text-slate-400 mt-1">Alerta crítica cuando el stock baje de este valor</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              icon={Save}
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}