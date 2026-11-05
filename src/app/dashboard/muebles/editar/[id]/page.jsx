import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Armchair,
  Upload,
  CheckCircle2,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Editar Mueble | Dashboard Home & Deco",
  description: "Formulario de edición y actualización de productos.",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

const PRODUCTOS_MOCK = {
  "1": {
    nombre: "Sofá Extensible 3c Beyond",
    categoria: "Living",
    precio: 385000,
    stock: 8,
    descripcion:
      "Tapizado en lino natural antimanchas con estructura maciza de paraíso estacionado.",
    material: "Madera maciza de Paraíso y lino natural",
    dimensiones: "2.20m x 0.95m x 0.85m",
    imagen: "/images/prod-sofa.jpg",
  },
  "2": {
    nombre: "Silla Vivire S01 Paraíso",
    categoria: "Comedor",
    precio: 78000,
    stock: 24,
    descripcion:
      "Diseño ergonómico nórdico, respaldo curvo al vapor y asiento tapizado en bouclé.",
    material: "Madera maciza de Paraíso",
    dimensiones: "0.52m x 0.50m x 0.82m",
    imagen: "/images/prod-silla.jpg",
  },
  "3": {
    nombre: "Mesa Comedor Extensible C01",
    categoria: "Comedor",
    precio: 460000,
    stock: 5,
    descripcion:
      "Mesa extensible de 1.60m a 2.10m en madera maciza de petiribí con hidrolaca poliuretánica.",
    material: "Petiribí macizo",
    dimensiones: "1.60m - 2.10m x 0.90m x 0.77m",
    imagen: "/images/prod-mesa.jpg",
  },
  "4": {
    nombre: "Escritorio Elevable Altura Pro",
    categoria: "Oficina",
    precio: 295000,
    stock: 11,
    descripcion:
      "Tapa de madera maciza con pasacables integrado y chasis de acero estructural.",
    material: "Paraíso macizo y acero estructural",
    dimensiones: "1.40m x 0.70m x 0.75m",
    imagen: "/images/prod-escritorio.jpg",
  },
};

async function obtenerDatosMueble(id) {
  if (id === "nuevo") {
    return {
      nombre: "",
      categoria: "Living",
      precio: "",
      stock: 0,
      descripcion: "",
      material: "",
      dimensiones: "",
      imagen: null,
      esNuevo: true,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/productos/${id}/`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return { ...data, esNuevo: false };
    }
  } catch {
    // fallback
  }

  const mock = PRODUCTOS_MOCK[id] || {
    nombre: `Mueble #${id}`,
    categoria: "Living",
    precio: 200000,
    stock: 5,
    descripcion: "Descripción de la pieza.",
    material: "Paraíso macizo",
    dimensiones: "Estándar",
    imagen: "/images/prod-sofa.jpg",
  };

  return { ...mock, esNuevo: false };
}

export default async function EditarMueblePage({ params }) {
  const { id } = await params;
  const mueble = await obtenerDatosMueble(id);
  const esNuevo = mueble.esNuevo;

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
                defaultValue={mueble.categoria}
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
