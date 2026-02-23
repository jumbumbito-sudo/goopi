'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crosshair, 
  Car,
  Package,
  X,
  MapPin,
  Clock,
  DollarSign,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MAPBOX_TOKEN, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/mapbox';
import { useAppStore, Driver, Location } from '@/store/useStore';

// Set Mapbox token
mapboxgl.accessToken = MAPBOX_TOKEN;

// Iconos SVG para taxi y moto
const TAXI_ICON_SVG = `
<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
</svg>`;

const MOTORCYCLE_ICON_SVG = `
<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M19.5 12c.93 0 1.78.28 2.5.76V8c0-1.1-.9-2-2-2h-3.17l-1.86-2H10.5v2h3.17l1.86 2H20v2.5c-.58-.34-1.26-.5-2-.5-2.07 0-3.81 1.39-4.35 3.28-.15-.02-.3-.03-.45-.03-.55 0-1.08.1-1.58.28L9.7 11H6.5c-.83 0-1.5.67-1.5 1.5S5.67 14 6.5 14h2.17l.8.8c-.55.68-.97 1.47-1.21 2.34-.15-.02-.3-.04-.46-.04-.55 0-1.08.1-1.58.28L4.7 15H2.5c-.83 0-1.5.67-1.5 1.5S1.67 18 2.5 18h1.17l1.44 1.44C4.97 20.39 5.91 21 7 21c1.49 0 2.75-.98 3.17-2.33.49.22 1.03.33 1.58.33.55 0 1.08-.1 1.58-.28l1.97 1.97c.93.93 2.48.93 3.41 0l2.12-2.12c.93-.93.93-2.48 0-3.41L19.5 12zm-8.6 4.76c.28-.71.93-1.23 1.7-1.37.01.04.02.07.03.11L14 15.63l.17.17c-.29.13-.6.2-.92.2-.7 0-1.32-.35-1.68-.88l-.67.64zm5.1 2.44L14.5 16.7v-.13l.03-.06.03-.08c.1-.33.38-.56.71-.6l.06-.01h.08l.16.03.1.05.08.06.04.03 2.17 2.17-.38.38c-.19.19-.51.19-.7 0zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
</svg>`;

