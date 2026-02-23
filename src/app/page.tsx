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
  Clock,
  TrendingUp,
  UserPlus,
  Bike,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/BottomNav';
import { MapComponent } from '@/components/mapa/MapComponent';
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
  date: string;
  link: string;
  _embedded?: {
    ['wp:featuredmedia']?: Array<{
      source_url: string;
    }>;
  };
};

function HomeScreen({
  onServiceSelect,
  onLoginClick,
}: {
  onServiceSelect: (service: string) => void;
  onLoginClick: () => void;
}) {
  const { user } = useAuth();

  const [news, setNews] = useState<WPPost[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    fetch(
      'https://goopiapp.com/wp-json/wp/v2/posts?per_page=5&_embed'
    )
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoadingNews(false);
      })
      .catch(() => setLoadingNews(false));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-gradient-to-r from-purple-600 to-purple-700 px-4 pt-4 pb-6 rounded-b-3xl shadow-lg"
      >
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
            <motion.button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/90 bg-white/10 rounded-xl px-3 py-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Macas, Ecuador</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </div>
      </motion.header>

      {/* Servicios */}
      <section className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={() =>
              (window.location.href =
                'https://goopiapp.com/taxis-disponibles/')
            }
            className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-left"
          >
            <Car className="w-6 h-6 text-white mb-2" />
            <h3 className="text-white font-bold text-lg">Pedir Taxi</h3>
            <p className="text-white/80 text-sm">Llega rápido y seguro</p>
          </motion.button>

          <motion.button
            onClick={() =>
              (window.location.href =
                'https://goopiapp.com/taxis-disponibles/')
            }
            className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-5 text-left"
          >
            <Package className="w-6 h-6 text-white mb-2" />
            <h3 className="text-white font-bold text-lg">Delivery</h3>
            <p className="text-white/80 text-sm">Envíos a domicilio</p>
          </motion.button>
        </div>
      </section>

      {/* Noticias reales */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-purple-500" />
            Noticias
          </h2>
          <button
            onClick={() =>
              window.open('https://goopiapp.com/noticias/', '_blank')
            }
            className="text-purple-600 text-sm flex items-center gap-1"
          >
            Ver más <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loadingNews ? (
          <p className="text-sm text-gray-500">Cargando noticias…</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {news.map((post) => {
              const image =
                post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

              return (
                <div
                  key={post.id}
                  onClick={() => window.open(post.link, '_blank')}
                  className="w-72 flex-shrink-0 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                >
                  {image && (
                    <img
                      src={image}
                      alt=""
                      className="h-32 w-full object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3
                      className="font-semibold text-gray-800 line-clamp-1"
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
        )}
      </section>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isLoading } = useAuth();
  const { setActiveTab: setStoreTab } = useAppStore();

  useEffect(() => {
    setStoreTab(activeTab);
  }, [activeTab, setStoreTab]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <HomeScreen
            onServiceSelect={() => {}}
            onLoginClick={() => setShowAuthModal(true)}
          />
        )}
        {activeTab === 'mapa' && <MapComponent />}
        {activeTab === 'guia' && <GuiaComponent />}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
