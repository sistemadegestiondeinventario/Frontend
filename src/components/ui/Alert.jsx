import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Alert({ type = 'info', message, onClose, className = '' }) {
    const styles = {
        success: {
            bg: 'bg-green-50 border-green-200',
            text: 'text-green-800',
            icon: CheckCircle,
            iconColor: 'text-green-500',
        },
        error: {
            bg: 'bg-red-50 border-red-200',
            text: 'text-red-800',
            icon: XCircle,
            iconColor: 'text-red-500',
        },
        warning: {
            bg: 'bg-orange-50 border-orange-200',
            text: 'text-orange-800',
            icon: AlertTriangle,
            iconColor: 'text-orange-500',
        },
        info: {
            bg: 'bg-blue-50 border-blue-200',
            text: 'text-blue-800',
            icon: Info,
            iconColor: 'text-blue-500',
        },
    };

    const style = styles[type];
    const Icon = style.icon;

    return (
        <div className={`${style.bg} ${style.text} border rounded-lg p-4 flex items-start gap-3 ${className}`}>
            <Icon className={`${style.iconColor} flex-shrink-0 mt-0.5`} size={20} />
            <p className="flex-1 text-sm">{message}</p>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}
