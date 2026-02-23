import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'usuario' | 'conductor';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  phone?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Driver {
  id: string;
  name: string;
  photo: string;
  vehicle: string;
  plate: string;
  rating: number;
  location: Location;
  available: boolean;
  // Nuevos campos para mostrar en popup
  unitNumber: string; // Número de unidad (ej: "TAX-001", "DEL-045")
  cooperative: string; // Nombre de la cooperativa
  phone: string; // Número de WhatsApp
  type: 'taxi' | 'delivery'; // Tipo de servicio
}

export interface ServiceRequest {
  id: string;
  type: 'taxi' | 'delivery';
  pickup: Location;
  destination?: Location;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  driver?: Driver;
  price?: number;
  createdAt: Date;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  image: string;
  validUntil: string;
  code: string;
}

interface AppState {
  // Auth
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateUserRole: (role: UserRole) => void;

  // Location
  currentLocation: Location | null;
  setCurrentLocation: (location: Location | null) => void;

  // Service
  activeService: ServiceRequest | null;
  setActiveService: (service: ServiceRequest | null) => void;
  serviceHistory: ServiceRequest[];
  addServiceToHistory: (service: ServiceRequest) => void;

  // Map
  isMapReady: boolean;
  setMapReady: (ready: boolean) => void;
  showServicePanel: boolean;
  setShowServicePanel: (show: boolean) => void;
  serviceType: 'taxi' | 'delivery' | null;
  setServiceType: (type: 'taxi' | 'delivery' | null) => void;

  // Driver (for conductor role)
  isDriverAvailable: boolean;
  setDriverAvailable: (available: boolean) => void;
  driverEarnings: number;
  addDriverEarnings: (amount: number) => void;

  // UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      updateUserRole: (role) => set((state) => ({
        user: state.user ? { ...state.user, role } : null,
      })),

      // Location
      currentLocation: null,
      setCurrentLocation: (currentLocation) => set({ currentLocation }),

      // Service
      activeService: null,
      setActiveService: (activeService) => set({ activeService }),
      serviceHistory: [],
      addServiceToHistory: (service) => set((state) => ({
        serviceHistory: [...state.serviceHistory, service],
      })),

      // Map
      isMapReady: false,
      setMapReady: (isMapReady) => set({ isMapReady }),
      showServicePanel: false,
      setShowServicePanel: (showServicePanel) => set({ showServicePanel }),
      serviceType: null,
      setServiceType: (serviceType) => set({ serviceType }),

      // Driver
      isDriverAvailable: false,
      setDriverAvailable: (isDriverAvailable) => set({ isDriverAvailable }),
      driverEarnings: 0,
      addDriverEarnings: (amount) => set((state) => ({
        driverEarnings: state.driverEarnings + amount,
      })),

      // UI
      activeTab: 'home',
      setActiveTab: (activeTab) => set({ activeTab }),
    }),
    {
      name: 'goopi-storage',
      partialize: (state) => ({
        user: state.user,
        serviceHistory: state.serviceHistory,
        driverEarnings: state.driverEarnings,
      }),
    }
  )
);
