export default function Spinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-3',
    };

    return (
        <div className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${sizes[size]} ${className}`} />
    );
}

export function LoadingOverlay({ message = 'Cargando...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="lg" />
            <p className="mt-4 text-slate-500 text-sm">{message}</p>
        </div>
    );
}

export function FullPageLoader() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <Spinner size="lg" />
                <p className="mt-4 text-slate-600">Cargando...</p>
            </div>
        </div>
    );
}
