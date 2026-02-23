'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Bell,
  Search,
  ChevronRight,
  Newspaper,
  Car,
  Package,
  Calendar,
} from 'lucide-react';

import { BottomNav } from '@/components/layout/BottomNav';
import { MapComponent } from '@/components/mapa/MapComponent';
import { GuiaComponent } from '@/components/guia/GuiaComponent';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useStore';

const GOOPI_LOGO =
  'https://i0.wp.com/goopiapp.com/wp-content/uploads/2026/02/cropped-logo-png_Mesa-de-trabajo-1-copia.png?fit=2084%2C1890&ssl=1';

/* ===== TYPES ===== */

type WPPage = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    ['wp:featuredmedia']?: Array<{ source_url: string }>;
  };
};

type WPPost = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  link: string;
  _embedded?: {
    ['wp:featuredmedia']?: Array<{ source_url: string }>;
  };
};

/* ===== HOME SCREEN ===== */

function HomeScreen({
  onServiceSelect,
}: {
  onServiceSelect: (service: string) => void;
}) {
  const { user } = useAuth();

  const [newsPage, setNewsPage] = useState<WPPage | null>(null);
  const [paraTi, setParaTi] = useState<WPPost[]>([]);

  /* 🔹 Cargar SOLO la página /noticias/ con imagen */
  useEffect(() => {
    fetch(
      'https://goopiapp.com/wp-json/wp/v2/pages?slug=noticias&_embed'
    )
      .then((res) => res.json())
      .then((data) => setNewsPage(data[0]));
  }, []);

  /* 🔹 Cargar posts para "Para ti" con imagen */
  useEffect(() => {
    fetch(
      'https://goopiapp.com/wp-json/wp/v2/posts?per_page=5&_embed'
    )
      .then((res) => res.json())
      .then((data) => setParaTi(data));
  }, []);

  const newsImage =
    newsPage?._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* HEADER */}
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
                {user?.displayName ? `Hola ${user.displayName}` : '¡Hola! 👋'}
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

      {/* TAXI / DELIVERY */}
      <section className="px-4 -mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => onServiceSelect('mapa')}
          className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl p-5 shadow-lg"
        >
          <Car className="mb-2" />
          <h3 className="font-bold">Pedir Taxi</h3>
        </button>

        <button
          onClick={() => onServiceSelect('mapa')}
          className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white rounded-2xl p-5 shadow-lg"
        >
          <Package className="mb-2" />
          <h3 className="font-bold">Delivery</h3>
        </button>
      </section>

      {/* NOTICIAS = PÁGINA */}
      {newsPage && (
        <section className="px-4 mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold flex items-center gap-2">
              <Newspaper className="text-purple-500" />
              Noticias
            </h2>

            <a
              href="https://goopiapp.com/noticias/"
              target="_blank"
              className="text-purple-600 text-sm flex items-center gap-1"
            >
              Ver todo <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow overflow-hidden">
            {newsImage && (
              <img
                src={newsImage}
                className="w-full h-40 object-cover"
              />
            )}

            <div
              className="p-4 prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: newsPage.excerpt.rendered,
              }}
            />
          </div>
        </section>
      )}

      {/* PARA TI */}
      <section className="px-4 mt-6">
        <h2 className="font-bold mb-3">Para ti</h2>

        <div className="flex gap-3 overflow-x-auto">
          {paraTi.map((post) => {
            const image =
              post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

            return (
              <div
                key={post.id}
                onClick={() => window.open(post.link, '_blank')}
                className="w-72 bg-white rounded-2xl shadow cursor-pointer overflow-hidden"
              >
                {image && (
                  <img
                    src={image}
                    className="h-28 w-full object-cover"
                  />
                )}

                <div className="p-3">
                  <h3
                    className="font-semibold line-clamp-1"
                    dangerouslySetInnerHTML={{
                      __html: post.title.rendered,
                    }}
                  />
                  <p
                    className="text-sm text-gray-500 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt.rendered,
                    }}
                  />
                  <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString('es-EC')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* REGISTRO */}
      <section className="px-4 mt-8">
        <button
          onClick={() =>
            window.open(
              'https://goopiapp.com/registro-de-taxistas/',
              '_blank'
            )
          }
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl py-3 font-semibold"
        >
          Registrar tu unidad
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
          <HomeScreen onServiceSelect={setActiveTab} />
        )}

        {activeTab === 'mapa' && (
          <div className="flex-1 relative">
            <div
              className="absolute inset-0"
              style={{ bottom: '64px' }}
            >
              <MapComponent />
            </div>
          </div>
        )}

        {activeTab === 'guia' && <GuiaComponent />}

        {activeTab === 'perfil' && (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-purple-600 font-semibold"
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
