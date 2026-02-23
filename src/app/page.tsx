'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Bell,
  Search,
  Star,
  Gift,
  ChevronRight,
  Newspaper,
  Car,
  Package,
  ShoppingBag,
  Utensils,
  Hotel,
  Landmark,
  TrendingUp,
  Bike,
  Calendar,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/BottomNav';
import { GuiaComponent } from '@/components/guia/GuiaComponent';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAppStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';

const GOOPI_LOGO =
  'https://i0.wp.com/goopiapp.com/wp-content/uploads/2026/02/cropped-logo-png_Mesa-de-trabajo-1-copia.png?fit=2084%2C1890&ssl=1';

type WPPost = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  link: string;
  _embedded?: {
    ['wp:featuredmedia']?: Array<{
      source_url: string;
    }>;
  };
};

function HomeScreen({ onLoginClick }: { onLoginClick: () => void }) {
  const { user } = useAuth();

  const [news, setNews] = useState<WPPost[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [activePost, setActivePost] = useState<WPPost | null>(null);

  // 🔹 Cache simple en sessionStorage
  useEffect(() => {
    const cached = sessionStorage.getItem('goopi_news');
    if (cached) {
      setNews(JSON.parse(cached));
      setLoadingNews(false);
      return;
    }

    fetch('https://goopiapp.com/wp-json/wp/v2/posts?per_page=5&_embed')
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        sessionStorage.setItem('goopi_news', JSON.stringify(data));
        setLoadingNews(false);
      })
      .catch(() => setLoadingNews(false));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-purple-600 to-purple-700 px-4 pt-4 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={GOOPI_LOGO}
              alt="Goopi"
              className="w-12 h-12 rounded-xl bg-white/20 p-1 object-contain"
            />
            <div>
              <h1 className="text-white text-lg font-bold">Goopi</h1>
              <p className="text-purple-200 text-sm">
                {user?.displayName ? `¡Hola, ${user.displayName}!` : '¡Hola! 👋'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/90 bg-white/10 rounded-xl px-3 py-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Macas, Ecuador</span>
        </div>
      </header>

      {/* Taxi / Delivery */}
      <section className="px-4 -mt-4 grid grid-cols-2 gap-3">
        {[
          { icon: Car, label: 'Pedir Taxi' },
          { icon: Package, label: 'Delivery' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() =>
              (window.location.href =
                'https://goopiapp.com/taxis-disponibles/')
            }
            className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-left text-white"
          >
            <item.icon className="w-6 h-6 mb-2" />
            <h3 className="font-bold">{item.label}</h3>
          </button>
        ))}
      </section>

      {/* MAPA DESDE TU WEB */}
      <section className="px-4 mt-6">
        <h2 className="font-bold text-gray-800 text-lg mb-3">Mapa</h2>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://goopiapp.com/taxis-disponibles/"
            className="w-full h-[400px]"
            loading="lazy"
          />
        </div>
      </section>

      {/* NOTICIAS */}
      <section className="px-4 mt-6">
        <h2 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-purple-500" />
          Noticias
        </h2>

        {loadingNews ? (
          <p className="text-sm text-gray-500">Cargando noticias…</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto">
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
                      className="font-semibold"
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

              <div className="p-4">
                <h2
                  className="text-xl font-bold mb-2"
                  dangerouslySetInnerHTML={{
                    __html: activePost.title.rendered,
                  }}
                />
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: activePost.content.rendered,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {activeTab === 'home' && (
        <HomeScreen onLoginClick={() => setShowAuthModal(true)} />
      )}
      {activeTab === 'guia' && <GuiaComponent />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
