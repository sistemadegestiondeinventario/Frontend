import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 md:p-12">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">InvControl</h1>
        <p className="text-slate-500 text-center mb-8">Ingresa tus credenciales</p>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20}/>
            <input type="email" placeholder="admin@empresa.com" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20}/>
            <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
          </div>
          <Button className="w-full justify-center py-3 mt-4" variant="primary">Ingresar <ArrowRight size={18}/></Button>
        </form>
      </div>
    </div>
  );
}