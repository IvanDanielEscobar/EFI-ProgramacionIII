import Link from "next/link";
import Image from "next/image";
import { Search, Filter, ArrowRight, Sparkles, Check, Armchair } from "lucide-react";

export const metadata = {
  title: "Catálogo de Muebles & Diseño | Home & Deco",
  description:
    "Explorá nuestra colección completa de muebles en maderas nobles: sillones, comedores, mesas, sillas y escritorios.",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

const PRODUCTOS_DEFAULT = [
  {
    id: 1,
    nombre: "Sofá Extensible 3c Beyond",
    categoria: "Living",
    categoria_nombre: "Living & Sala",
    descripcion:
      "Tapizado en lino natural antimanchas con estructura maciza de paraíso estacionado.",
    precio: 385000,
    cuotas: "6 cuotas fijas de $ 64.166",
    stock: 8,
    destacado: true,
    imagen: "/images/prod-sofa.jpg",
  },
  {
    id: 2,
    nombre: "Silla Vivire S01 Paraíso",
    categoria: "Comedor",
    categoria_nombre: "Comedores",
    descripcion:
      "Diseño ergonómico nórdico, respaldo curvo al vapor y asiento tapizado en bouclé.",
    precio: 78000,
    cuotas: "6 cuotas fijas de $ 13.000",
    stock: 24,
    destacado: true,
    imagen: "/images/prod-silla.jpg",
  },
  {
    id: 3,
    nombre: "Mesa Comedor Extensible C01",
    categoria: "Comedor",
    categoria_nombre: "Comedores",
    descripcion:
      "Mesa extensible de 1.60m a 2.10m en madera maciza de petiribí con hidrolaca poliuretánica mate.",
    precio: 460000,
    cuotas: "6 cuotas fijas de $ 76.666",
    stock: 5,
    destacado: true,
    imagen: "/images/prod-mesa.jpg",
  },
  {
    id: 4,
    nombre: "Escritorio Elevable Altura Pro",
    categoria: "Oficina",
    categoria_nombre: "Home Office",
    descripcion:
      "Tapa de madera maciza con pasacables integrado y base de acero con terminación epoxi microtexturada.",
    precio: 295000,
    cuotas: "6 cuotas fijas de $ 49.166",
    stock: 11,
    destacado: true,
    imagen: "/images/prod-escritorio.jpg",
  },
  {
    id: 5,
    nombre: "Rinconero Olala XXL",
    categoria: "Living",
    categoria_nombre: "Living & Sala",
    descripcion:
      "Módulo rinconero reversible con almohadones vellón siliconado soft y vivos reforzados.",
    precio: 520000,
    cuotas: "6 cuotas fijas de $ 86.666",
    stock: 4,
    destacado: false,
    imagen: "/images/hero-sofa.jpg",
  },
  {
    id: 6,
    nombre: "Rinconero Lounge Petiribí",
    categoria: "Living",
    categoria_nombre: "Living & Sala",
    descripcion:
      "Líneas puras, respaldos envolventes y mesas auxiliares integradas con veta viva expuesta.",
    precio: 610000,
    cuotas: "6 cuotas fijas de $ 101.666",
    stock: 3,
    destacado: false,
    imagen: "/images/hero-lounge.jpg",
  },
  {
    id: 7,
    nombre: "Respaldo Cama Nube Entelado",
    categoria: "Dormitorio",
    categoria_nombre: "Dormitorio",
    descripcion:
      "Acolchado premium con capitoné sutil en pana antimanchas con tratamiento hidrorepelente.",
    precio: 165000,
    cuotas: "6 cuotas fijas de $ 27.500",
    stock: 14,
    destacado: false,
    imagen: "/images/cat-dormitorio.jpg",
  },
  {
    id: 8,
    nombre: "Biblioteca Modular Nórdica",
    categoria: "Oficina",
    categoria_nombre: "Home Office",
    descripcion:
      "Estructura abierta de 5 estantes regulables fabricada en paraíso y frentes laqueados blancos.",
    precio: 240000,
    cuotas: "6 cuotas fijas de $ 40.000",
    stock: 6,
    destacado: false,
    imagen: "/images/cat-oficina.jpg",
  },
];

const CATEGORIAS_FILTRO = [
  { id: "todas", label: "Todos", query: "" },
  { id: "Living", label: "Living & Sofás", query: "Living" },
  { id: "Comedor", label: "Comedor", query: "Comedor" },
  { id: "Dormitorio", label: "Dormitorio", query: "Dormitorio" },
  { id: "Oficina", label: "Home Office", query: "Oficina" },
];

async function obtenerProductos(categoriaFiltro, busqueda) {
  try {
    const res = await fetch(`${API_BASE_URL}/productos/`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      const listaApi = Array.isArray(data) ? data : data.results || [];
      if (listaApi.length > 0) {
        return listaApi.filter((item) => {
          const matchCat = categoriaFiltro
            ? (item.categoria_nombre || item.categoria || "")
                .toLowerCase()
                .includes(categoriaFiltro.toLowerCase())
            : true;
          const matchSearch = busqueda
            ? (item.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
            : true;
          return matchCat && matchSearch;
        });
      }
    }
  } catch {
    // Si la API remota está hibernando en Render o no responde, usamos datos de catálogo
  }

  return PRODUCTOS_DEFAULT.filter((item) => {
    const matchCat = categoriaFiltro
      ? item.categoria.toLowerCase() === categoriaFiltro.toLowerCase() ||
        item.categoria_nombre.toLowerCase().includes(categoriaFiltro.toLowerCase())
      : true;
    const matchSearch = busqueda
      ? item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      : true;
    return matchCat && matchSearch;
  });
}

export default async function CatalogoPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const categoriaSeleccionada = resolvedSearchParams?.categoria || "";
  const queryBusqueda = resolvedSearchParams?.search || "";

  const productos = await obtenerProductos(
    categoriaSeleccionada,
    queryBusqueda
  );

  return (
    <div className="w-full bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado */}
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-camel">
            <Armchair className="w-4 h-4" />
            <span>Mueblería de Autor</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-espresso dark:text-linen tracking-tight">
                Catálogo de Muebles & Decoración
              </h1>
              <p className="mt-2 text-sm text-cocoa/80 dark:text-khaki max-w-2xl">
                Diseños contemporáneos construidos artesanalmente con maderas
                nobles argentinas seleccionadas: Paraíso, Petiribí y Pino
                Macizo.
              </p>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-full w-fit">
              {productos.length} {productos.length === 1 ? "pieza disponible" : "piezas disponibles"}
            </span>
          </div>
        </header>

        {/* Barra de Filtros y Categorías con <Link> */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Píldoras de Categorías vinculadas con Next.js Link */}
            <nav aria-label="Filtro por ambiente" className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIAS_FILTRO.map((cat) => {
                const isActive =
                  (!categoriaSeleccionada && cat.query === "") ||
                  (categoriaSeleccionada &&
                    cat.query.toLowerCase() ===
                      categoriaSeleccionada.toLowerCase());

                const href = cat.query
                  ? `/catalogo?categoria=${encodeURIComponent(cat.query)}`
                  : "/catalogo";

                return (
                  <Link
                    key={cat.id}
                    href={href}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all min-h-[40px] flex items-center justify-center ${
                      isActive
                        ? "bg-espresso text-linen dark:bg-camel dark:text-espresso shadow-xs"
                        : "text-cocoa/90 dark:text-khaki hover:text-espresso dark:hover:text-linen hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </nav>

            {/* Aviso de búsqueda activa */}
            {queryBusqueda && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Filtrando por: &quot;{queryBusqueda}&quot;</span>
                <Link
                  href={categoriaSeleccionada ? `/catalogo?categoria=${categoriaSeleccionada}` : "/catalogo"}
                  className="text-camel font-semibold hover:underline"
                >
                  Limpiar
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Grilla de Productos */}
        {productos.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-card border border-border space-y-4">
            <div className="w-16 h-16 rounded-full bg-camel/15 mx-auto flex items-center justify-center text-camel">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-espresso dark:text-linen">
              No encontramos muebles con ese criterio
            </h2>
            <p className="text-sm text-cocoa/80 dark:text-khaki max-w-md mx-auto">
              Probá seleccionando otra categoría o navegá la colección completa
              para encontrar lo que buscás.
            </p>
            <div className="pt-2">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso text-linen dark:bg-camel dark:text-espresso text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-cocoa"
              >
                Ver todos los productos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((prod) => (
              <article
                key={prod.id}
                className="group rounded-2xl bg-card border border-border overflow-hidden flex flex-col shadow-2xs hover:shadow-md transition-all duration-300 hover:border-camel/60"
              >
                {/* Imagen del Mueble */}
                <Link
                  href={`/catalogo/${prod.id}`}
                  className="relative aspect-4/3 overflow-hidden bg-linen dark:bg-espresso/20 block"
                >
                  {prod.imagen ? (
                    <Image
                      src={prod.imagen}
                      alt={prod.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      🪑
                    </div>
                  )}

                  {/* Badge de Categoría */}
                  <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-md border border-border/80 text-[10px] font-bold uppercase tracking-wider text-espresso dark:text-linen px-2.5 py-1 rounded-md">
                    {prod.categoria_nombre || prod.categoria}
                  </span>

                  {prod.destacado && (
                    <span className="absolute top-3 right-3 bg-camel text-espresso text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Destacado</span>
                    </span>
                  )}
                </Link>

                {/* Info del Producto */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <Link
                      href={`/catalogo/${prod.id}`}
                      className="block group-hover:text-cocoa dark:group-hover:text-camel transition-colors"
                    >
                      <h3 className="font-bold text-base text-espresso dark:text-linen tracking-tight line-clamp-1">
                        {prod.nombre}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {prod.descripcion}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground block font-mono">
                        Precio de contado
                      </span>
                      <span className="text-xl font-extrabold text-espresso dark:text-linen tracking-tight block">
                        ${Number(prod.precio || 0).toLocaleString("es-AR")}
                      </span>
                      {prod.cuotas && (
                        <span className="text-[11px] font-semibold text-camel block mt-0.5">
                          {prod.cuotas}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/catalogo/${prod.id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-linen dark:bg-muted text-espresso dark:text-linen hover:bg-espresso hover:text-linen dark:hover:bg-camel dark:hover:text-espresso font-semibold text-xs tracking-wider uppercase transition-all min-h-[40px]"
                    >
                      <span>Ver Detalles</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
