import Link from "next/link";
import {
  Armchair,
  ShoppingBag,
  Store,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Dashboard | Home & Deco",
  description: "Panel de control y gestión comercial.",
};

export default function DashboardPage() {
  const metricas = [
    {
      titulo: "Catálogo",
      valor: "24",
      icono: Armchair,
      detalle: "Activos en tienda",
      color: "text-camel",
    },
    {
      titulo: "Pedidos Recientes",
      valor: "8",
      icono: ShoppingBag,
      detalle: "Últimas 24 horas",
      color: "text-emerald-500",
    },
    {
      titulo: "Categorías",
      valor: "4",
      icono: Layers,
      detalle: "Ambientes configurados",
      color: "text-indigo-400",
    },
    {
      titulo: "Sucursales",
      valor: "2",
      icono: Store,
      detalle: "Puntos de retiro",
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner Bienvenida */}
      <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-camel uppercase tracking-wider">
            Panel de Control
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Bienvenido al Panel de Home & Deco
          </h1>
        </div>

        <Link
          href="/catalogo"
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-sm transition-all min-h-[44px] shadow-xs"
        >
          <span>Ver Catálogo</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricas.map((m) => {
          const Icono = m.icono;
          return (
            <div
              key={m.titulo}
              className="p-5 rounded-2xl bg-card border border-border shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {m.titulo}
                </span>
                <Icono className={`w-5 h-5 ${m.color}`} />
              </div>
              <div className="text-3xl font-bold text-foreground">{m.valor}</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>{m.detalle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Armchair className="w-5 h-5 text-camel" />
            <span>Muebles </span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Crear, consultar, modificar y aplicar baja a los
            muebles del catálogo.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/muebles"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa dark:text-camel hover:underline"
            >
              <span>Gestor de inventario</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-camel" />
            <span>Pedidos</span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Consulta órdenes de compra.
          </p>
          <div className="pt-2">
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

