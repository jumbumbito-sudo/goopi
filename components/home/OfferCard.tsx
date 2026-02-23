'use client';

import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  MapPin, 
  ChevronRight,
  Percent
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated';
import { Offer } from '@/store/useStore';

interface OfferCardProps {
  offer: Offer;
  index?: number;
}

export function OfferCard({ offer, index = 0 }: OfferCardProps) {
  return (
    <AnimatedCard
      delay={index * 0.1}
      className="relative overflow-hidden group cursor-pointer"
    >
      <div className="flex items-center p-4 gap-4">
        {/* Image */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          {offer.image ? (
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Percent className="w-8 h-8 text-white" />
            </div>
          )}
          {offer.discount > 0 && (
            <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{offer.discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
            {offer.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {offer.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
              {offer.code}
            </span>
            <span className="text-xs text-gray-400">
              Vence: {offer.validUntil}
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
      </div>
    </AnimatedCard>
  );
}

// Componente para mostrar ofertas destacadas
interface OffersSectionProps {
  offers: Offer[];
}

export function OffersSection({ offers }: OffersSectionProps) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">🔥 Ofertas Destacadas</h2>
        <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
          Ver todas
        </button>
      </div>
      
      <div className="space-y-3">
        {offers.slice(0, 3).map((offer, index) => (
          <OfferCard key={offer.id} offer={offer} index={index} />
        ))}
      </div>
    </section>
  );
}
