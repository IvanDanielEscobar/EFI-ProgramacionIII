import Link from "next/link";
import { Search, ArrowUpDown } from "lucide-react";
import { mueblesService, categoriasService } from "@/services/api";
import { ProductCard } from "@/components/ProductCard";
import { Alert } from "@/components/Alert";
import { EmptyState } from "@/components/EmptyState";
import { Buscador } from "@/components/Buscador";

export const metadata = {
  title: "Catálogo de Muebles & Diseño | Home & Deco",
  description:
    "Colección exclusiva de muebles en maderas nobles: sillones, comedores, mesas, sillas y escritorios.",
};

export default async function CatalogoPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const categoriaSeleccionada = resolvedSearchParams?.categoria || "";
  const queryBusqueda = resolvedSearchParams?.search || "";
  const orderingSeleccionado = resolvedSearchParams?.ordering || "-fecha_creacion";
  const paginaActual = Number(resolvedSearchParams?.page) || 1;

  let productos = [];
  let totalCount = 0;
  let hasNext = false;
  let hasPrevious = false;
  let error = null;
  let categoriasLista = [];

  // Peticion a la API 
  try {
    const [mueblesData, categoriasData] = await Promise.all([
      mueblesService.getAll({
        page: paginaActual,
        search: queryBusqueda,
        categoria: categoriaSeleccionada,
        ordering: orderingSeleccionado,
        limit: 12,
      }),
      categoriasService.getAll().catch(() => []),
    ]);

    productos = mueblesData.results || [];
    totalCount = mueblesData.count || productos.length;
    hasNext = Boolean(mueblesData.next);
    hasPrevious = Boolean(mueblesData.previous);
    categoriasLista = categoriasData;
  } catch (err) {
    error = err.message || "No se pudo conectar con el servidor de Home & Deco.";
  }

  // Categorías directamente obtenidas desde la base de datos
  const categoriasFiltro = [
    { id: "todas", label: "Todos", query: "" },
    ...categoriasLista.map((cat) => ({
      id: String(cat.id),
      label: cat.nombre,
      query: cat.nombre,
    })),
  ];

  return (
    <div className="w-full bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado */}
        <header className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-espresso dark:text-linen tracking-tight">
                Catálogo 2026
              </h1>
            </div>
          </div>
        </header>

        {/* Alerta de error si el backend falla */}
        {error && (
          <Alert
            variant="warning"
            title="Aviso del Catálogo"
            action={
              <Link
                href="/catalogo"
                className="text-xs font-bold underline hover:opacity-80"
              >
                Reintentar
              </Link>
            }
          >
            Tuvimos una dificultad al conectar con el inventario de muebles. Por favor, intentá nuevamente en unos instantes.
          </Alert>
        )}

        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
          {/* Buscador y Orden */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="w-full md:max-w-md">
              <Buscador placeholder="Buscar por nombre, madera o color..." />
            </div>

            {/* Ordenamiento por Precio */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Ordenar:
              </span>
              <div className="flex items-center gap-1 bg-muted/60 dark:bg-muted/30 p-1 rounded-xl border border-border">
                <Link
                  href={`/catalogo?${new URLSearchParams({
                    ...(categoriaSeleccionada ? { categoria: categoriaSeleccionada } : {}),
                    ...(queryBusqueda ? { search: queryBusqueda } : {}),
                    ordering: "-fecha_creacion",
                  }).toString()}`}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    orderingSeleccionado === "-fecha_creacion"
                      ? "bg-card text-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Recientes
                </Link>
                <Link
                  href={`/catalogo?${new URLSearchParams({
                    ...(categoriaSeleccionada ? { categoria: categoriaSeleccionada } : {}),
                    ...(queryBusqueda ? { search: queryBusqueda } : {}),
                    ordering: "caracteristicas__precio",
                  }).toString()}`}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    orderingSeleccionado === "caracteristicas__precio"
                      ? "bg-card text-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Menor precio
                </Link>
                <Link
                  href={`/catalogo?${new URLSearchParams({
                    ...(categoriaSeleccionada ? { categoria: categoriaSeleccionada } : {}),
                    ...(queryBusqueda ? { search: queryBusqueda } : {}),
                    ordering: "-caracteristicas__precio",
                  }).toString()}`}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    orderingSeleccionado === "-caracteristicas__precio"
                      ? "bg-card text-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Mayor precio
                </Link>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* Filtros por Categoría */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Filtrar por Categoria:
            </span>
            <nav
              aria-label="Filtro por ambiente"
              className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
            >
              {categoriasFiltro.map((cat) => {
                const isActive =
                  (!categoriaSeleccionada && cat.query === "") ||
                  (categoriaSeleccionada &&
                    cat.query.toLowerCase() === categoriaSeleccionada.toLowerCase());

                const params = new URLSearchParams();
                if (cat.query) params.set("categoria", cat.query);
                if (queryBusqueda) params.set("search", queryBusqueda);
                if (orderingSeleccionado && orderingSeleccionado !== "-fecha_creacion") {
                  params.set("ordering", orderingSeleccionado);
                }

                const queryString = params.toString();
                const href = queryString ? `/catalogo?${queryString}` : "/catalogo";

                return (
                  <Link
                    key={cat.id}
                    href={href}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all min-h-[40px] flex items-center justify-center ${
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

        {/* Indicador de filtro de búsqueda */}
        {queryBusqueda && (
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between text-xs sm:text-sm text-foreground shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-camel shrink-0" />
              <span>
                Resultados para:{" "}
                <strong className="text-espresso dark:text-linen font-bold">
                  &quot;{queryBusqueda}&quot;
                </strong>
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
              Limpiar búsqueda ✕
            </Link>
          </div>
        )}

        {/* Grilla de Muebles o Estado Vacío */}
        {!error && productos.length === 0 ? (
          <EmptyState
            title="No encontramos muebles disponibles con este criterio"
            description="Probá seleccionando otra categoría o limpiando la barra de búsqueda para ver más piezas."
            action={
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso text-linen dark:bg-camel dark:text-espresso text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-cocoa shadow-2xs"
              >
                Ver todos los productos
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((prod) => (
              <ProductCard key={prod.id} mueble={prod} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {(hasNext || hasPrevious) && (
          <div className="pt-8 flex items-center justify-center gap-4">
            {hasPrevious ? (
              <Link
                href={`/catalogo?${new URLSearchParams({
                  ...(categoriaSeleccionada ? { categoria: categoriaSeleccionada } : {}),
                  ...(queryBusqueda ? { search: queryBusqueda } : {}),
                  ...(orderingSeleccionado ? { ordering: orderingSeleccionado } : {}),
                  page: String(paginaActual - 1),
                }).toString()}`}
                className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors min-h-[40px] flex items-center"
              >
                ← Anterior
              </Link>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-muted/40 text-xs text-muted-foreground border border-transparent cursor-not-allowed">
                ← Anterior
              </span>
            )}

            <span className="text-xs font-medium text-muted-foreground">
              Página {paginaActual}
            </span>

            {hasNext ? (
              <Link
                href={`/catalogo?${new URLSearchParams({
                  ...(categoriaSeleccionada ? { categoria: categoriaSeleccionada } : {}),
                  ...(queryBusqueda ? { search: queryBusqueda } : {}),
                  ...(orderingSeleccionado ? { ordering: orderingSeleccionado } : {}),
                  page: String(paginaActual + 1),
                }).toString()}`}
                className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors min-h-[40px] flex items-center"
              >
                Siguiente →
              </Link>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-muted/40 text-xs text-muted-foreground border border-transparent cursor-not-allowed">
                Siguiente →
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
