import Link from "next/link";
import {
  Armchair,
  ShoppingBag,
  Store,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Plus,
} from "lucide-react";
import {
  mueblesService,
  categoriasService,
  sucursalesService,
} from "@/services/api";
import { Badge } from "@/components/Badge";
import { Alert } from "@/components/Alert";

export const metadata = {
  title: "Dashboard | Home & Deco",
  description: "Panel de control y gestión comercial.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let totalMuebles = 0;
  let totalCategorias = 0;
  let totalSucursales = 0;
  let masVendidos = [];
  let error = null;

  try {
    const [mueblesData, categoriasData, sucursalesData, destacadosData] =
      await Promise.all([
        mueblesService.getAll({ limit: 1 }),
        categoriasService.getAll(),
        sucursalesService.getAll(),
        mueblesService.getDestacados(4),
      ]);

    totalMuebles = mueblesData.count || 0;
    totalCategorias = categoriasData.length || 0;
    totalSucursales = sucursalesData.length || 0;
    masVendidos = destacadosData || [];
  } catch (err) {
    error = err.message || "No fue posible conectar con el servidor.";
  }

  const metricas = [
    {
      titulo: "Catálogo",
      valor: String(totalMuebles),
      icono: Armchair,
      detalle: "Piezas activas",
      color: "text-camel",
      href: "/dashboard/muebles",
    },
    {
      titulo: "Órdenes Registradas",
      valor: "3",
      icono: ShoppingBag,
      detalle: "Últimas 24 horas",
      color: "text-emerald-500",
      href: "/dashboard/pedidos",
    },
    {
      titulo: "Categorias",
      valor: String(totalCategorias),
      icono: Layers,
      detalle: "Categorías en el sistema",
      color: "text-indigo-400",
      href: "/dashboard/muebles",
    },
    {
      titulo: "Sucursales",
      valor: String(totalSucursales),
      icono: Store,
      detalle: "Puntos de entrega",
      color: "text-amber-500",
      href: "/dashboard/sucursales",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Alerta de Error de Servidor */}
      {error && (
        <Alert
          variant="warning"
          title="Aviso del Servidor"
          action={
            <Link
              href="/dashboard"
              className="text-xs font-bold underline hover:opacity-80"
            >
              Reintentar
            </Link>
          }
        >
          {error}.
        </Alert>
      )}

      {/* Banner Bienvenida */}
      <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-camel uppercase tracking-wider">
            Panel de Control
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Bienvenido al Panel de Home & Deco
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/dashboard/muebles"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-xs tracking-wider uppercase transition-all shadow-xs min-h-[44px]"
          >
            <span>Ver Catálogo</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard/muebles/editar/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Mueble</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
          >
            <span>Ir a la Tienda</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-camel" />
          </Link>
        </div>
      </div>

      {/* Metricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricas.map((m) => {
          const Icono = m.icono;
          return (
            <Link
              key={m.titulo}
              href={m.href}
              className="p-5 rounded-2xl bg-card border border-border hover:border-camel/60 shadow-2xs space-y-3 transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-espresso dark:group-hover:text-linen transition-colors">
                  {m.titulo}
                </span>
                <Icono className={`w-5 h-5 ${m.color}`} />
              </div>
              <div className="text-3xl font-extrabold text-espresso dark:text-linen font-mono">
                {m.valor}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{m.detalle}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Accesos Rápidos sobre metricas */}
      {masVendidos.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-5 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-camel uppercase tracking-wider block">
                Rendimiento Comercial
              </span>
              <h2 className="text-lg font-bold text-espresso dark:text-linen">
                Articulos Más Vendidos
              </h2>
            </div>
            <Link
              href="/dashboard/muebles"
              className="text-xs font-bold text-cocoa dark:text-camel hover:underline flex items-center gap-1"
            >
              <span>Ver todo el catálogo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {masVendidos.map((prod, idx) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-linen/50 dark:bg-muted/30 border border-border space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-camel uppercase tracking-wider">
                      #{idx + 1} en ventas
                    </span>
                    <Badge stock={prod.stock} size="sm" />
                  </div>
                  <h3 className="font-bold text-sm text-espresso dark:text-linen line-clamp-1">
                    {prod.nombre}
                  </h3>
                  <span className="text-xs text-muted-foreground block">
                    {prod.categoria}
                  </span>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-espresso dark:text-linen">
                    ${Number(prod.precio || 0).toLocaleString("es-AR")}
                  </span>
                  {prod.total_vendido > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {prod.total_vendido} vendidos
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accesos Rápidos Operativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-card border border-border space-y-3 shadow-2xs">
          <h3 className="font-bold text-lg text-espresso dark:text-linen flex items-center gap-2">
            <Armchair className="w-5 h-5 text-camel" />
            <span>Muebles </span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Crear, consultar, modificar y dar de baja muebles en el catálogo.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/dashboard/muebles"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa dark:text-camel hover:underline"
            >
              <span>Abrir inventario</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border space-y-3 shadow-2xs">
          <h3 className="font-bold text-lg text-espresso dark:text-linen flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-camel" />
            <span>Órdenes & Pedidos</span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ordenes de compra, estados de despacho y retiros en sucursal.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/dashboard/pedidos"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa dark:text-camel hover:underline"
            >
              <span>Listado de órdenes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

