import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Layers, ArrowRight, Grid, AlertCircle } from "lucide-react";
import { categoriasService, mueblesService } from "@/services/api";
import { Alert } from "@/components/Alert";

export const metadata = {
  title: "Categorías | Home & Deco",
  description:
    "Explora nuestras colecciones y categorías de muebles en maderas nobles y diseño exclusivo.",
};

export default async function CategoriasPage() {
  let categorias = [];
  let muebles = [];
  let error = null;

  try {
    const [categoriasData, mueblesData] = await Promise.all([
      categoriasService.getAll(),
      mueblesService.getAll({ limit: 100 }), // Traemos una muestra amplia para mapear contadores e imágenes
    ]);

    // Django REST Framework puede retornar un array directo o paginado con .results
    categorias = Array.isArray(categoriasData)
      ? categoriasData
      : categoriasData?.results || [];

    muebles = Array.isArray(mueblesData)
      ? mueblesData
      : mueblesData?.results || [];
  } catch (err) {
    error =
      err.message || "No se pudieron obtener las categorías del servidor.";
  }

  // Agrupamos la cantidad de productos e imagen representativa por categoría
  const categoriasConDetalle = categorias.map((cat) => {
    const productosDeCat = muebles.filter((m) => {
      const catNombre =
        typeof m.categoria === "object" ? m.categoria?.nombre : m.categoria;
      const catId = typeof m.categoria === "object" ? m.categoria?.id : null;

      return (
        catNombre?.toLowerCase() === cat.nombre?.toLowerCase() ||
        catId === cat.id
      );
    });

    // Buscamos la primera imagen disponible en los muebles de la categoría
    const imagenRepresentativa =
      productosDeCat.find((m) => m.imagen)?.imagen || null;

    return {
      ...cat,
      totalProductos: productosDeCat.length,
      imagen: imagenRepresentativa,
    };
  });

  return (
    <div className="w-full bg-background min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Ruta de navegación"
          className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap"
        >
          <Link
            href="/"
            className="hover:text-espresso dark:hover:text-linen transition-colors"
          >
            Inicio
          </Link>
          <span>/</span>
          <Link
            href="/catalogo"
            className="hover:text-espresso dark:hover:text-linen transition-colors"
          >
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-espresso dark:text-linen font-semibold">
            Categorías
          </span>
        </nav>

        {/* Encabezado */}
        <header className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-camel mb-1">
                Explora por Espacio
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-espresso dark:text-linen tracking-tight">
                Categorías de Muebles
              </h1>
            </div>

            <div>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-cocoa dark:text-camel hover:text-espresso dark:hover:text-linen transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ver catálogo completo</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Alerta de error si falla la API */}
        {error && (
          <Alert
            variant="warning"
            title="Aviso del Servidor"
            action={
              <Link
                href="/catalogo/categorias"
                className="text-xs font-bold underline hover:opacity-80"
              >
                Reintentar
              </Link>
            }
          >
            {error} (Compruebe que el backend esté en ejecución).
          </Alert>
        )}

        {/* Listado / Grid de Categorías */}
        {!error && categoriasConDetalle.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-3xl space-y-4">
            <AlertCircle className="w-10 h-10 mx-auto text-camel" />
            <h3 className="text-lg font-bold text-espresso dark:text-linen">
              No hay categorías disponibles
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Actualmente no encontramos categorías registradas en el catálogo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriasConDetalle.map((cat) => (
              <div
                key={cat.id}
                className="group relative bg-card border border-border rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual / Imagen Representativa */}
                <div className="relative aspect-16/9 w-full bg-linen dark:bg-muted/40 overflow-hidden border-b border-border">
                  {cat.imagen ? (
                    <Image
                      src={cat.imagen}
                      alt={cat.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground p-4">
                      <Layers className="w-8 h-8 text-camel/60" />
                      <span className="text-xs font-medium">
                        Colección Home & Deco
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-espresso/80 backdrop-blur-md text-linen text-[10px] font-bold px-3 py-1 rounded-full border border-linen/20">
                    {cat.totalProductos}{" "}
                    {cat.totalProductos === 1 ? "mueble" : "muebles"}
                  </div>
                </div>

                {/* Info de la Categoría */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-espresso dark:text-linen group-hover:text-camel transition-colors">
                      {cat.nombre}
                    </h2>
                    {cat.descripcion && (
                      <p className="text-xs text-cocoa/80 dark:text-khaki leading-relaxed line-clamp-2">
                        {cat.descripcion}
                      </p>
                    )}
                  </div>

                  {/* Acciones de filtrado */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-border">
                    <Link
                      href={`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-espresso dark:text-camel hover:underline"
                    >
                      <span>Filtrar productos</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href={`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`}
                      className="p-2 rounded-xl bg-linen dark:bg-muted text-espresso dark:text-linen hover:bg-espresso hover:text-linen dark:hover:bg-camel dark:hover:text-espresso transition-colors"
                      title={`Ver todos en ${cat.nombre}`}
                    >
                      <Grid className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}