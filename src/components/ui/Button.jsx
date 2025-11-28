export default function Button({ children, variant = 'primary', icon: Icon, className = '', ...props }) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 text-sm";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/30",
    secondary: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}