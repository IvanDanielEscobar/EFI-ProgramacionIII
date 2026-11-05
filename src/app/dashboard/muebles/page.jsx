import Link from "next/link";
import Image from "next/image";
import {
  Armchair,
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";

export const metadata = {
  title: "Gestión de Muebles | Dashboard Home & Deco",
  description: "Administración del catálogo, precios, stock y muebles en venta.",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

const MUEBLES_DEFAULT = [
  {
    id: 1,
    nombre: "Sofá Extensible 3c Beyond",
    categoria: "Living",
    precio: 385000,
    stock: 8,
    disponible: true,
    imagen: "/images/prod-sofa.jpg",
  },
  {
    id: 2,
    nombre: "Silla Vivire S01 Paraíso",
    categoria: "Comedor",
    precio: 78000,
    stock: 24,
    disponible: true,
    imagen: "/images/prod-silla.jpg",
  },
  {
    id: 3,
    nombre: "Mesa Comedor Extensible C01",
    categoria: "Comedor",
    precio: 460000,
    stock: 5,
    disponible: true,
    imagen: "/images/prod-mesa.jpg",
  },
  {
    id: 4,
    nombre: "Escritorio Elevable Altura Pro",
    categoria: "Oficina",
    precio: 295000,
    stock: 11,
    disponible: true,
    imagen: "/images/prod-escritorio.jpg",
  },
  {
    id: 5,
    nombre: "Rinconero Olala XXL",
    categoria: "Living",
    precio: 520000,
    stock: 4,
    disponible: true,
    imagen: "/images/hero-sofa.jpg",
  },
  {
    id: 6,
    nombre: "Rinconero Lounge Petiribí",
    categoria: "Living",
    precio: 610000,
    stock: 3,
    disponible: true,
    imagen: "/images/hero-lounge.jpg",
  },
];

async function obtenerMuebles() {
  try {
    const res = await fetch(`${API_BASE_URL}/productos/`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.results || [];
      if (lista.length > 0) return lista;
    }
  } catch {
    // fallback local
  }
  return MUEBLES_DEFAULT;
}

export default async function DashboardMueblesPage() {
  const muebles = await obtenerMuebles();

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-camel uppercase tracking-wider">
            <Armchair className="w-4 h-4" />
            <span>Inventario de Tienda</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Gestión de Muebles
          </h1>
          <p className="text-xs sm:text-sm text-cocoa/80 dark:text-khaki mt-1">
            Consultá, modificá o agregá nuevas piezas al catálogo comercial.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/muebles/editar/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-xs tracking-wider uppercase transition-all shadow-xs min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Mueble</span>
          </Link>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-linen/60 dark:bg-muted/40 border-b border-border text-espresso dark:text-linen font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Pieza / Producto</th>
                <th className="py-3.5 px-4">Ambiente</th>
                <th className="py-3.5 px-4 text-right">Precio Contado</th>
                <th className="py-3.5 px-4 text-center">Stock</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {muebles.map((m) => (
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

                  {/* Estado */}
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Activo</span>
                    </span>
                  </td>

                  {/* Acciones con Next.js Link */}
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
    </div>
  );
}
