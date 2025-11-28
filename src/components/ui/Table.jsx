export const Table = ({ children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
    <table className="w-full text-left">{children}</table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
    <tr>{children}</tr>
  </thead>
);

export const Th = ({ children }) => (
  <th className="p-4 font-semibold text-xs uppercase tracking-wide text-slate-500">{children}</th>
);

export const Tr = ({ children, className = '' }) => (
  <tr className={`border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors ${className}`}>
    {children}
  </tr>
);

export const Td = ({ children, className = '' }) => (
  <td className={`p-4 text-sm text-slate-700 ${className}`}>{children}</td>
);