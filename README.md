# 🚕 Goopi App

**"Donde todo sucede"** - Tu app de taxi, delivery y guía comercial.

## Características

- 🚕 **Pedir Taxi** - Solicita un taxi con un clic
- 📦 **Delivery** - Envíos a domicilio
- 📍 **Guía Comercial** - Negocios locales
- 👤 **Autenticación** - Firebase Auth

## Tecnologías

- Next.js 15
- React 19
- Tailwind CSS
- Mapbox
- Firebase
- WordPress API

## Variables de Entorno

Crea un archivo `.env.local` con:

```
NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_mapbox
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=taxi-macas-52717.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=taxi-macas-52717
WORDPRESS_API_URL=https://goopiapp.com/wp-json/
```

## Instalación

```bash
bun install
bun run dev
```

## Deploy

La app está desplegada en Vercel.
