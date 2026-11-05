import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Sparkles, Armchair, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Catálogo de Muebles & Diseño | Home & Deco",
  description:
    "Explorá nuestra colección completa de muebles en maderas nobles: sillones, comedores, mesas, sillas y escritorios.",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

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

    if (!res.ok) {
      return {
        productos: [],
        error: `El servidor respondió con código ${res.status}. No fue posible recuperar los productos.`,
      };
    }

    const data = await res.json();
    const listaApi = Array.isArray(data) ? data : data.results || [];

    const filtrados = listaApi.filter((item) => {
      const matchCat = categoriaFiltro
        ? (item.categoria_nombre || item.categoria || "")
            .toLowerCase()
            .includes(categoriaFiltro.toLowerCase())
        : true;
      const matchSearch = busqueda
        ? (item.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
          (item.descripcion || "").toLowerCase().includes(busqueda.toLowerCase())
        : true;
      return matchCat && matchSearch;
    });

    return { productos: filtrados, error: null };
  } catch {
    return {
      productos: [],
      error: "La API no responde en este momento. Por favor intentá nuevamente más tarde.",
    };
  }
}

export default async function CatalogoPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const categoriaSeleccionada = resolvedSearchParams?.categoria || "";
  const queryBusqueda = resolvedSearchParams?.search || "";

  const { productos, error } = await obtenerProductos(
    categoriaSeleccionada,
    queryBusqueda
  );

  return (
    <div className="w-full bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado */}
        <header className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-espresso dark:text-linen tracking-tight">
                Catálogo
              </h1>
            </div>
            {!error && (
              <span className="text-xs font-medium text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-full w-fit">
                {productos.length} {productos.length === 1 ? "pieza encontrada" : "piezas encontradas"}
              </span>
            )}
          </div>
        </header>

        {/* Alerta simple si la API no responde */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Aviso de conexión:</strong> {error}
              </span>
            </div>
            <Link
              href="/catalogo"
              className="text-xs font-bold underline hover:opacity-80 shrink-0"
            >
              Reintentar
            </Link>
          </div>
        )}

        {/* Aviso visible de búsqueda */}
        {queryBusqueda && (
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between text-xs sm:text-sm text-foreground shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-camel shrink-0" />
              <span>
                Buscando: <strong className="text-espresso dark:text-linen font-bold">&quot;{queryBusqueda}&quot;</strong>
              </span>
            </div>
            <Link
              href={
                categoriaSeleccionada
                  ? `/catalogo?categoria=${encodeURIComponent(categoriaSeleccionada)}`
                  : "/catalogo"
              }
              className="px-3 py-1 rounded-lg bg-linen dark:bg-muted text-xs font-semibold text-cocoa dark:text-khaki hover:text-espresso dark:hover:text-linen transition-colors"
            >
              Quitar filtro de búsqueda ✕
            </Link>
          </div>
        )}

        {/* Barra de Filtros y Categorías */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <nav
              aria-label="Filtro por ambiente"
              className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
            >
              {CATEGORIAS_FILTRO.map((cat) => {
                const isActive =
                  (!categoriaSeleccionada && cat.query === "") ||
                  (categoriaSeleccionada &&
                    cat.query.toLowerCase() ===
                      categoriaSeleccionada.toLowerCase());

                const params = new URLSearchParams();
                if (cat.query) params.set("categoria", cat.query);
                if (queryBusqueda) params.set("search", queryBusqueda);

                const queryString = params.toString();
                const href = queryString ? `/catalogo?${queryString}` : "/catalogo";

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
          </div>
        </div>

        {/* Grilla de Productos o Estado Vacío */}
        {!error && productos.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-card border border-border space-y-4">
            <div className="w-16 h-16 rounded-full bg-camel/15 mx-auto flex items-center justify-center text-camel">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-espresso dark:text-linen">
              No encontramos muebles disponibles con este criterio
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
                {/* Imagen */}
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
                    {/* Categoria */}
                    {(prod.categoria_nombre || prod.categoria) && (
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold block">
                        {prod.categoria_nombre || prod.categoria}
                      </span>
                    )}

                    <Link
                      href={`/catalogo/${prod.id}`}
                      className="block group-hover:text-cocoa dark:group-hover:text-camel transition-colors"
                    >
                      <h3 className="font-bold text-base text-espresso dark:text-linen tracking-tight line-clamp-1">
                        {prod.nombre}
                      </h3>
                    </Link>
                    {prod.descripcion && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {prod.descripcion}
                      </p>
                    )}
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
