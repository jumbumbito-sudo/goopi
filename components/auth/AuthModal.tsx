'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Modal } from '@/components/ui/modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register'>(defaultView);

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0">
      <div className="p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <span className="text-white font-bold text-2xl">G</span>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'login' ? (
            <LoginForm
              key="login"
              onSuccess={handleSuccess}
              onSwitchToRegister={() => setView('register')}
            />
          ) : (
            <RegisterForm
              key="register"
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setView('login')}
            />
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}

// Quick access button for auth
interface AuthButtonProps {
  onClick: () => void;
}

export function AuthButton({ onClick }: AuthButtonProps) {
  return (
    <Button variant="goopi" onClick={onClick} className="gap-2">
      <User className="w-5 h-5" />
      Ingresar
    </Button>
  );
}
