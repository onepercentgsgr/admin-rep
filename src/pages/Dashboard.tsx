import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  ExternalLink, 
  TrendingUp, 
  Activity,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
  const { profile, user } = useAuth();

  const stats = [
    { label: 'Clientes Totales', value: '124', icon: Users, color: 'text-primary' },
    { label: 'Consultas Hoy', value: '42', icon: MessageSquare, color: 'text-accent' },
    { label: 'Tasa Respuesta', value: '98%', icon: Activity, color: 'text-green-500' },
    { label: 'Eficiencia IA', value: '+12%', icon: TrendingUp, color: 'text-yellow-500' },
  ];

  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-[280px] bg-bg-card border-r border-white/5 flex flex-col p-6 overflow-hidden">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bebas text-2xl tracking-widest text-white leading-none">ADMIN REP</h1>
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">v2.0 Beta</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Link to="/" className="flex items-center gap-4 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm border border-primary/10 transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/clientes" className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all">
            <Users className="w-5 h-5" />
            Clientes
          </Link>
          <Link to="/configuracion" className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm transition-all">
            <Settings className="w-5 h-5" />
            Configuración
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <img src={user?.photoURL || ''} className="w-8 h-8 rounded-full border border-white/10" alt="" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.displayName}</p>
              <p className="text-[10px] text-gray-500 truncate">{profile?.storeName || 'Dueño'}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-bold text-xs transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">Bienvenido de nuevo</h2>
              <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                {profile?.storeName || 'Panel de Control'}
              </h1>
            </div>
            {profile?.subdomain && (
              <a 
                href={`https://${profile.subdomain}.skyeleven.com.ar`}
                target="_blank"
                className="flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-accent hover:text-white transition-all group"
              >
                Ver mi tienda
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white font-display">Actividad Reciente</h3>
                <Link to="/clientes" className="text-primary text-xs font-bold hover:underline tracking-widest uppercase">Ver todo</Link>
              </div>
              <div className="glass-panel rounded-[2rem] border border-white/5 overflow-hidden">
                <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-10 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <div className="w-40">Cliente</div>
                  <div className="flex-1">Última consulta</div>
                  <div className="w-24 text-right">Vehículo</div>
                </div>
                <div className="divide-y divide-white/5">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <div key={idx} className="flex items-center gap-10 px-8 py-4 hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="w-40 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">JD</div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">Juan Pérez</p>
                          <p className="text-[10px] text-gray-500">hace 15 min</p>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 truncate italic">"Hola, estoy buscando un kit de distribución para..."</p>
                      </div>
                      <div className="w-24 text-right shrink-0">
                        <p className="text-xs font-bold text-white">Toyota Hilux</p>
                        <p className="text-[10px] text-gray-500">2022</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Assistant Config Preview */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white font-display">Estado de la IA</h3>
              <div className="glass-panel rounded-[2rem] p-8 border border-white/5 space-y-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 p-2 relative">
                      <div className="w-full h-full rounded-full border-4 border-dotted border-primary animate-spin-slow" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">Optimizada y Activa</h4>
                  <p className="text-xs text-gray-500">Gemini 2.0 Flash</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tono Actual</p>
                    <div className="flex items-center justify-between text-sm font-bold text-white">
                      <span>{profile?.tone || 'Amigable'}</span>
                      <span className="text-primary tracking-widest text-[10px] uppercase">Normal</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Technical Level</p>
                    <div className="flex items-center justify-between text-sm font-bold text-white">
                      <span>{profile?.technicalLevel || 'Medio'}</span>
                      <span className="text-accent tracking-widest text-[10px] uppercase">Automotriz</span>
                    </div>
                  </div>
                </div>

                <Link 
                  to="/configuracion"
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
                >
                  Configurar Persona
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
