const API_URL = 'http://localhost:3000/api';
const API_KEY = 'api_key_desarrollo_super_secreto_12345'; // Mismo que en .env del backend

// Función para obtener el token del localStorage
const getToken = () => localStorage.getItem('token');

// Función para obtener el API key
const getApiKey = () => API_KEY;

// Headers comunes para las peticiones
const getHeaders = (includeApiKey = true) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (includeApiKey) {
        headers['x-api-key'] = getApiKey();
    }

    return headers;
};

// Función helper para manejar respuestas
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ mensaje: 'Error de conexión' }));
        throw new Error(error.mensaje || error.error || 'Error en la petición');
    }
    return response.json();
};

// ==================== USUARIOS / AUTH ====================

export const authApi = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },

    registro: async (userData) => {
        const response = await fetch(`${API_URL}/usuarios/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },

    getPerfil: async () => {
        const response = await fetch(`${API_URL}/usuarios/perfil`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    updatePerfil: async (data) => {
        const response = await fetch(`${API_URL}/usuarios/perfil`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    getPermisos: async () => {
        const response = await fetch(`${API_URL}/usuarios/permisos`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};

// ==================== PRODUCTOS ====================

export const productosApi = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.pagina) queryParams.append('pagina', params.pagina);
        if (params.limite) queryParams.append('limite', params.limite);
        if (params.categoria) queryParams.append('categoria', params.categoria);
        if (params.proveedor) queryParams.append('proveedor', params.proveedor);
        if (params.stock) queryParams.append('stock', params.stock);
        if (params.buscar) queryParams.append('buscar', params.buscar);

        const url = `${API_URL}/productos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    create: async (producto) => {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(producto),
        });
        return handleResponse(response);
    },

    update: async (id, producto) => {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(producto),
        });
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getAlertasStock: async () => {
        const response = await fetch(`${API_URL}/productos/alertas/stock`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};

// ==================== CATEGORÍAS ====================

export const categoriasApi = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/categorias`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/categorias/${id}`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getProductos: async (id, params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.pagina) queryParams.append('pagina', params.pagina);
        if (params.limite) queryParams.append('limite', params.limite);

        const url = `${API_URL}/categorias/${id}/productos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    create: async (categoria) => {
        const response = await fetch(`${API_URL}/categorias`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(categoria),
        });
        return handleResponse(response);
    },

    update: async (id, categoria) => {
        const response = await fetch(`${API_URL}/categorias/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(categoria),
        });
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/categorias/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};

// ==================== PROVEEDORES ====================

export const proveedoresApi = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.pagina) queryParams.append('pagina', params.pagina);
        if (params.limite) queryParams.append('limite', params.limite);
        if (params.buscar) queryParams.append('buscar', params.buscar);

        const url = `${API_URL}/proveedores${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/proveedores/${id}`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getProductos: async (id, params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.pagina) queryParams.append('pagina', params.pagina);
        if (params.limite) queryParams.append('limite', params.limite);

        const url = `${API_URL}/proveedores/${id}/productos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    create: async (proveedor) => {
        const response = await fetch(`${API_URL}/proveedores`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(proveedor),
        });
        return handleResponse(response);
    },

    update: async (id, proveedor) => {
        const response = await fetch(`${API_URL}/proveedores/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(proveedor),
        });
        return handleResponse(response);
    },

    desactivar: async (id) => {
        const response = await fetch(`${API_URL}/proveedores/${id}/desactivar`, {
            method: 'PATCH',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};

// ==================== MOVIMIENTOS ====================

export const movimientosApi = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.pagina) queryParams.append('pagina', params.pagina);
        if (params.limite) queryParams.append('limite', params.limite);
        if (params.producto_id) queryParams.append('producto_id', params.producto_id);
        if (params.tipo_movimiento) queryParams.append('tipo_movimiento', params.tipo_movimiento);
        if (params.desde) queryParams.append('desde', params.desde);
        if (params.hasta) queryParams.append('hasta', params.hasta);

        const url = `${API_URL}/movimientos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getByProducto: async (productoId, params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.pagina) queryParams.append('pagina', params.pagina);
        if (params.limite) queryParams.append('limite', params.limite);

        const url = `${API_URL}/movimientos/producto/${productoId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    create: async (movimiento) => {
        const response = await fetch(`${API_URL}/movimientos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(movimiento),
        });
        return handleResponse(response);
    },

    getAlertasStock: async () => {
        const response = await fetch(`${API_URL}/movimientos/alertas/stock`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getResumen: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.desde) queryParams.append('desde', params.desde);
        if (params.hasta) queryParams.append('hasta', params.hasta);

        const url = `${API_URL}/movimientos/resumen/general${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};

// ==================== REPORTES ====================

export const reportesApi = {
    // JSON Reports
    getEstadisticas: async () => {
        const response = await fetch(`${API_URL}/reportes/json/estadisticas`, {
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    getMovimientosPorTipo: async (desde, hasta) => {
        const response = await fetch(`${API_URL}/reportes/json/movimientos-por-tipo?desde=${desde}&hasta=${hasta}`, {
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    getProductosMasMovidos: async (desde, hasta, limite = 10) => {
        const response = await fetch(`${API_URL}/reportes/json/productos-mas-movidos?desde=${desde}&hasta=${hasta}&limite=${limite}`, {
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    getValorPromedioPorCategoria: async () => {
        const response = await fetch(`${API_URL}/reportes/json/valor-promedio-categoria`, {
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    // PDF Downloads
    downloadPdfEstadisticas: () => {
        window.open(`${API_URL}/reportes/pdf/estadisticas`, '_blank');
    },

    downloadPdfProductosPorCategoria: () => {
        window.open(`${API_URL}/reportes/pdf/productos-por-categoria`, '_blank');
    },

    downloadPdfMovimientos: (desde, hasta) => {
        window.open(`${API_URL}/reportes/pdf/movimientos?desde=${desde}&hasta=${hasta}`, '_blank');
    },

    downloadPdfAlertasStock: () => {
        window.open(`${API_URL}/reportes/pdf/alertas-stock`, '_blank');
    },

    // Excel Downloads
    downloadExcelProductos: () => {
        window.open(`${API_URL}/reportes/excel/productos`, '_blank');
    },

    downloadExcelMovimientos: (desde, hasta) => {
        window.open(`${API_URL}/reportes/excel/movimientos?desde=${desde}&hasta=${hasta}`, '_blank');
    },

    downloadExcelAlertasStock: () => {
        window.open(`${API_URL}/reportes/excel/alertas-stock`, '_blank');
    },

    downloadExcelEstadisticas: () => {
        window.open(`${API_URL}/reportes/excel/estadisticas`, '_blank');
    },
};
