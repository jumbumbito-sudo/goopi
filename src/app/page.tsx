'use client';

import { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  Map as MapIcon,
  BookOpen,
  User,
  MapPin,
  Bell,
  Search,
  Car,
  Package,
  Newspaper,
} from 'lucide-react';

import { GuiaComponent } from '@/components/guia/GuiaComponent';

/* ===== LINKS WP (NO SE TOCAN) ===== */
const MAPA_WP = 'https://goopiapp.com/taxis-disponibles/';
const NOTICIAS_WP = 'https://goopiapp.com/locales/noticias/';
const REGISTRO_UNIDADES_WP =
  'https://goopiapp.com/registro-de-taxistas/';
const PUNTOS_WP = 'https://goopiapp.com/puntos/';
const REGISTRO_WP = 'https://goopiapp.com/registro/';

export default function Home() {
  const [tab, setTab] = useState<'home' | 'mapa' | 'guia' | 'perfil'>(
    'home'
  );
  const [paraTi, setParaTi] = useState<any[]>([]);

  /* PARA TI (NO SE TOCA) */
  useEffect(() => {
    fetch(
      'https://goopiapp.com/wp-json/wp/v2/posts?per_page=6&_embed'
    )
      .then(res => res.json())
      .then(setParaTi)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* CABECERA */}
      <header className="bg-purple-700 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Goopi"
              className="h-8 w-auto"
            />
            <h1 className="font-bold text-lg">Goopi</h1>
          </div>
          <div className="flex gap-2">
            <Search />
            <Bell />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <MapPin size={14} /> Macas, Ecuador
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex-1 overflow-y-auto p-4">
        {tab === 'home' && (
          <>
            {/* TAXI / DELIVERY */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setTab('mapa')}
                className="bg-orange-500 text-white rounded-2xl p-4"
              >
                <Car className="mb-2" />
                Pedir Taxi
              </button>

              <button
                onClick={() => setTab('mapa')}
                className="bg-cyan-500 text-white rounded-2xl p-4"
              >
                <Package className="mb-2" />
                Delivery
              </button>
            </div>

            {/* NOTICIAS (BOTÓN GRANDE) */}
            <div className="mb-6">
              <h2 className="font-bold flex items-center gap-2 mb-3">
                <Newspaper size={18} /> Noticias
              </h2>

              <button
                onClick={() =>
                  window.open(NOTICIAS_WP, '_blank')
                }
                className="w-full bg-purple-600 text-white rounded-2xl py-4 text-lg font-bold shadow"
              >
                Ver noticias
              </button>
            </div>

            {/* PARA TI (NO SE TOCA) */}
            <h2 className="font-bold mb-3">Para ti</h2>

            <div className="flex gap-3 overflow-x-auto mb-6">
              {paraTi.map(post => {
                const img =
                  post._embedded?.['wp:featuredmedia']?.[0]
                    ?.source_url;

                return (
                  <div
                    key={post.id}
                    onClick={() =>
                      window.open(post.link, '_blank')
                    }
                    className="w-72 shrink-0 bg-white rounded-2xl shadow overflow-hidden cursor-pointer"
                  >
                    {img && (
                      <img
                        src={img}
                        className="w-full aspect-[16/9] object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h3
                        className="font-semibold line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: post.title.rendered,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => window.open(PUNTOS_WP, '_blank')}
              className="w-full bg-yellow-400 rounded-xl py-3 font-bold mb-4"
            >
              Acumula puntos
            </button>

            <button
              onClick={() =>
                window.open(REGISTRO_UNIDADES_WP, '_blank')
              }
              className="w-full bg-purple-600 text-white rounded-xl py-3 font-bold"
            >
              Registro de unidades
            </button>
          </>
        )}

        {tab === 'mapa' && (
          <iframe
            src={MAPA_WP}
            className="w-full h-[80vh] border-0"
          />
        )}

        {tab === 'guia' && <GuiaComponent />}

        {tab === 'perfil' && (
          <div className="flex flex-col gap-4 mt-10">
            <button
              onClick={() =>
                window.open(REGISTRO_WP, '_blank')
              }
              className="bg-purple-600 text-white py-3 rounded-xl"
            >
              Registrarse
            </button>
            <button className="border border-purple-600 text-purple-600 py-3 rounded-xl">
              Iniciar sesión
            </button>
          </div>
        )}
      </main>

      {/* MENÚ INFERIOR */}
      <nav className="flex justify-around border-t bg-white py-2">
        <button
          onClick={() => setTab('home')}
          className={`flex flex-col items-center text-xs ${
            tab === 'home' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <HomeIcon size={20} />
          Inicio
        </button>

        <button
          onClick={() => setTab('mapa')}
          className={`flex flex-col items-center text-xs ${
            tab === 'mapa' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <MapIcon size={20} />
          Mapa
        </button>

        <button
          onClick={() => setTab('guia')}
          className={`flex flex-col items-center text-xs ${
            tab === 'guia' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <BookOpen size={20} />
          Guía
        </button>

        <button
          onClick={() => setTab('perfil')}
          className={`flex flex-col items-center text-xs ${
            tab === 'perfil' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <User size={20} />
          Perfil
        </button>
      </nav>
    </div>
  );
}
