import Link from "next/link";
import Image from "next/image";
import {
  Armchair,
  Plus,
  Pencil,
  ExternalLink,
  AlertCircle,
  Archive,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Gestión de Muebles | Dashboard Home & Deco",
  description: "Administración del catálogo, precios, stock y muebles en venta.",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

async function obtenerMuebles() {
  try {
    const res = await fetch(`${API_BASE_URL}/productos/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        muebles: [],
        error: `El servidor devolvió un error (${res.status}) al intentar obtener el listado.`,
      };
    }

    const data = await res.json();
    const lista = Array.isArray(data) ? data : data.results || [];
    return { muebles: lista, error: null };
  } catch {
    return {
      muebles: [],
      error: "No fue posible conectar con el servidor para obtener los muebles.",
    };
  }
}

export default async function DashboardMueblesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const vistaActual = resolvedSearchParams?.vista || "activos";

  const { muebles, error } = await obtenerMuebles();

  // Separar en activos e inactivos
  const mueblesActivos = muebles.filter(
    (m) => m.disponible !== false && m.activo !== false
  );
  const mueblesInactivos = muebles.filter(
    (m) => m.disponible === false || m.activo === false
  );

  const listaAMostrar = vistaActual === "inactivos" ? mueblesInactivos : mueblesActivos;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Inventario
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/muebles/editar/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-xs tracking-wider uppercase transition-all shadow-xs min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </Link>
        </div>
      </div>

      {/* Selector de Vistas / Pestañas: Activos vs Inactivos */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Link
          href="/dashboard/muebles?vista=activos"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
            vistaActual !== "inactivos"
              ? "bg-espresso text-linen dark:bg-camel dark:text-espresso shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Muebles Activos ({mueblesActivos.length})</span>
        </Link>

        <Link
          href="/dashboard/muebles?vista=inactivos"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
            vistaActual === "inactivos"
              ? "bg-espresso text-linen dark:bg-camel dark:text-espresso shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Muebles Inactivos ({mueblesInactivos.length})</span>
        </Link>
      </div>

      {/* Manejo de Error o Datos No Disponibles */}
      {error ? (
        <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-base text-espresso dark:text-linen">
            Información de muebles no disponible
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            {error}
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/muebles"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linen dark:bg-muted border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Reintentar conexión
            </Link>
          </div>
        </div>
      ) : listaAMostrar.length === 0 ? (
        <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
            {vistaActual === "inactivos" ? (
              <Archive className="w-6 h-6" />
            ) : (
              <Armchair className="w-6 h-6" />
            )}
          </div>
          <h2 className="font-bold text-base text-espresso dark:text-linen">
            {vistaActual === "inactivos"
              ? "No hay muebles inactivos"
              : "No hay muebles activos disponibles"}
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {vistaActual === "inactivos"
              ? "Todos los muebles del catálogo se encuentran actualmente activos en la tienda."
              : "Actualmente no hay muebles registrados o disponibles en el inventario comercial."}
          </p>
        </div>
      ) : (
        /* Tabla sin columna de Estado */
        <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-linen/60 dark:bg-muted/40 border-b border-border text-espresso dark:text-linen font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Pieza / Producto</th>
                  <th className="py-3.5 px-4">Ambiente</th>
                  <th className="py-3.5 px-4 text-right">Precio Contado</th>
                  <th className="py-3.5 px-4 text-center">Stock</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {listaAMostrar.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Foto y Nombre */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-linen dark:bg-espresso/30 border border-border shrink-0">
                          {m.imagen ? (
                            <Image
                              src={m.imagen}
                              alt={m.nombre}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              🪑
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-espresso dark:text-linen block group-hover:text-camel transition-colors">
                            {m.nombre}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            ID: #{m.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-linen dark:bg-muted border border-border text-[11px] font-semibold text-cocoa dark:text-khaki">
                        {m.categoria_nombre || m.categoria}
                      </span>
                    </td>

                    {/* Precio */}
                    <td className="py-3 px-4 text-right font-extrabold text-espresso dark:text-linen font-mono">
                      ${Number(m.precio || 0).toLocaleString("es-AR")}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 text-center font-semibold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono ${
                          (m.stock || 0) > 5
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {m.stock ?? 0} u.
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/catalogo/${m.id}`}
                          target="_blank"
                          title="Ver en la tienda"
                          className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-espresso dark:hover:text-linen transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/dashboard/muebles/editar/${m.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linen dark:bg-muted text-espresso dark:text-linen hover:bg-espresso hover:text-linen dark:hover:bg-camel dark:hover:text-espresso font-semibold text-xs tracking-wider transition-colors min-h-[36px]"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
