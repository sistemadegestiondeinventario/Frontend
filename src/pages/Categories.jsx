import { Folder, MoreVertical, Plus } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Categories() {
  const cats = [{ name: "Herramientas", count: 120, color: "bg-blue-500" }, { name: "Construcción", count: 85, color: "bg-orange-500" }];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Categorías</h2><Button variant="secondary" icon={Plus}>Nueva</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cats.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow relative">
             <button className="absolute top-4 right-4 text-slate-400"><MoreVertical size={20}/></button>
             <div className="flex gap-4 items-center mb-4">
               <div className={`w-12 h-12 rounded-lg ${c.color} flex items-center justify-center text-white`}><Folder size={24}/></div>
               <div><h3 className="font-bold">{c.name}</h3><p className="text-sm text-slate-500">{c.count} productos</p></div>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full"><div className={`h-2 rounded-full ${c.color}`} style={{width: '45%'}}></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}