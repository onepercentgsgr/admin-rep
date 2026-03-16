import { motion } from 'framer-motion';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { Shield, Key, ArrowRight } from 'lucide-react';

export default function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="h-screen w-screen bg-bg flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel rounded-[2rem] p-10 relative z-10 shadow-2xl border border-white/10"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="font-bebas text-5xl tracking-widest text-white mb-2">ADMIN REP</h1>
          <p className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-10">Central de Gestión IA</p>

          <div className="w-full space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 h-14 rounded-2xl font-bold flex items-center justify-center gap-4 transition-all active:scale-95 group shadow-xl"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
              Ingresar con Google
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="mt-12 flex items-center gap-3 text-xs text-gray-600 font-bold uppercase tracking-widest">
            <Key className="w-3.5 h-3.5" />
            Acceso exclusivo para administradores
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em]">
        Powered by Sky Eleven AI
      </div>
    </div>
  );
}
