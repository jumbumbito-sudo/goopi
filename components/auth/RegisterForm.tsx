'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  ArrowLeft,
  User,
  Car,
  Package
} from 'lucide-react';
import { UserRole } from '@/store/useStore';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin: () => void;
  onBack?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin, onBack }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('usuario');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = await register(email, password, name, role);
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || 'Error al registrar usuario');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-md mx-auto"
    >
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
        <p className="text-gray-500 mt-1">Únete a Goopi hoy</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="space-y-2">
          <Label>¿Qué tipo de cuenta deseas?</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('usuario')}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                role === 'usuario'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Package className={`w-6 h-6 ${role === 'usuario' ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span className={`font-medium ${role === 'usuario' ? 'text-emerald-700' : 'text-gray-600'}`}>
                Usuario
              </span>
              <span className="text-xs text-gray-500">Pedir taxi/delivery</span>
            </button>
            
            <button
              type="button"
              onClick={() => setRole('conductor')}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                role === 'conductor'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Car className={`w-6 h-6 ${role === 'conductor' ? 'text-amber-600' : 'text-gray-400'}`} />
              <span className={`font-medium ${role === 'conductor' ? 'text-amber-700' : 'text-gray-600'}`}>
                Conductor
              </span>
              <span className="text-xs text-gray-500">Ofrecer servicios</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="goopi"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </Button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-emerald-600 font-medium hover:text-emerald-700"
        >
          Inicia sesión
        </button>
      </p>
    </motion.div>
  );
}
