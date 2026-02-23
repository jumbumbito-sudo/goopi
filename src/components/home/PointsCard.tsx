'use client';

import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated';
import { Gift, Star, Zap, Trophy } from 'lucide-react';

export function PointsCard() {
  const points = 1250;
  const level = 'Oro';
  const nextLevel = 1750;

  return (
    <AnimatedCard className="p-5 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
      <div className="absolute -right-5 -bottom-5 w-30 h-30 bg-white/5 rounded-full" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            <span className="font-medium text-emerald-100">Mis Puntos</span>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-semibold">{level}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-3xl font-bold">{points.toLocaleString()}</span>
          <span className="text-emerald-200 ml-2">puntos</span>
        </div>

        {/* Progress to next level */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-emerald-200">
            <span>Progreso</span>
            <span>{nextLevel - points} pts para Platino</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(points / nextLevel) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1"
          >
            <Zap className="w-4 h-4" />
            Canjear
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1"
          >
            <Star className="w-4 h-4" />
            Historial
          </motion.button>
        </div>
      </div>
    </AnimatedCard>
  );
}
