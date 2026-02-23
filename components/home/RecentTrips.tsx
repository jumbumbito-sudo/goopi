'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Star,
  Navigation
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated';

interface RecentTrip {
  id: string;
  type: 'taxi' | 'delivery';
  from: string;
  to: string;
  date: string;
  price: number;
  rating?: number;
}

interface RecentTripsProps {
  trips: RecentTrip[];
}

export function RecentTrips({ trips }: RecentTripsProps) {
  if (trips.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Viajes Recientes</h2>
        <button className="text-sm text-emerald-600 font-medium">
          Ver historial
        </button>
      </div>

      <div className="space-y-3">
        {trips.map((trip, index) => (
          <AnimatedCard key={trip.id} delay={index * 0.1} className="p-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                trip.type === 'taxi' 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                <Navigation className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 capitalize">{trip.type}</span>
                  <span className="text-xs text-gray-400">{trip.date}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{trip.from}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                  <span className="truncate">{trip.to}</span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="font-bold text-gray-900">${trip.price.toFixed(2)}</span>
                {trip.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-gray-500">{trip.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}