// Simulated nearby drivers with new fields
const generateNearbyDrivers = (center: [number, number]): Driver[] => {
  const drivers: Driver[] = [];
  const taxiNames = ['Carlos M.', 'Pedro R.', 'Luis A.', 'Miguel S.', 'José G.'];
  const deliveryNames = ['Ana P.', 'María L.', 'Sofía R.', 'Carmen D.'];
  const taxiVehicles = ['Toyota Corolla', 'Hyundai Accent', 'Kia Rio', 'Nissan Sentra', 'Chevrolet Aveo'];
  const deliveryVehicles = ['Honda CG 150', 'Yamaha XTZ', 'Suzuki EN 150', 'Bajaj Boxer'];
  const cooperativasTaxi = ['Cooperativa Macas', 'Taxi Unidos', 'Transporte Morona', 'Cooperativa Santiago'];
  const cooperativasDelivery = ['Delivery Express', 'MotoMensajería', 'Rápidos del Oriente'];
  
  // Generar taxis
  for (let i = 0; i < 4; i++) {
    drivers.push({
      id: `taxi-${i}`,
      name: taxiNames[Math.floor(Math.random() * taxiNames.length)],
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=taxi${i}`,
      vehicle: taxiVehicles[Math.floor(Math.random() * taxiVehicles.length)],
      plate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 900) + 100}`,
      rating: 4 + Math.random() * 0.9,
      location: {
        lat: center[1] + (Math.random() - 0.5) * 0.015,
        lng: center[0] + (Math.random() - 0.5) * 0.015,
      },
      available: Math.random() > 0.2,
      unitNumber: `TAX-${String(100 + i).padStart(3, '0')}`,
      cooperative: cooperativasTaxi[Math.floor(Math.random() * cooperativasTaxi.length)],
      phone: `09${Math.floor(Math.random() * 90000000) + 10000000}`,
      type: 'taxi',
    });
  }
  
  // Generar motos de delivery
  for (let i = 0; i < 3; i++) {
    drivers.push({
      id: `delivery-${i}`,
      name: deliveryNames[Math.floor(Math.random() * deliveryNames.length)],
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=delivery${i}`,
      vehicle: deliveryVehicles[Math.floor(Math.random() * deliveryVehicles.length)],
      plate: `M${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 900) + 100}`,
      rating: 4 + Math.random() * 0.9,
      location: {
        lat: center[1] + (Math.random() - 0.5) * 0.015,
        lng: center[0] + (Math.random() - 0.5) * 0.015,
      },
      available: Math.random() > 0.25,
      unitNumber: `DEL-${String(200 + i).padStart(3, '0')}`,
      cooperative: cooperativasDelivery[Math.floor(Math.random() * cooperativasDelivery.length)],
      phone: `09${Math.floor(Math.random() * 90000000) + 10000000}`,
      type: 'delivery',
    });
  }
  
  return drivers;
};

interface MapComponentProps {
  onServiceRequest?: (type: 'taxi' | 'delivery') => void;
}

export function MapComponent({ onServiceRequest }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const driverMarkers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [panelHeight, setPanelHeight] = useState<'compact' | 'medium' | 'full'>('compact');
  const [address, setAddress] = useState('Ubicación actual');
  
  const { serviceType, setServiceType, setShowServicePanel } = useAppStore();

  // Calculate nearby drivers based on user location using useMemo
  const nearbyDrivers = useMemo(() => {
    if (!userLocation) return [];
    return generateNearbyDrivers([userLocation.lng, userLocation.lat]);
  }, [userLocation]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15,
            });
          }
        },
        () => {
          // Use default location if geolocation fails
          setUserLocation({ lat: DEFAULT_CENTER[1], lng: DEFAULT_CENTER[0] });
        }
      );
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update user marker
  useEffect(() => {
    if (!map.current || !userLocation) return;

    // Remove existing user marker
    if (userMarker.current) {
      userMarker.current.remove();
    }

    // Create custom marker element
    const el = document.createElement('div');
    el.className = 'user-marker';
    el.innerHTML = `
      <div class="relative">
        <div class="w-6 h-6 bg-purple-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
        <div class="absolute -inset-4 bg-purple-500/20 rounded-full animate-ping"></div>
      </div>
    `;

    userMarker.current = new mapboxgl.Marker({ element: el })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map.current);
  }, [userLocation]);

  // Update driver markers with custom icons and popups
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing driver markers and popups
    driverMarkers.current.forEach(marker => marker.remove());
    popups.current.forEach(popup => popup.remove());
    driverMarkers.current = [];
    popups.current = [];

    // Add new driver markers
    nearbyDrivers.forEach(driver => {
      if (!driver.available) return;

      const el = document.createElement('div');
      el.className = 'driver-marker cursor-pointer transition-transform hover:scale-110';
      
      // Icono diferente según tipo
      const bgColor = driver.type === 'taxi' ? 'bg-amber-500' : 'bg-cyan-500';
      const iconSvg = driver.type === 'taxi' ? TAXI_ICON_SVG : MOTORCYCLE_ICON_SVG;
      
      el.innerHTML = `
        <div class="relative">
          <div class="${bgColor} w-12 h-12 rounded-full border-3 border-white shadow-lg flex items-center justify-center transform">
            ${iconSvg}
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-md text-xs font-bold text-gray-700 whitespace-nowrap">
            ${driver.unitNumber}
          </div>
        </div>
      `;

      // Crear popup con información del conductor
      const popupContent = document.createElement('div');
      popupContent.className = 'driver-popup p-3 min-w-[220px]';
      popupContent.innerHTML = `
        <div class="flex items-center gap-3 mb-3">
          <img src="${driver.photo}" alt="${driver.name}" class="w-12 h-12 rounded-full bg-gray-200" />
          <div>
            <h4 class="font-semibold text-gray-900">${driver.name}</h4>
            <div class="flex items-center gap-1">
              <span class="text-amber-500">★</span>
              <span class="text-sm font-medium">${driver.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div class="space-y-2 mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 ${driver.type === 'taxi' ? 'bg-amber-500' : 'bg-cyan-500'} rounded-full"></span>
            <span class="text-sm text-gray-600"><strong>Unidad:</strong> ${driver.unitNumber}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span class="text-sm text-gray-600"><strong>Cooperativa:</strong> ${driver.cooperative}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span class="text-sm text-gray-600"><strong>Vehículo:</strong> ${driver.vehicle}</span>
          </div>
        </div>
        <button onclick="window.open('https://wa.me/593${driver.phone.substring(1)}?text=Hola, te contacto desde Goopi', '_blank')" 
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Contactar por WhatsApp
        </button>
      `;

      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        offset: 40,
        className: 'custom-popup'
      }).setDOMContent(popupContent);

      el.addEventListener('click', () => {
        setSelectedDriver(driver);
        setShowPanel(true);
        setPanelHeight('medium');
        if (map.current) {
          map.current.flyTo({
            center: [driver.location.lng, driver.location.lat],
            zoom: 16,
          });
          popup.setLngLat([driver.location.lng, driver.location.lat]).addTo(map.current);
        }
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([driver.location.lng, driver.location.lat])
        .addTo(map.current!);

      driverMarkers.current.push(marker);
      popups.current.push(popup);
    });
  }, [nearbyDrivers, mapLoaded]);

  const centerOnUser = useCallback(() => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 15,
      });
    }
  }, [userLocation]);

  const handleServiceRequest = useCallback((type: 'taxi' | 'delivery') => {
    setServiceType(type);
    setShowServicePanel(true);
    setShowPanel(true);
    setPanelHeight('medium');
    onServiceRequest?.(type);
  }, [setServiceType, setShowServicePanel, onServiceRequest]);

  const handleWhatsAppContact = useCallback((driver: Driver) => {
    const phoneNumber = `593${driver.phone.substring(1)}`;
    const message = encodeURIComponent(`Hola ${driver.name}, te contacto desde Goopi. Vi tu unidad ${driver.unitNumber} en el mapa.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  }, []);

  const panelHeights = {
    compact: 'h-32',
    medium: 'h-1/2',
    full: 'h-[85vh]',
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
        {/* Search/Address Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3 pointer-events-auto max-w-[calc(100%-60px)]"
        >
          <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0" />
          <span className="text-sm text-gray-700 truncate">{address}</span>
        </motion.div>

        {/* Center Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={centerOnUser}
          className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center pointer-events-auto"
        >
          <Crosshair className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 left-4 z-10 bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 pointer-events-auto"
      >
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
              <Car className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-700">Taxis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
              <Package className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-700">Delivery</span>
          </div>
        </div>
      </motion.div>

      {/* Service Buttons */}
      <AnimatePresence>
        {!showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-6 left-4 right-4 z-10 flex gap-3"
          >
            <Button
              variant="taxi"
              size="xl"
              className="flex-1 gap-2"
              onClick={() => handleServiceRequest('taxi')}
            >
              <Car className="w-6 h-6" />
              Pedir Taxi
            </Button>
            <Button
              variant="delivery"
              size="xl"
              className="flex-1 gap-2"
              onClick={() => handleServiceRequest('delivery')}
            >
              <Package className="w-6 h-6" />
              Delivery
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl ${panelHeights[panelHeight]} z-20 overflow-hidden`}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <button
                onClick={() => setPanelHeight(panelHeight === 'compact' ? 'full' : 'compact')}
                className="w-12 h-1.5 bg-gray-300 rounded-full"
              />
            </div>

            {/* Panel Header */}
            <div className="px-4 pb-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {serviceType === 'taxi' ? '🚕 Pedir Taxi' : '📦 Pedir Delivery'}
                </h3>
                <button
                  onClick={() => {
                    setShowPanel(false);
                    setServiceType(null);
                    setSelectedDriver(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
              {selectedDriver ? (
                <div className="space-y-4">
                  {/* Driver Info */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <img
                      src={selectedDriver.photo}
                      alt={selectedDriver.name}
                      className="w-16 h-16 rounded-full bg-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{selectedDriver.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedDriver.type === 'taxi' ? 'bg-amber-100 text-amber-700' : 'bg-cyan-100 text-cyan-700'}`}>
                          {selectedDriver.type === 'taxi' ? '🚕 Taxi' : '🏍️ Delivery'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{selectedDriver.vehicle}</p>
                      <p className="text-sm text-gray-500">{selectedDriver.plate}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-amber-500">★</span>
                        <span className="text-sm font-medium">{selectedDriver.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Details - New Section */}
                  <div className="bg-purple-50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{selectedDriver.unitNumber.split('-')[0]}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Unidad</p>
                        <p className="font-semibold text-gray-900">{selectedDriver.unitNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Cooperativa</p>
                        <p className="font-semibold text-gray-900">{selectedDriver.cooperative}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                      <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      <span className="text-sm text-gray-700">Tu ubicación actual</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <input
                        type="text"
                        placeholder="¿A dónde vamos?"
                        className="flex-1 bg-transparent outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Price and Time */}
                  <div className="flex justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="text-center">
                      <Clock className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">Tiempo</p>
                      <p className="font-semibold">5 min</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">Estimado</p>
                      <p className="font-semibold">$3.50</p>
                    </div>
                    <div className="text-center">
                      <MapPin className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">Distancia</p>
                      <p className="font-semibold">2.5 km</p>
                    </div>
                  </div>

                  {/* WhatsApp Button - Prominent */}
                  <Button
                    onClick={() => handleWhatsAppContact(selectedDriver)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 text-lg"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contactar por WhatsApp
                  </Button>

                  <Button variant="goopi" size="lg" className="w-full">
                    Confirmar Viaje
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-gray-500 py-4">
                    Selecciona un conductor cercano en el mapa
                  </p>
                  
                  {/* Available Drivers List */}
                  <div className="space-y-2">
                    {nearbyDrivers.filter(d => d.available).map(driver => (
                      <button
                        key={driver.id}
                        onClick={() => setSelectedDriver(driver)}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <img
                          src={driver.photo}
                          alt={driver.name}
                          className="w-12 h-12 rounded-full bg-gray-200"
                        />
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{driver.name}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${driver.type === 'taxi' ? 'bg-amber-100 text-amber-700' : 'bg-cyan-100 text-cyan-700'}`}>
                              {driver.type === 'taxi' ? '🚕' : '🏍️'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{driver.vehicle} • {driver.unitNumber}</p>
                          <p className="text-xs text-gray-400">{driver.cooperative}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-amber-500">★</span>
                            <span className="text-sm">{driver.rating.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-gray-400">~3 min</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-30">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}
