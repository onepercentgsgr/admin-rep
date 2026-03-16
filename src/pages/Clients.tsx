import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Users, 
  Search, 
  ChevronRight, 
  Car, 
  MessageSquare, 
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Customer {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  lastMessageAt?: any;
  vehicle?: any;
  vehicles?: any[];
}

export default function Clients() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("displayName", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as Customer[];
      setCustomers(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans">
      {/* List Area */}
      <div className={`flex-1 flex flex-col border-r border-white/5 transition-all ${selectedCustomer ? 'hidden md:flex' : 'flex'}`}>
        <header className="h-20 glass-panel border-b border-white/5 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full transition-colors mr-2">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold font-display tracking-tight">Directorio de Clientes</h1>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input 
              type="text" 
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-bg-input border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-xs focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-700"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          {loading ? (
             <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             </div>
          ) : filteredCustomers.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Users className="w-16 h-16 mb-4" />
                <p className="font-bold tracking-widest uppercase text-xs">No se encontraron clientes</p>
             </div>
          ) : (
            filteredCustomers.map(customer => (
              <motion.div 
                key={customer.uid}
                layoutId={customer.uid}
                onClick={() => setSelectedCustomer(customer)}
                className={`flex items-center justify-between p-5 rounded-3xl border transition-all cursor-pointer group ${selectedCustomer?.uid === customer.uid ? 'bg-primary/10 border-primary/20 ring-1 ring-primary/20' : 'bg-bg-card border-white/5 hover:bg-white/5 hover:border-white/10'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {customer.photoURL ? (
                      <img src={customer.photoURL} alt="" className="w-12 h-12 rounded-2xl object-cover border border-white/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-sm font-bold text-gray-600 border border-white/5">
                        {customer.displayName?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-bg shadow-lg" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{customer.displayName}</h3>
                    <p className="text-[10px] text-gray-500 truncate w-40">{customer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="hidden lg:flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Car className="w-3.5 h-3.5" />
                        <span className="font-bold uppercase tracking-widest text-[9px]">Vehículo</span>
                      </div>
                      <p className="text-sm font-medium text-white">{(customer.vehicles?.[0] || customer.vehicle)?.brand || 'No registrado'}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${selectedCustomer?.uid === customer.uid ? 'text-primary translate-x-1' : 'text-gray-700'}`} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Detail Area */}
      <AnimatePresence>
        {selectedCustomer ? (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-full md:w-[500px] lg:w-[600px] bg-[#050914] flex flex-col shadow-2xl relative z-10"
          >
            <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors md:hidden">
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <h2 className="text-xl font-bold font-display tracking-tight text-white">Perfil del Cliente</h2>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="hidden md:flex p-2 hover:bg-white/5 rounded-full text-gray-500 transition-all hover:rotate-90"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
              {/* Profile Card */}
              <div className="glass-panel rounded-[2.5rem] p-8 border border-white/5 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  {selectedCustomer.photoURL ? (
                    <img src={selectedCustomer.photoURL} alt="" className="w-28 h-28 rounded-[2rem] object-cover border-4 border-primary/20 p-1" />
                  ) : (
                    <div className="w-28 h-28 rounded-[2rem] bg-white/5 flex items-center justify-center text-3xl font-bold text-gray-700 border-4 border-white/5">
                      {selectedCustomer.displayName?.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{selectedCustomer.displayName}</h3>
                <p className="text-sm text-gray-500 mb-6">{selectedCustomer.email}</p>
                <div className="flex gap-4 w-full">
                  <div className="flex-1 bg-white/5 rounded-2xl py-4 border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Vehículos</p>
                    <p className="text-xl font-display font-bold text-white">{selectedCustomer.vehicles?.length || (selectedCustomer.vehicle ? 1 : 0)}</p>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-2xl py-4 border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Consultas</p>
                    <p className="text-xl font-display font-bold text-white">--</p>
                  </div>
                </div>
              </div>

              {/* Vehicles Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Flota Registrada</h4>
                  <Car className="w-4 h-4 text-gray-600" />
                </div>
                <div className="space-y-3">
                  {(selectedCustomer.vehicles || (selectedCustomer.vehicle ? [selectedCustomer.vehicle] : [])).map((v: any, i: number) => (
                    <div key={i} className="bg-bg-card/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                        <Car className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-white">{v.brand} {v.model}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-medium">{v.year}</p>
                      </div>
                    </div>
                  ))}
                  {(!selectedCustomer.vehicles && !selectedCustomer.vehicle) && (
                    <p className="text-xs text-center text-gray-600 py-4 italic">No posee vehículos registrados</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-10 border-t border-white/5">
                <button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white py-4 rounded-2xl font-bold text-sm transition-all border border-primary/20 flex items-center justify-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  Ver Historial de Chat
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-[#050914] opacity-20 select-none">
             <div className="text-center">
                <Users className="w-32 h-32 mx-auto mb-6" />
                <p className="font-bebas text-4xl tracking-widest uppercase mb-2">Multi Repuestos</p>
                <p className="font-bold tracking-[0.5em] text-xs uppercase">Directorio de Clientes</p>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
