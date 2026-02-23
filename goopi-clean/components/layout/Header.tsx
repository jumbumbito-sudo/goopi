'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useStore';
import { 
  User, 
  Menu, 
  Bell, 
  ChevronDown,
  Car,
  Package
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { updateUserRole } = useAppStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleRoleChange = (role: 'usuario' | 'conductor') => {
    updateUserRole(role);
    setShowRoleMenu(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Goopi
            </span>
          </motion.div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {user?.role === 'conductor' ? (
                    <Car className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Package className="w-4 h-4 text-emerald-500" />
                  )}
                  <span className="text-sm font-medium capitalize">{user?.role}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {showRoleMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[150px]"
                  >
                    <button
                      onClick={() => handleRoleChange('usuario')}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        user?.role === 'usuario' ? 'bg-emerald-50 text-emerald-600' : ''
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      Usuario
                    </button>
                    <button
                      onClick={() => handleRoleChange('conductor')}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        user?.role === 'conductor' ? 'bg-amber-50 text-amber-600' : ''
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      Conductor
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button variant="goopi" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              Ingresar
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
