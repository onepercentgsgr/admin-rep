import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export interface AdminProfile {
  storeName: string;
  subdomain: string;
  systemPrompt: string;
  logoUrl?: string;
  whatsappNumber?: string;
  address?: string;
  technicalLevel: 'basic' | 'medium' | 'expert';
  tone: 'friendly' | 'formal' | 'slang';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Cargar perfil del admin (tienda)
        const unsubProfile = onSnapshot(doc(db, "admins", u.uid), (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as AdminProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        });
        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
}
