'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Phone,
  ChevronRight,
  Utensils,
  ShoppingBag,
  Hotel,
  Landmark,
  Wrench,
  X,
  Loader2
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Business {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  rating: number;
  reviews: number;
  address: string;
  phone?: string;
  hours?: string;
  link?: string;
}

const categories = [
  { id: 'all', label: 'Todos', icon: ShoppingBag },
  { id: 'gastronomia', label: 'Restaurantes', icon: Utensils },
  { id: 'hospedaje', label: 'Hospedaje', icon: Hotel },
  { id: 'atracciones', label: 'Atracciones', icon: Landmark },
  { id: 'servicios', label: 'Servicios', icon: Wrench },
];

// Fetch businesses from WordPress API
async function fetchBusinessesFromWP(): Promise<Business[]> {
  try {
    const response = await fetch('https://goopiapp.com/wp-json/wp/v2/posts?per_page=50&_embed=true');
    const data = await response.json();

    return data.map((post: {
      id: number;
      title: { rendered: string };
      excerpt: { rendered: string };
      jetpack_featured_media_url?: string;
      categories?: number[];
      _embedded?: {
        'wp:term'?: Array<Array<{ name: string; slug: string }>>;
      };
      link?: string;
    }) => {
      // Extract category name
      const categoryName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Otros';
      const categorySlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'otros';

      return {
        id: post.id.toString(),
        title: post.title.rendered,
        description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150),
        image: post.jetpack_featured_media_url || null,
        category: categorySlug,
        rating: 4 + Math.random() * 0.9,
        reviews: Math.floor(Math.random() * 100) + 10,
        address: 'Macas, Ecuador',
        link: post.link,
      };
    });
  } catch (error) {
    console.error('Error fetching from WordPress:', error);
    return [];
  }
}

interface BusinessCardProps {
  business: Business;
  index: number;
}

function BusinessCard({ business, index }: BusinessCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getCategoryLabel = (slug: string) => {
    const cat = categories.find(c => c.id === slug);
    return cat?.label || slug;
  };

  return (
    <>
      <AnimatedCard
        delay={index * 0.05}
        className="overflow-hidden cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            {business.image ? (
              <img
                src={business.image}
                alt={business.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{business.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{business.description}</p>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium">{business.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({business.reviews})</span>
              </div>
              <span className="text-xs text-gray-400 capitalize">{getCategoryLabel(business.category)}</span>
            </div>

            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{business.address}</span>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 self-center" />
        </div>
      </AnimatedCard>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              {business.image && (
                <div className="h-48 relative">
                  <img
                    src={business.image}
                    alt={business.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setShowDetails(false)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-12rem)]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{business.title}</h2>
                    <p className="text-sm text-gray-500 capitalize">{getCategoryLabel(business.category)}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-amber-700">{business.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{business.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    <span className="text-gray-700">{business.address}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Phone className="w-4 h-4" />
                    Llamar
                  </Button>
                  <Button
                    variant="goopi"
                    className="flex-1 gap-2"
                    onClick={() => {
                      if (business.link) {
                        window.open(business.link, '_blank');
                      }
                    }}
                  >
                    <MapPin className="w-4 h-4" />
                    Ver más
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function GuiaComponent() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch data from WordPress on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchBusinessesFromWP();
      setBusinesses(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar negocios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500">Cargando negocios desde WordPress...</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <span className="text-sm text-gray-500">
                {filteredBusinesses.length} resultados encontrados
              </span>
            </div>

            <div className="space-y-3">
              {filteredBusinesses.map((business, index) => (
                <BusinessCard key={business.id} business={business} index={index} />
              ))}
            </div>

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron resultados</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
