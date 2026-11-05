import Link from "next/link";
import {
  ArrowLeft,
  Save,
  AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "Editar Mueble | Dashboard Home & Deco",
  description: "Formulario de edición y actualización de productos.",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

async function obtenerDatosMueble(id) {
  if (id === "nuevo") {
    return {
      mueble: {
        nombre: "",
        categoria: "Living",
        precio: "",
        stock: 0,
        descripcion: "",
        material: "",
        dimensiones: "",
        imagen: null,
      },
      esNuevo: true,
      error: null,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/productos/${id}/`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return { mueble: data, esNuevo: false, error: null };
    }

    return {
      mueble: null,
      esNuevo: false,
      error: `No fue posible encontrar el mueble (${res.status}).`,
    };
  } catch {
    return {
      mueble: null,
      esNuevo: false,
      error: "No se pudo conectar con el servidor remoto para cargar los datos del mueble.",
    };
  }
}

export default async function EditarMueblePage({ params }) {
  const { id } = await params;
  const { mueble, esNuevo, error } = await obtenerDatosMueble(id);

  if (error || !mueble) {
    return (
      <div className="space-y-6 max-w-2xl py-8">
        <div>
          <Link
            href="/dashboard/muebles"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cocoa dark:text-camel hover:text-espresso dark:hover:text-linen transition-colors min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al listado de muebles</span>
          </Link>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-base text-espresso dark:text-linen">
            Datos del mueble no disponibles
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {error || "El mueble seleccionado no se encuentra disponible para su edición."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Botón Volver con <Link> */}
      <div>
        <Link
          href="/dashboard/muebles"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cocoa dark:text-camel hover:text-espresso dark:hover:text-linen transition-colors min-h-[36px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al listado de muebles</span>
        </Link>
      </div>

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-camel uppercase tracking-wider block">
            {esNuevo ? "Alta de Producto" : `Editar Mueble #${id}`}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            {esNuevo ? "Crear Nueva Pieza" : mueble.nombre}
          </h1>
          <p className="text-xs sm:text-sm text-cocoa/80 dark:text-khaki mt-1">
            Completá los campos técnicos y comerciales para sincronizar con la API.
          </p>
        </div>

        {!esNuevo && (
          <Link
            href={`/catalogo/${id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            <span>Ver en tienda</span>
          </Link>
        )}
      </div>

      {/* Formulario Estructurado */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
        <form className="space-y-6">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen">
              Nombre de la Pieza *
            </label>
            <input
              type="text"
              name="nombre"
              defaultValue={mueble.nombre}
              placeholder="Ej: Sofá Rinconero Paraíso 3 Cuerpos"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-linen/40 dark:bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-camel focus:border-transparent min-h-[44px]"
            />
          </div>

          {/* Grid Categoría, Precio y Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen">
                Ambiente / Categoría *
              </label>
              <select
                name="categoria"
                defaultValue={mueble.categoria || "Living"}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-linen/40 dark:bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-camel min-h-[44px]"
              >
                <option value="Living">Living & Sofás</option>
                <option value="Comedor">Comedor</option>
                <option value="Dormitorio">Dormitorio</option>
                <option value="Oficina">Home Office</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen">
                Precio Contado ($) *
              </label>
              <input
                type="number"
                name="precio"
                defaultValue={mueble.precio}
                placeholder="Ej: 385000"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-linen/40 dark:bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-camel min-h-[44px] font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen">
                Stock Disponible *
              </label>
              <input
                type="number"
                name="stock"
                defaultValue={mueble.stock}
                placeholder="Ej: 8"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-linen/40 dark:bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-camel min-h-[44px] font-mono"
              />
            </div>
          </div>

          {/* Dimensiones y Materiales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen">
                Dimensiones Técnicas
              </label>
              <input
                type="text"
                name="dimensiones"
                defaultValue={mueble.dimensiones}
                placeholder="Ej: 2.20m x 0.95m x 0.85m"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-linen/40 dark:bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-camel min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen">
                Maderas & Materiales
              </label>
              <input
                type="text"
                name="material"
                defaultValue={mueble.material}
                placeholder="Ej: Paraíso macizo estacionado y lino"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-linen/40 dark:bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-camel min-h-[44px]"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen">
              Descripción Comercial
            </label>
            <textarea
              name="descripcion"
              rows={4}
              defaultValue={mueble.descripcion}
              placeholder="Detallá las cualidades de diseño, confort y acabados de la pieza..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-linen/40 dark:bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-camel"
            />
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/dashboard/muebles"
              className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors min-h-[42px] inline-flex items-center justify-center"
            >
              Cancelar
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-xs tracking-wider uppercase transition-all shadow-xs min-h-[42px] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{esNuevo ? "Crear Mueble" : "Guardar Cambios"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
