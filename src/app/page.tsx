'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Bell,
  Search,
  Car,
  Package,
  Newspaper,
  Calendar,
} from 'lucide-react';

/* ===== LINKS WP ===== */
const MAPA_WP = 'https://goopiapp.com/taxis-disponibles/';
const NOTICIAS_WP = 'https://goopiapp.com/locales/noticias/';
const REGISTRO_UNIDADES_WP =
  'https://goopiapp.com/registro-de-taxistas/';
const PUNTOS_WP = 'https://goopiapp.com/puntos/';
const REGISTRO_WP = 'https://goopiapp.com/registro/';

/* ===== HOME ===== */
export default function Home() {
  const [tab, setTab] = useState<'home' | 'mapa' | 'perfil'>('home');
  const [news, setNews] = useState<any[]>([]);

  /* NOTICIAS DESDE CATEGORÍA */
  useEffect(() => {
    fetch(
      'https://goopiapp.com/wp-json/wp/v2/posts?categories=23&_embed'
    )
      .then(res => res.json())
      .then(setNews);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* CABECERA */}
      <header className="bg-purple-700 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-lg">Goopi</h1>
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
      <div className="flex-1 overflow-y-auto p-4">
        {/* HOME */}
        {tab === 'home' && (
          <>
            {/* TAXI / DELIVERY */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setTab('mapa')}
                className="bg-orange-500 text-white rounded-xl p-4"
              >
                <Car className="mb-2" /> Pedir Taxi
              </button>

              <button
                onClick={() => setTab('mapa')}
                className="bg-cyan-500 text-white rounded-xl p-4"
              >
                <Package className="mb-2" /> Delivery
              </button>
            </div>

            {/* NOTICIAS */}
            <h2 className="font-bold flex items-center gap-2 mb-2">
              <Newspaper /> Noticias
            </h2>

            <div className="flex gap-3 overflow-x-auto mb-6">
              {news.map(post => {
                const img =
                  post._embedded?.['wp:featuredmedia']?.[0]
                    ?.source_url;

                return (
                  <div
                    key={post.id}
                    onClick={() =>
                      window.open(post.link, '_blank')
                    }
                    className="w-72 bg-white rounded-xl shadow overflow-hidden"
                  >
                    {img && (
                      <img
                        src={img}
                        className="h-32 w-full object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h3
                        className="font-semibold"
                        dangerouslySetInnerHTML={{
                          __html: post.title.rendered,
                        }}
                      />
                      <div className="text-xs text-gray-400 mt-2 flex gap-1">
                        <Calendar size={12} />
                        {new Date(
                          post.date
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACUMULA PUNTOS */}
            <button
              onClick={() =>
                window.open(PUNTOS_WP, '_blank')
              }
              className="w-full bg-yellow-400 rounded-xl py-3 font-bold mb-4"
            >
              Acumula puntos
            </button>

            {/* REGISTRO UNIDADES */}
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

        {/* MAPA */}
        {tab === 'mapa' && (
          <iframe
            src={MAPA_WP}
            className="w-full h-[80vh] border-0"
          />
        )}

        {/* PERFIL */}
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
      </div>

      {/* MENÚ INFERIOR */}
      <nav className="flex justify-around border-t bg-white py-3">
        <button onClick={() => setTab('home')}>Inicio</button>
        <button onClick={() => setTab('mapa')}>Mapa</button>
        <button onClick={() => setTab('perfil')}>Perfil</button>
      </nav>
    </div>
  );
}
