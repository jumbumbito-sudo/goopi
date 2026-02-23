export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v12';
export const DEFAULT_CENTER: [number, number] = [-79.9, -2.2];
export const DEFAULT_ZOOM = 14;
export const MARKER_ICONS = {
  user: 'user-marker',
  driver: 'driver-marker',
  pickup: 'pickup-marker',
  destination: 'destination-marker',
  business: 'business-marker',
};
