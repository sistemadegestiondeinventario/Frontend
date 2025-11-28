export default function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className={`${colorClass} text-white p-6 rounded-xl shadow-lg relative overflow-hidden`}>
      <div className="relative z-10">
        <p className="text-white/80 font-medium text-sm">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
      {Icon && <Icon className="absolute right-4 bottom-4 opacity-20" size={48} />}
    </div>
  );
}