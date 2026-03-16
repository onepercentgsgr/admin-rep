import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, type AdminProfile } from '../hooks/useAuth';
import { 
  Settings, 
  Save, 
  Check, 
  ChevronLeft, 
  UserCircle, 
  Terminal,
  Globe,
  Smartphone,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Config() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<AdminProfile>>({});
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "admins", user.uid), formData, { merge: true });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving config:", err);
      alert("Error al guardar la configuración.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-white pb-20">
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 h-20 flex items-center px-8 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-400" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold font-display tracking-tight">Configuración del Sistema</h1>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl active:scale-95 group"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : showSuccess ? (
              <Check className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {showSuccess ? 'Guardado' : 'Guardar Cambios'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-12 px-6">
        <form onSubmit={handleSave} className="space-y-12">
          
          {/* Section: Store Profile */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-accent" />
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">Identidad Digital</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1">Nombre Comercial</label>
                <input 
                  type="text" 
                  value={formData.storeName || ''}
                  onChange={e => setFormData({...formData, storeName: e.target.value})}
                  placeholder="Ej: Multi Repuestos Las Grutas"
                  className="w-full bg-bg-input border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1 flex items-center gap-2">
                  Subdominio
                  <HelpCircle className="w-3 h-3 text-gray-600" />
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.subdomain || ''}
                    onChange={e => setFormData({...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})}
                    placeholder="ej-nombre"
                    className="w-full bg-bg-input border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-[140px] placeholder:text-gray-700"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-xs uppercase tracking-widest pointer-events-none">
                    .skyeleven.com.ar
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: IA Persona */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="w-5 h-5 text-primary" />
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">IA Assistant Persona</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-300 ml-1">Instrucciones del Sistema (System Prompt)</label>
                <textarea 
                  value={formData.systemPrompt || ''}
                  onChange={e => setFormData({...formData, systemPrompt: e.target.value})}
                  rows={6}
                  placeholder="Ej: Sos un experto en repuestos de Toyota. Respondé siempre con tecnicismos y usá jerga de taller mecánico..."
                  className="w-full bg-bg-input border border-white/5 rounded-[2rem] px-6 py-6 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-700 custom-scrollbar resize-none text-sm leading-relaxed"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-300 ml-1">Tono de Voz</label>
                  <div className="flex p-1.5 bg-bg-input border border-white/5 rounded-2xl gap-1">
                    {['friendly', 'formal', 'slang'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({...formData, tone: t as any})}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${formData.tone === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                      >
                        {t === 'friendly' ? 'Amistoso' : t === 'formal' ? 'Formal' : 'Jerga/Taller'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-300 ml-1">Nivel Técnico</label>
                  <div className="flex p-1.5 bg-bg-input border border-white/5 rounded-2xl gap-1">
                    {['basic', 'medium', 'expert'].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setFormData({...formData, technicalLevel: l as any})}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${formData.technicalLevel === l ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                      >
                        {l === 'basic' ? 'Básico' : l === 'medium' ? 'Medio' : 'Experto'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Contact Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <UserCircle className="w-5 h-5 text-gray-500" />
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">Información de Contacto</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> WhatsApp
                </label>
                <input 
                  type="text" 
                  value={formData.whatsappNumber || ''}
                  onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
                  placeholder="+54929..."
                  className="w-full bg-bg-input border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Dirección Física
                </label>
                <input 
                  type="text" 
                  value={formData.address || ''}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Calle, Ciudad, Provincia"
                  className="w-full bg-bg-input border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>
          </section>

        </form>
      </main>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 z-[100]"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            Configuración actualizada con éxito
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
