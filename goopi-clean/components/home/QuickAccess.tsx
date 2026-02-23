'use client';

import { motion } from 'framer-motion';
import { 
  Car, 
  Package, 
  ShoppingBag, 
  Utensils, 
  Hotel, 
  Landmark,
  ArrowRight
} from 'lucide-react';

interface QuickAccessButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  onClick?: () => void;
}

function QuickAccessButton({ icon, label, color, bgColor, onClick }: QuickAccessButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3"
    >
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
        <div className={color}>{icon}</div>
      </div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </motion.button>
  );
}

interface QuickAccessProps {
  onServiceSelect: (service: string) => void;
}

export function QuickAccess({ onServiceSelect }: QuickAccessProps) {
  const mainServices = [
    {
      id: 'taxi',
      icon: <Car className="w-6 h-6" />,
      label: 'Pedir Taxi',
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-100 to-orange-100',
    },
    {
      id: 'delivery',
      icon: <Package className="w-6 h-6" />,
      label: 'Delivery',
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    },
    {
      id: 'guia',
      icon: <ShoppingBag className="w-6 h-6" />,
      label: 'Guía Comercial',
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    },
  ];

  const categories = [
    {
      id: 'restaurantes',
      icon: <Utensils className="w-5 h-5" />,
      label: 'Restaurantes',
      color: 'text-rose-500',
      bgColor: 'bg-rose-100',
    },
    {
      id: 'hoteles',
      icon: <Hotel className="w-5 h-5" />,
      label: 'Hoteles',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
    },
    {
      id: 'atracciones',
      icon: <Landmark className="w-5 h-5" />,
      label: 'Atracciones',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <section className="py-6">
      {/* Main Services */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {mainServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onServiceSelect(service.id)}
              className={`w-full ${service.bgColor} rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md`}
            >
              <div className={service.color}>{service.icon}</div>
              <span className="text-sm font-semibold text-gray-800">{service.label}</span>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Categories */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Explorar</h3>
        <button className="text-sm text-emerald-600 font-medium flex items-center gap-1">
          Ver más <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <QuickAccessButton
              icon={category.icon}
              label={category.label}
              color={category.color}
              bgColor={category.bgColor}
              onClick={() => onServiceSelect('guia')}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
