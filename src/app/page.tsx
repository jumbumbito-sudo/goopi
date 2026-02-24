'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Bell,
  Search,
  Car,
  Package,
} from 'lucide-react';

import { BottomNav } from '@/components/layout/BottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useStore';
import { NoticiasSection } from '@/components/noticias/NoticiasSection';

/* ===== CONSTANTES WP ===== */

const GOOPI_LOGO =
  'https://i0.wp.com/goopiapp.com/wp-content/uploads/2026/02/cropped-logo-png_Mesa-de-trabajo-1-copia.png?fit=2084%2C1890&ssl=1';

const WP_MAP_URL = 'https://goopiapp.com/taxis-disponibles/';
const WP_NOTICIAS_URL = 'https://goopiapp.com/locales/noticias/';
const WP_REGISTRO_UNIDADES =
  'https://goopiapp.com/registro-de-taxistas/';
const WP_PUNTOS_URL = 'https://goopiapp.com/puntos/';
const WP_REGISTRO_USUARIO = 'https://goopiapp.com/registro/';

/* ===== HOME SCREEN ===== */

function HomeScreen({
  goToMap,
}: {
  goToMap: () => void;
}) {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* CABECERA */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 pt-4 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={GOOPI_LOGO}
              alt="Goopi"
              className="w-12 h-12 rounded-xl bg-white/20 p-1"
            />
            <div>
              <h1 className="text-white font-bold">Goopi</h1>
              <p className="text-purple-200 text-sm">
                {user?.displayName
                  ? `Hola ${user.displayName}`
                  : '¡Hola! 👋'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Search className="text-white" />
            <Bell className="text-white" />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl text-white">
          <MapPin className="w-4 h-4" />
          Macas, Ecuador
        </div>
      </header>

      {/* BOTONES TAXI / DELIVERY */}
      <section className="px-4 -mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={goToMap}
          className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl p-5 shadow-lg"
        >
          <Car className="mb-2" />
          <h3 className="font-bold">Pedir Taxi</h3>
        </button>

        <button
          onClick={goToMap}
          className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white rounded-2xl p-5 shadow-lg"
        >
          <Package className="mb-2" />
          <h3 className="font-bold">Delivery</h3>
        </button>
      </section>

      {/* NOTICIAS */}
      <NoticiasSection
        verTodoUrl={WP_NOTICIAS_URL}
      />

      {/* ACUMULA PUNTOS */}
      <section className="px-4 mt-6">
        <button
          onClick={() =>
            window.open(WP_PUNTOS_URL, '_blank')
          }
          className="w-full bg-yellow-400 text-black rounded-xl py-3 font-bold shadow"
        >
          Acumula puntos
        </button>
      </section>

      {/* PARA TI (SE DEJA PARA POSTS GENERALES DESPUÉS) */}
      {/* Aquí luego puedes poner ParaTiSection */}

      {/* REGISTRO UNIDADES */}
      <section className="px-4 mt-8">
        <button
          onClick={() =>
            window.open(WP_REGISTRO_UNIDADES, '_blank')
          }
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl py-3 font-semibold"
        >
          Registrar unidades
        </button>
      </section>
    </div>
  );
}

/* ===== APP ROOT ===== */

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setActiveTab: setStoreTab } = useAppStore();

  useEffect(() => {
    setStoreTab(activeTab);
  }, [activeTab, setStoreTab]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <HomeScreen
            goToMap={() => setActiveTab('mapa')}
          />
        )}

        {/* MAPA WP */}
        {activeTab === 'mapa' && (
          <div className="flex-1 flex flex-col">
            <iframe
              src={WP_MAP_URL}
              className="flex-1 w-full border-0"
              loading="lazy"
            />
          </div>
        )}

        {/* PERFIL */}
        {activeTab === 'perfil' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <button
              onClick={() =>
                window.open(WP_REGISTRO_USUARIO, '_blank')
              }
              className="w-64 bg-purple-600 text-white py-3 rounded-xl font-semibold"
            >
              Registrarse
            </button>

            <button
              onClick={() => setShowAuthModal(true)}
              className="w-64 border border-purple-600 text-purple-600 py-3 rounded-xl font-semibold"
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </AnimatePresence>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
