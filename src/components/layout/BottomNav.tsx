'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useStore';
import { 
  Home, 
  Map, 
  ShoppingBag, 
  User
} from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'mapa', label: 'Mapa', icon: Map },
  { id: 'guia', label: 'Guía', icon: ShoppingBag },
  { id: 'perfil', label: 'Perfil', icon: User },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-lg"
    >
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#942cb3] bg-purple-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              </motion.div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0.5 w-8 h-1 bg-gradient-to-r from-[#942cb3] to-[#a855f7] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
