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
  X,
  Gift,
  Star,
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

const GOOPI_LOGO =
  'https://i0.wp.com/goopiapp.com/wp-content/uploads/2026/02/cropped-logo-png_Mesa-de-trabajo-1-copia.png?fit=2084%2C1890&ssl=1';

type WPPost = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  _embedded?: {
    ['wp:featuredmedia']?: Array<{ source_url: string }>;
  };
};

export default function Home() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'home' | 'mapa'>('home');
  const [mapType, setMapType] = useState<'taxi' | 'delivery' | null>(null);

  const [news, setNews] = useState<WPPost[]>([]);
  const [activePost, setActivePost] = useState<WPPost | null>(null);

  /* 🔹 Noticias SOLO categoría "noticias" */
  useEffect(() => {
    const cached = sessionStorage.getItem('goopi_news_noticias');
    if (cached) {
      setNews(JSON.parse(cached));
      return;
    }

    fetch(
      'https://goopiapp.com/wp-json/wp/v2/posts?per_page=5&_embed&categories_slug=noticias'
    )
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        sessionStorage.setItem(
          'goopi_news_noticias',
          JSON.stringify(data)
        );
      });
  }, []);

  /* ================= HOME ================= */
  if (activeTab === 'home') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
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
                    ? `¡Hola, ${user.displayName}!`
                    : '¡Hola! 👋'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Search className="text-white w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bell className="text-white w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/90 bg-white/10 rounded-xl px-3 py-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Macas, Ecuador</span>
          </div>
        </header>

        {/* BOTONES TAXI / DELIVERY */}
        <section className="px-4 -mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setMapType('taxi');
              setActiveTab('mapa');
            }}
            className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-left text-white shadow-lg"
          >
            <Car className="w-6 h-6 mb-2" />
            <h3 className="font-bold">Pedir Taxi</h3>
            <p className="text-sm text-white/80">Rápido y seguro</p>
          </button>

          <button
            onClick={() => {
              setMapType('delivery');
              setActiveTab('mapa');
            }}
            className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-5 text-left text-white shadow-lg"
          >
            <Package className="w-6 h-6 mb-2" />
            <h3 className="font-bold">Pedir Delivery</h3>
            <p className="text-sm text-white/80">Envíos a domicilio</p>
          </button>
        </section>

        {/* NOTICIAS */}
        <section className="px-4 mt-8">
          <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-3">
            <Newspaper className="w-5 h-5 text-purple-500" />
            Noticias
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {news.map((post) => {
              const image =
                post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

              return (
                <div
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="w-72 flex-shrink-0 bg-white rounded-2xl shadow-lg cursor-pointer"
                >
                  {image && (
                    <img
                      src={image}
                      className="h-32 w-full object-cover rounded-t-2xl"
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
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('es-EC')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTONES DEBAJO DE NOTICIAS */}
          <div className="grid grid-cols-1 gap-3 mt-5">
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

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white border rounded-xl py-3 flex items-center justify-center gap-2 text-gray-700 font-medium">
                <Gift className="w-5 h-5 text-purple-500" />
                Ofertas
              </button>

              <button className="bg-white border rounded-xl py-3 flex items-center justify-center gap-2 text-gray-700 font-medium">
                <Star className="w-5 h-5 text-amber-500" />
                Puntos
              </button>
            </div>
          </div>
        </section>

        {/* MODAL NOTICIA */}
        <AnimatePresence>
          {activePost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
                <button
                  onClick={() => setActivePost(null)}
                  className="absolute top-3 right-3"
                >
                  <X />
                </button>
                <div
                  className="p-4 prose"
                  dangerouslySetInnerHTML={{
                    __html: activePost.content.rendered,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav activeTab="home" onTabChange={() => {}} />
      </div>
    );
  }

  /* ================= MAPA ================= */
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 py-3 flex items-center gap-2 bg-white shadow">
        <button
          onClick={() => setActiveTab('home')}
          className="text-purple-600 font-medium"
        >
          ← Volver
        </button>
        <span className="font-semibold">
          {mapType === 'taxi'
            ? 'Taxis disponibles'
            : 'Delivery disponible'}
        </span>
      </header>

      <iframe
        src="https://goopiapp.com/taxis-disponibles/"
        className="flex-1 w-full"
      />

      <BottomNav activeTab="mapa" onTabChange={() => {}} />
      <AuthModal isOpen={false} onClose={() => {}} />
    </div>
  );
}
