import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar si hay un token guardado al cargar la app
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);

            const data = await authApi.login(email, password);

            // Guardar token y usuario
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.usuario));

            setUser(data.usuario);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('apiKey');
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    const hasPermission = (permission) => {
        if (!user) return false;

        // Permisos por rol
        const permisosPorRol = {
            administrador: ['*'], // Acceso total
            encargado: ['productos.leer', 'productos.actualizar', 'categorias.leer', 'proveedores.leer', 'movimientos.*'],
            consultor: ['productos.leer', 'categorias.leer', 'proveedores.leer', 'movimientos.leer', 'reportes.leer'],
        };

        const userPermisos = permisosPorRol[user.rol] || [];

        // Admin tiene acceso total
        if (userPermisos.includes('*')) return true;

        // Verificar permiso específico
        return userPermisos.some(p => {
            if (p.endsWith('.*')) {
                const base = p.replace('.*', '');
                return permission.startsWith(base);
            }
            return p === permission;
        });
    };

    const isAdmin = () => user?.rol === 'administrador';
    const isEncargado = () => user?.rol === 'encargado';
    const isConsultor = () => user?.rol === 'consultor';

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
        hasPermission,
        isAdmin,
        isEncargado,
        isConsultor,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}

export default AuthContext;
