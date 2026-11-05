"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Armchair,
  ShoppingBag,
  Store,
  ArrowLeft,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { nombre: "Resumen", href: "/dashboard", icono: LayoutDashboard },
    { nombre: "Muebles", href: "/dashboard/muebles", icono: Armchair },
    { nombre: "Pedidos", href: "/dashboard/pedidos", icono: ShoppingBag },
    { nombre: "Sucursales", href: "/dashboard/sucursales", icono: Store },
  ];

  const currentRouteName =
    menuItems.find((m) => m.href === pathname)?.nombre || "Panel";

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside
        aria-label="Menú del panel de administración"
        className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card p-4 sm:p-5 flex flex-col justify-between shrink-0"
      >
        <div className="space-y-4 md:space-y-6">
          {/* Cabecera */}
          <div className="flex items-center justify-between md:block">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-espresso dark:text-linen tracking-tight">
                Dashboard
              </h2>
            </div>

            {/* Link a Tienda en mobile */}
            <Link
              href="/"
              className="md:hidden flex items-center gap-1.5 text-xs font-semibold text-cocoa dark:text-khaki hover:text-espresso dark:hover:text-linen px-2.5 py-1.5 rounded-lg border border-border"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tienda</span>
            </Link>
          </div>

          {/* Menu de Navegación */}
          <nav
            aria-label="Secciones del dashboard"
            className="flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none"
          >
            {menuItems.map((item) => {
              const Icono = item.icono;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors min-h-[44px] shrink-0 md:shrink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel ${
                    active
                      ? "bg-espresso text-linen dark:bg-camel dark:text-espresso shadow-xs"
                      : "text-cocoa/90 dark:text-khaki hover:text-espresso dark:hover:text-linen hover:bg-muted"
                  }`}
                >
                  <Icono className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{item.nombre}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Usuario en Desktop */}
        <div className="hidden md:block pt-6 border-t border-border mt-6 space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/60 dark:bg-muted border border-border">
            <div className="w-8 h-8 rounded-full bg-camel/20 text-cocoa dark:text-camel flex items-center justify-center font-bold text-xs uppercase">
              {user?.username?.[0]}
            </div>
            <div className="text-xs truncate">
              <span className="block font-semibold text-espresso dark:text-linen truncate">
                {user?.username}
              </span>
              <span className="block text-[10px] text-muted-foreground uppercase font-mono">
                Rol: {user?.rol}
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-cocoa dark:text-khaki hover:text-espresso dark:hover:text-linen px-2 py-1 transition-colors min-h-[36px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Volver a la tienda</span>
          </Link>
        </div>
      </aside>

      {/* Dashboard */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}