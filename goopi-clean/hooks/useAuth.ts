'use client';

import { useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { useAppStore, User, UserRole } from '@/store/useStore';

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: userData.role || 'usuario',
            phone: userData.phone,
          });
        } else {
          // New user - create document
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'usuario',
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...newUser,
            createdAt: new Date(),
          });
          
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión con Google';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const register = useCallback(async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole = 'usuario'
  ) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(result.user, { displayName });
      
      const newUser: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName,
        photoURL: result.user.photoURL,
        role,
      };
      
      await setDoc(doc(db, 'users', result.user.uid), {
        ...newUser,
        createdAt: new Date(),
      });
      
      setUser(newUser);
      return { success: true, user: result.user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar usuario';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cerrar sesión';
      return { success: false, error: errorMessage };
    }
  }, [setUser]);

  const updateUserRole = useCallback(async (role: UserRole) => {
    if (!user) return { success: false, error: 'No hay usuario autenticado' };
    
    try {
      await setDoc(doc(db, 'users', user.uid), { role }, { merge: true });
      useAppStore.getState().updateUserRole(role);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar rol';
      return { success: false, error: errorMessage };
    }
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginWithEmail,
    loginWithGoogle,
    register,
    logout,
    updateUserRole,
  };
}
