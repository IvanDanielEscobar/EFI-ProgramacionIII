"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
} from "lucide-react";
import { mueblesService } from "@/services/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);

function normalizarMueble(m) {
  const car = Array.isArray(m.caracteristicas)
    ? m.caracteristicas[0]
    : m.caracteristicas;
  const precio = Number(m.precio ?? car?.precio) || 0;

  return {
    id: m.id,
    nombre: m.nombre,
    categoria: m.categoria_nombre ?? "",
    precio: precio ? formatearPrecio(precio) : "",
    cuotas: precio ? `6 cuotas fijas de ${formatearPrecio(precio / 6)}` : "",
    imagen: m.imagen || "/images/prod-sofa.jpg",
    colores: [],
    href: `/catalogo/${m.id}`,
  };
}

export default function HomePage() {
  const masVendidosRef = useRef(null);

  const [destacados, setDestacados] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function cargarDestacados() {
      try {
        const response = await fetch(`${API_BASE_URL}/muebles/destacados/`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        const lista = Array.isArray(data) ? data : (data.results ?? []);
        if (lista.length > 0) {
          setDestacados(lista.slice(0, 5).map(normalizarMueble));
        }
      } catch {
        // Si falla, se mantiene el listado de respaldo
      }
    }

    cargarDestacados();
    return () => controller.abort();
}, []);

  // Recomendaciones Hero
  const heroRecomendados = [
    {
      id: "13",
      titulo: "Rinconero Olala XXL",
      subtitulo: "Tapizado en lino natural antimanchas y estructura maciza en madera de paraíso.",
      imagen: "/images/hero-sofa.jpg",
      href: "/catalogo/13",
      etiqueta: "Living & Confort",
    },
    {
      id: "14",
      titulo: "Rinconero Lounge Petiribí",
      subtitulo: "Líneas puras, respaldos envolventes y mesas auxiliares integradas con veta viva.",
      imagen: "/images/hero-lounge.jpg",
      href: "/catalogo/14",
      etiqueta: "Edición Limitada",
    },
  ];

  // Categorías
  const categorias = [
    {
      nombre: "Living & Sala",
      descripcion: "Sillones modulares, mesas ratonas y racks Japandi.",
      imagen: "/images/cat-living.jpg",
      href: "/catalogo?categoria=Living",
    },
    {
      nombre: "Comedor",
      descripcion: "Mesas extensibles macizas y sillas ergonómicas.",
      imagen: "/images/cat-comedor.jpg",
      href: "/catalogo?categoria=Comedor",
    },
    {
      nombre: "Dormitorio",
      descripcion: "Respaldos entelados, mesas de luz y cómodas.",
      imagen: "/images/cat-dormitorio.jpg",
      href: "/catalogo?categoria=Dormitorio",
    },
    {
      nombre: "Home Office",
      descripcion: "Escritorios de diseño y bibliotecas modulares.",
      imagen: "/images/cat-oficina.jpg",
      href: "/catalogo?categoria=Oficina",
    },
  ];

  // Los Más Vendidos
  const [masVendidos, setMasVendidos] = useState([]);
  const [cargandoVendidos, setCargandoVendidos] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function cargarDestacados() {
      try {
        let items = await mueblesService.getDestacados(8);
        // Si hay menos de 4 con ventas registradas, completamos con los más recientes de la base de datos
        if (!items || items.length < 4) {
          const allRes = await mueblesService.getAll({
            limit: 8,
            ordering: "-fecha_creacion",
          });
          const allItems = allRes.results || [];
          const ids = new Set((items || []).map((i) => i.id));
          items = [...(items || [])];
          for (const extra of allItems) {
            if (!ids.has(extra.id)) {
              items.push(extra);
              ids.add(extra.id);
            }
          }
        }

        if (!mounted) return;

        const mapeados = items.map((m) => ({
          id: m.id,
          nombre: m.nombre,
          categoria: m.categoria,
          precio: new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
          }).format(m.precio || 0),
          cuotas: `6 cuotas sin interés de ${new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
          }).format(Math.round((m.precio || 0) / 6))}`,
          imagen: m.imagen,
          colores: ["#F5F1EA", "#B2967D", "#4A342A"],
          href: `/catalogo/${m.id}`,
        }));

        setMasVendidos(mapeados);
      } catch (err) {
        console.warn("Aviso al cargar muebles destacados:", err.message);
      } finally {
        if (mounted) setCargandoVendidos(false);
      }
    }

    cargarDestacados();

    return () => {
      mounted = false;
    };
  }, []);

  // Reseñas de Clientes
  const resenas = [
    {
      nombre: "Martina Rossi",
      ciudad: "Río Cuarto, Cba",
      producto: "Sillón Nórdico 3c",
      calificacion: 5,
      comentario:
        "La calidad de la madera y la terminación del lino es impresionante. Coordinamos todo por WhatsApp y retiramos en el showroom de Río Cuarto sin ninguna demora.",
    },
    {
      nombre: "Gonzalo & Belén",
      ciudad: "Córdoba Capital",
      producto: "Mesa Extensible Petiribí",
      calificacion: 5,
      comentario:
        "Buscábamos una mesa para 8 personas con calidez de madera real. Llegó impecable, las medidas en la ficha técnica eran exactas. 100% recomendable.",
    },
    {
      nombre: "Lucía Fernández",
      ciudad: "Villa María",
      producto: "Cómoda y Mesas de Noche",
      calificacion: 5,
      comentario:
        "Hermoso diseño minimalista y súper espacioso. Me encantó la atención y el asesoramiento personalizado que nos dieron.",
    },
  ];

  const scrollMasVendidos = (direccion) => {
    if (masVendidosRef.current) {
      const scrollAmount = direccion === "left" ? -350 : 350;
      masVendidosRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* RECOMENDACIONES */}
      <section
        aria-label="Recomendaciones destacadas"
        className="relative w-full overflow-hidden bg-espresso text-linen"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[580px] lg:min-h-[660px]">
          {heroRecomendados.map((item, idx) => (
            <div
              key={item.id}
              className={`relative group overflow-hidden flex flex-col justify-end p-8 sm:p-12 lg:p-16 border-b md:border-b-0 ${
                idx === 0 ? "md:border-r border-[#3b2b22] dark:border-border/60" : ""
              }`}
            >
              {/* Imagen de fondo */}
              <div className="absolute inset-0">
                <Image
                  src={item.imagen}
                  alt={item.titulo}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a120c]/95 via-[#1a120c]/45 to-transparent" />
              </div>

              {/* Contenido Flotante */}
              <div className="relative z-10 space-y-3 max-w-lg">
                <span className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase text-camel">
                  {item.etiqueta}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-linen leading-tight font-sans">
                  {item.titulo}
                </h2>
                <p className="text-sm sm:text-base text-khaki/90 line-clamp-2 font-normal leading-relaxed">
                  {item.subtitulo}
                </p>
                <div className="pt-2">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-linen border-b-2 border-camel/80 pb-1 hover:border-camel hover:text-camel transition-all group-hover:translate-x-1"
                  >
                    <span>Ver Detalles</span>
                    <span>&gt;</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boton Central */}
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2 z-20 hidden md:block">
          <Link
            href="/catalogo"
            className="px-6 py-2.5 rounded-full bg-linen/95 hover:bg-linen text-espresso text-xs font-bold tracking-widest uppercase backdrop-blur-md border border-khaki/60 shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <span>CATALOGO COMPLETO</span>
            <span>&gt;</span>
          </Link>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section
        aria-label="Categorías por ambiente"
        className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-camel">
              Personaliza Tus Espacios
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-espresso dark:text-linen font-sans">
              Encontrá el diseño ideal para tu espacio.
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-cocoa hover:text-espresso dark:text-camel dark:hover:text-khaki transition-colors"
          >
            <span>Ver todas las categorías</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categorias.map((cat) => (
            <Link
              key={cat.nombre}
              href={cat.href}
              className="group block relative rounded-2xl overflow-hidden bg-linen/70 dark:bg-card border border-khaki/30 dark:border-border/60 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              {/* Imagen local de la categoría */}
              <div className="relative aspect-4/5 w-full overflow-hidden">
                <Image
                  src={cat.imagen}
                  alt={`Muebles para ${cat.nombre}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a120c]/85 via-[#1a120c]/25 to-transparent" />
              </div>

              {/* Metadata de la categoría */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-linen space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-khaki">
                  {cat.cantidad}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-linen group-hover:translate-x-1 transition-transform">
                  {cat.nombre}
                </h3>
                <p className="text-xs text-khaki/90 line-clamp-1 font-normal">
                  {cat.descripcion}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-camel group-hover:text-linen transition-colors">
                  <span>Explorar</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MAS VENDIDOS */}
      <section
        aria-label="Los más vendidos"
        className="w-full py-16 sm:py-24 bg-linen/40 dark:bg-[#140e0b]/50 border-y border-khaki/35 dark:border-border/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Encabezado */}
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-camel block mb-1">
                Destacados
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-espresso dark:text-linen font-sans">
                Los más vendidos.
              </h2>
            </div>

            {/* navegacion */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollMasVendidos("left")}
                type="button"
                aria-label="Mover hacia la izquierda"
                className="w-10 h-10 rounded-full border border-khaki/70 hover:border-espresso dark:border-border dark:hover:border-camel bg-card flex items-center justify-center text-espresso dark:text-linen hover:bg-linen dark:hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollMasVendidos("right")}
                type="button"
                aria-label="Mover hacia la derecha"
                className="w-10 h-10 rounded-full border border-khaki/70 hover:border-espresso dark:border-border dark:hover:border-camel bg-card flex items-center justify-center text-espresso dark:text-linen hover:bg-linen dark:hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Productos Mas Vendidos */}
          <div
            ref={masVendidosRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {cargandoVendidos ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[280px] sm:w-[320px] lg:w-[calc(25%-18px)] shrink-0 snap-start animate-pulse space-y-3 bg-card p-4 rounded-2xl border border-border"
                >
                  <div className="aspect-4/3 w-full bg-linen dark:bg-muted rounded-xl" />
                  <div className="h-4 bg-khaki/30 dark:bg-muted rounded w-3/4" />
                  <div className="h-3 bg-khaki/20 dark:bg-muted rounded w-1/2" />
                  <div className="h-5 bg-khaki/30 dark:bg-muted rounded w-1/3 pt-2" />
                  <div className="h-10 bg-khaki/20 dark:bg-muted rounded-lg w-full mt-2" />
                </div>
              ))
            ) : masVendidos.length === 0 ? (
              <div className="p-8 text-center w-full text-xs text-muted-foreground">
                No hay piezas destacadas disponibles en este momento.
              </div>
            ) : (
              masVendidos.map((prod) => (
                <div
                  key={prod.id}
                  className="w-[280px] sm:w-[320px] lg:w-[calc(25%-18px)] shrink-0 snap-start group flex flex-col"
                >
                  {/* Imagen */}
                  <div className="relative aspect-4/3 w-full bg-linen/85 dark:bg-[#201813] rounded-xl overflow-hidden p-4 flex items-center justify-center transition-all group-hover:bg-khaki/40 dark:group-hover:bg-[#281e18]">
                    <div className="relative w-full h-full">
                      <Image
                        src={prod.imagen}
                        alt={prod.nombre}
                        fill
                        sizes="(max-width: 640px) 280px, 320px"
                        className="object-cover object-center rounded-lg transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Info del Producto */}
                  <div className="pt-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-espresso dark:text-linen group-hover:text-cocoa dark:group-hover:text-camel transition-colors leading-snug">
                          {prod.nombre}
                        </h3>
                        <span className="text-xs text-cocoa/80 dark:text-khaki block mt-0.5">
                          {prod.categoria}
                        </span>
                      </div>

                      {/* Muestras de Color */}
                      <div
                        aria-label="Opciones de acabado disponibles"
                        className="flex items-center gap-1.5 shrink-0 pt-1"
                      >
                        {prod.colores.map((color, idx) => (
                          <span
                            key={idx}
                            style={{ backgroundColor: color }}
                            className="w-3.5 h-3.5 rounded-full border border-black/15 dark:border-white/20 shadow-2xs inline-block"
                            title={`Variante de color ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <div className="font-extrabold text-lg text-espresso dark:text-linen tracking-tight">
                        {prod.precio}
                      </div>
                      <div className="text-[11px] text-cocoa/90 dark:text-khaki font-medium">
                        {prod.cuotas}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={prod.href}
                        className="w-full inline-flex items-center justify-center py-2.5 rounded-lg border border-khaki hover:border-espresso hover:bg-espresso hover:text-linen dark:border-border dark:hover:border-camel dark:hover:bg-camel dark:hover:text-espresso bg-card text-espresso dark:text-linen text-xs font-semibold transition-all min-h-[44px]"
                      >
                        Ver Detalle
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* NUESTRA TIENDA */}
      <section
        aria-label="Nuestra Tienda y Showroom"
        className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Columna Izquierda: Información Editorial */}
          <div className="space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-camel block">
              NUESTRA TIENDA
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-espresso dark:text-linen font-sans leading-tight">
              Vení a vivir la experiencia en Home & Deco.
            </h2>
            <p className="text-base text-cocoa/90 dark:text-khaki leading-relaxed">
              Un espacio pensado para inspirarte. Senti, apreciá y recibí asesoramiento a medida de nuestros diseñadores.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-camel shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-espresso dark:text-linen">
                    Casa Central Río Cuarto
                  </strong>
                  <span className="text-cocoa/90 dark:text-khaki">
                    W Tejerina Norte 783, Río Cuarto, Córdoba, Argentina.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 text-camel shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-espresso dark:text-linen">
                    Horarios de Atención
                  </strong>
                  <span className="text-cocoa/90 dark:text-khaki">
                    Lunes a Sábados: 9:00 a 13:00 hs | 16:30 a 20:30 hs.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Phone className="w-5 h-5 text-camel shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-espresso dark:text-linen">
                    Asesoramiento Directo
                  </strong>
                  <span className="text-cocoa/90 dark:text-khaki">
                    (+54 9 11) 6668-1012
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="https://wa.me/5491166681012?text=Hola!%20Quisiera%20asesoramiento%20sobre%20los%20muebles%20de%20Home%20%26%20Deco"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso text-sm font-semibold tracking-wide uppercase shadow-md transition-all min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4 text-camel dark:text-espresso" />
                <span>Contactanos por WhatsApp</span>
              </a>

              <Link
                href="/sucursales"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-khaki hover:border-espresso text-espresso dark:border-border dark:hover:border-camel dark:text-linen text-sm font-semibold tracking-wide uppercase transition-all min-h-[48px]"
              >
                <span>Cómo Llegar</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Foto del Showroom */}
          <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden shadow-2xl bg-linen dark:bg-card border border-khaki/30 dark:border-border/60">
            <Image
              src="/images/showroom.jpg"
              alt="Showroom de Home & Deco en Río Cuarto"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-espresso/10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* RESEÑAS DE CLIENTES */}
      <section
        aria-label="Opiniones de clientes"
        className="w-full py-16 sm:py-24 bg-linen/30 dark:bg-[#140e0b]/40 border-t border-khaki/35 dark:border-border/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-camel">
              Experiencias
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-espresso dark:text-linen font-sans">
              Que dicen aquellos quienes ya nos eligieron.
            </h2>
            <p className="text-sm text-cocoa/90 dark:text-khaki">
              Más de 1.200 hogares equipados en todo el país con nuestros diseños.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {resenas.map((r, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-card border border-khaki/40 dark:border-border shadow-xs flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* 5 Estrellas */}
                  <div
                    aria-label={`Calificación: ${r.calificacion} de 5 estrellas`}
                    className="flex items-center gap-1 text-camel"
                  >
                    {[...Array(r.calificacion)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-camel text-camel" />
                    ))}
                  </div>

                  <p className="text-sm text-espresso/90 dark:text-linen/90 leading-relaxed italic">
                    &ldquo;{r.comentario}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-khaki/20 dark:border-border flex items-center justify-between text-xs">
                  <div>
                    <strong className="block text-espresso dark:text-linen font-semibold">
                      {r.nombre}
                    </strong>
                    <span className="text-cocoa/80 dark:text-khaki">
                      {r.ciudad}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-cocoa dark:text-camel bg-linen dark:bg-muted px-2.5 py-1 rounded-full border border-khaki/30 dark:border-border">
                    {r.producto}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLOTANTE DE WPP */}
      <aside aria-label="Contacto rápido por WhatsApp" className="fixed bottom-20 lg:bottom-8 right-6 z-40">
        <a
          href="https://wa.me/5491166681012?text=Hola!%20Quisiera%20hacer%20una%20consulta%20sobre%20Home%20%26%20Deco"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp al +54 9 11 6668-1012"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </a>
      </aside>
    </div>
  );
}