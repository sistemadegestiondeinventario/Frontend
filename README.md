# Sistema de Gestión de Inventario - Frontend

Frontend visual para el sistema de gestión de inventario construido con **React 18**, **Vite**, **Tailwind CSS** y **React Hook Form**.

##  Características

### Gestión de Productos
- ✅ Listado de productos con paginación
- ✅ Búsqueda avanzada con filtros
- ✅ Formulario para crear/editar productos
- ✅ Vista detallada de productos con historial
- ✅ Estados visuales (Normal, Bajo, Crítico)

### Gestión de Categorías
- ✅ Visualización de categorías en grid
- ✅ Contador de productos por categoría
- ✅ Barra de progreso visual
- ✅ Administración de categorías

### Gestión de Proveedores
- ✅ Listado de proveedores en cards
- ✅ Información de contacto
- ✅ Términos comerciales
- ✅ Categorías de productos por proveedor

### Control de Stock
- ✅ Registro de entradas y salidas
- ✅ Alertas visuales para stock mínimo
- ✅ Historial de movimientos
- ✅ Ajustes de inventario
- ✅ Gráfico de estado de stock

### Sistema de Usuarios
- ✅ Gestión de usuarios con roles
- ✅ Roles: Administrador, Encargado de depósito, Consultor
- ✅ Permisos diferenciados por rol
- ✅ Panel de control de acceso

### Dashboard
- ✅ Estadísticas en tiempo real
- ✅ Gráfico de estado de stock (Doughnut)
- ✅ Actividad reciente
- ✅ Alertas de stock crítico

## Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- Git (para clonar el repositorio)

Puedes verificar las versiones instaladas con:
```bash
node --version
npm --version
```

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Sidebar.jsx          # Barra lateral de navegación
│   │   └── ui/
│   │       ├── Button.jsx           # Componente botón reutilizable
│   │       ├── Badge.jsx            # Etiquetas de estado
│   │       ├── Card.jsx             # Tarjeta contenedora
│   │       ├── StatCard.jsx         # Tarjeta de estadísticas
│   │       └── Table.jsx            # Tabla con headers y rows
│   ├── pages/
│   │   ├── Login.jsx                # Página de inicio de sesión
│   │   ├── Dashboard.jsx            # Panel principal con gráficos
│   │   ├── Products.jsx             # Listado de productos
│   │   ├── ProductForm.jsx          # Formulario de productos
│   │   ├── Categories.jsx           # Gestión de categorías
│   │   ├── StockControl.jsx         # Control de stock
│   │   ├── Suppliers.jsx            # Gestión de proveedores
│   │   └── Users.jsx                # Gestión de usuarios
│   ├── layout/
│   │   └── DashboardLayout.jsx      # Layout principal con sidebar
│   ├── App.jsx                      # Componente principal
│   ├── main.jsx                     # Punto de entrada
│   └── index.css                    # Estilos globales
├── public/                          # Archivos estáticos
├── package.json                     # Dependencias del proyecto
├── vite.config.js                   # Configuración de Vite
├── tailwind.config.js               # Configuración de Tailwind CSS
├── postcss.config.js                # Configuración de PostCSS
└── index.html                       # HTML principal
```
### Tecnologias Utilizadas

    • React (versión 18+)
    • React Router para navegación
    • Axios para consumo de API
    • Chart.js / Recharts para gráficos estadísticos
    • CSS / Tailwind CSS para estilos
    • React Hook Form para formularios



