export default function Badge({ children, color = 'blue' }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
    purple: "bg-purple-100 text-purple-700",
    gray: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}