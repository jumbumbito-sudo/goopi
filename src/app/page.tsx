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
  Car,
  Package,
  ShoppingBag,
  Utensils,
  Hotel,
  Landmark,
  TrendingUp,
  Bike,
  Newspaper,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/BottomNav';
import { MapComponent } from '@/components/mapa/MapComponent';
import { GuiaComponent } from '@/components/guia/GuiaComponent';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAppStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';

// WordPress News API response type
interface NewsItem {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  date: string;
  jetpack_featured_media_url?: string;
}

// Home Screen Component
function HomeScreen({ onServiceSelect }: { onServiceSelect: (service: string) => void }) {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // Fetch news from WordPress
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://goopiapp.com/wp-json/wp/v2/posts?per_page=3&_embed=true');
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Strip HTML tags from excerpt
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 80) + '...';
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-gradient-to-r from-[#942cb3] to-[#a855f7] px-4 pt-6 pb-8 rounded-b-3xl shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://goopiapp.com/wp-content/uploads/2024/09/GOOPI-LOGO-LETRAS-BLANCAS.png" 
              alt="Goopi" 
              className="h-10 w-auto"
            />
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Search className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
            </motion.button>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-white/90">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Macas, Ecuador</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </motion.header>

      {/* Main Services - Abren directamente las páginas de WordPress */}
      <section className="px-4 -mt-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <motion.a
            href="https://goopiapp.com/solicitar-taxi/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-left shadow-lg shadow-orange-500/25"
          >
            <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center mb-3">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg">Pedir Taxi</h3>
            <p className="text-white/80 text-sm">Llega rápido y seguro</p>
          </motion.a>

          <motion.a
            href="https://goopiapp.com/solicitar-delivery/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-5 text-left shadow-lg shadow-blue-500/25"
          >
            <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg">Delivery</h3>
            <p className="text-white/80 text-sm">Envíos a domicilio</p>
          </motion.a>
        </motion.div>
      </section>

      {/* Points Card */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 mt-6"
      >
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Tus puntos</p>
              <p className="text-white font-bold text-xl">1,250 pts</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 px-4 py-2 rounded-xl text-white font-medium text-sm"
          >
            Canjear
          </motion.button>
        </div>
      </motion.section>

      {/* Explore Categories */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 text-lg">Explorar</h2>
          <button 
            onClick={() => onServiceSelect('guia')}
            className="text-[#942cb3] font-medium text-sm flex items-center gap-1"
          >
            Ver todo <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Utensils, label: 'Restaurantes', color: 'from-rose-400 to-red-500' },
            { icon: Hotel, label: 'Hoteles', color: 'from-indigo-400 to-purple-500' },
            { icon: Landmark, label: 'Atracciones', color: 'from-amber-400 to-orange-500' },
            { icon: ShoppingBag, label: 'Tiendas', color: 'from-emerald-400 to-teal-500' },
          ].map((cat, index) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onServiceSelect('guia')}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center shadow-md`}>
                <cat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-600">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Noticias Section - Desde WordPress API */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#942cb3]" />
            <h2 className="font-bold text-gray-800 text-lg">Noticias</h2>
          </div>
          <a 
            href="https://goopiapp.com/noticias/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#942cb3] font-medium text-sm flex items-center gap-1"
          >
            Ver más <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        
        {newsLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {news.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="relative h-32">
                  <img 
                    src={item.jetpack_featured_media_url || 'https://via.placeholder.com/400x200?text=Goopi'} 
                    alt={item.title.rendered}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-3">
                  <h3 
                    className="font-semibold text-gray-800 line-clamp-2" 
                    dangerouslySetInnerHTML={{ __html: item.title.rendered }} 
                  />
                  <p 
                    className="text-sm text-gray-500 mt-1 line-clamp-2" 
                    dangerouslySetInnerHTML={{ __html: stripHtml(item.excerpt.rendered) }} 
                  />
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-2">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.date).toLocaleDateString('es-EC')}</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Newspaper className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay noticias disponibles</p>
          </div>
        )}
      </section>

      {/* Register as Driver - Sin requerir login */}
      <section className="px-4 mt-6">
        <h2 className="font-bold text-gray-800 text-lg mb-3">¿Trabaja con nosotros?</h2>
        <div className="space-y-3">
          <motion.a
            href="https://goopiapp.com/registro-de-taxistas/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 shadow-lg cursor-pointer"
          >
            <div className="w-14 h-14 bg-white/25 rounded-xl flex items-center justify-center">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">Registrar mi Taxi</h3>
              <p className="text-white/80 text-sm">Únete a nuestra red de conductores</p>
            </div>
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.a>

          <motion.a
            href="https://goopiapp.com/registro-de-taxistas/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl p-4 shadow-lg cursor-pointer"
          >
            <div className="w-14 h-14 bg-white/25 rounded-xl flex items-center justify-center">
              <Bike className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">Registrar mi Moto</h3>
              <p className="text-white/80 text-sm">Haz entregas y gana dinero</p>
            </div>
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.a>
        </div>
      </section>
    </div>
  );
}

// Profile Screen Component
function ProfileScreen({ onLoginClick }: { onLoginClick: () => void }) {
  const { user, logout, updateUserRole } = useAuth();
  const { driverEarnings } = useAppStore();

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-gradient-to-br from-[#942cb3] to-[#a855f7] rounded-full flex items-center justify-center mb-6"
        >
          <span className="text-6xl">👤</span>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Inicia sesión!</h2>
        <p className="text-gray-500 text-center mb-6">
          Accede a tu cuenta para disfrutar de todos los beneficios de Goopi
        </p>
        <Button variant="goopi" size="lg" onClick={onLoginClick}>
          Iniciar sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#942cb3] to-[#a855f7] px-4 pt-6 pb-12 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">{user.displayName?.[0] || '👤'}</span>
            )}
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">{user.displayName}</h1>
            <p className="text-purple-100">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                user.role === 'conductor' 
                  ? 'bg-amber-400 text-amber-900' 
                  : 'bg-white/20 text-white'
              }`}>
                {user.role === 'conductor' ? '🚕 Conductor' : '👤 Usuario'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">23</p>
            <p className="text-sm text-gray-500">Viajes</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-2xl font-bold text-gray-800">1,250</p>
            <p className="text-sm text-gray-500">Puntos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#942cb3]">
              <Star className="w-5 h-5 inline" /> 4.9
            </p>
            <p className="text-sm text-gray-500">Rating</p>
          </div>
        </div>
      </div>

      {/* Driver Earnings (if conductor) */}
      {user.role === 'conductor' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mt-6"
        >
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Ganancias totales</p>
              <p className="text-white text-3xl font-bold">${driverEarnings.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-white/50" />
          </div>
        </motion.div>
      )}

      {/* Menu Options */}
      <div className="px-4 mt-6 space-y-2">
        {[
          { icon: Car, label: 'Mis viajes', color: 'bg-amber-100 text-amber-600' },
          { icon: Package, label: 'Mis pedidos', color: 'bg-blue-100 text-blue-600' },
          { icon: Gift, label: 'Mis recompensas', color: 'bg-purple-100 text-purple-600' },
          { icon: Star, label: 'Favoritos', color: 'bg-rose-100 text-rose-600' },
        ].map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
          >
            <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="flex-1 text-left font-medium text-gray-700">{item.label}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.button>
        ))}

        {/* Role Switcher */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-xl p-4 mt-4"
        >
          <p className="font-medium text-gray-700 mb-3">Cambiar rol</p>
          <div className="flex gap-2">
            <button
              onClick={() => updateUserRole('usuario')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                user.role === 'usuario'
                  ? 'bg-[#942cb3] text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              👤 Usuario
            </button>
            <button
              onClick={() => updateUserRole('conductor')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                user.role === 'conductor'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              🚕 Conductor
            </button>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={logout}
          className="w-full bg-red-50 text-red-600 rounded-xl p-4 font-medium mt-4"
        >
          Cerrar sesión
        </motion.button>
      </div>
    </div>
  );
}

// Main App Component
export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isLoading } = useAuth();
  const { setActiveTab: setStoreTab } = useAppStore();

  useEffect(() => {
    setStoreTab(activeTab);
  }, [activeTab, setStoreTab]);

  const handleServiceSelect = (service: string) => {
    if (service === 'mapa') {
      setActiveTab('mapa');
    } else if (service === 'guia') {
      setActiveTab('guia');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-[#942cb3] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1"
          >
            <HomeScreen onServiceSelect={handleServiceSelect} />
          </motion.div>
        )}

        {activeTab === 'mapa' && (
          <motion.div
            key="mapa"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 relative"
          >
            <MapComponent onServiceRequest={(type) => console.log('Service:', type)} />
          </motion.div>
        )}

        {activeTab === 'guia' && (
          <motion.div
            key="guia"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <GuiaComponent />
          </motion.div>
        )}

        {activeTab === 'perfil' && (
          <motion.div
            key="perfil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1"
          >
            <ProfileScreen onLoginClick={() => setShowAuthModal(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
// Build: Mon Feb 23 19:44:21 UTC 2026
