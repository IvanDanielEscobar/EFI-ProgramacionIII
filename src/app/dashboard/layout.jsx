"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  LayoutDashboard,
  Armchair,
  ShoppingBag,
  Store,
  ArrowLeft,
  ShieldAlert,
  LogOut,
  LogIn,
  Sun,
  Moon,
} from "lucide-react";

const emptySubscribe = () => () => {};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const esEmpleadoOAdmin =
    Boolean(user?.es_empleado) ||
    user?.rol === "ADMIN" ||
    user?.rol === "EMPLEADO";

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, isLoading, isAuthenticated, pathname, router]);

  const menuItems = [
    { nombre: "Resumen", href: "/dashboard", icono: LayoutDashboard },
    { nombre: "Muebles", href: "/dashboard/muebles", icono: Armchair },
    { nombre: "Pedidos", href: "/dashboard/pedidos", icono: ShoppingBag },
    { nombre: "Sucursales", href: "/dashboard/sucursales", icono: Store },
  ];

  // Durante la carga o antes del montaje inicial, renderizar estado de carga para garantizar paridad SSR/Cliente
  if (!mounted || isLoading) {
    return (
      <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4 bg-background">
        <div className="w-10 h-10 border-3 border-camel border-t-transparent rounded-full animate-spin" />
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Verificando credenciales de acceso...
        </p>
      </div>
    );
  }

  // Usuario NO Autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex-1 min-h-[75vh] flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full p-8 rounded-3xl bg-card border border-border text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Autenticación Requerida
            </span>
            <h2 className="text-xl font-bold text-espresso dark:text-linen">
              Acceso Restringido
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Para acceder al panel administrativo de Home & Deco debés iniciar sesión.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-xs tracking-wider uppercase transition-all shadow-xs min-h-[42px]"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors min-h-[42px]"
            >
              <span>Ir a la Tienda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Usuario Autenticado pero SIN Permisos
  if (!esEmpleadoOAdmin) {
    return (
      <div className="flex-1 min-h-[75vh] flex items-center justify-center p-4 bg-background">
        <div className="max-w-lg w-full p-8 rounded-3xl bg-card border border-border text-center space-y-4 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
              Código 403 • Prohibido
            </span>
            <h2 className="text-xl font-bold text-espresso dark:text-linen">
              Área Exclusiva para Personal
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Iniciaste sesión como <strong className="text-espresso dark:text-linen">{user?.username}</strong> con perfil de <strong className="text-espresso dark:text-linen">{user?.rol || "CLIENTE"}</strong>. Las herramientas de inventario, stock y gestión operativa están reservadas exclusivamente para empleados y administradores.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-xs tracking-wider uppercase transition-all shadow-xs min-h-[42px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Tienda</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition-colors min-h-[42px] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Usuario AUTORIZADO 
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-camel block">
                Panel Interno
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-espresso dark:text-linen tracking-tight">
                Dashboard
              </h2>
            </div>

            {/* Acciones superiores en mobile: Tema e ir a Tienda */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {theme === "dark" ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-cocoa" />
                )}
              </button>
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-semibold text-cocoa dark:text-khaki hover:text-espresso dark:hover:text-linen px-2.5 py-1.5 rounded-lg border border-border"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Tienda</span>
              </Link>
            </div>
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

        {/* Ficha de Usuario en Desktop */}
        <div className="hidden md:block pt-6 border-t border-border mt-6 space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/60 dark:bg-muted border border-border">
            <div className="w-8 h-8 rounded-full bg-camel/20 text-cocoa dark:text-camel flex items-center justify-center font-bold text-xs uppercase">
              {user?.username?.[0] || "U"}
            </div>
            <div className="text-xs truncate flex-1">
              <span className="block font-semibold text-espresso dark:text-linen truncate">
                {user?.username}
              </span>
              <span className="block text-[10px] text-muted-foreground uppercase font-mono">
                Rol: {user?.rol || "Empleado"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 px-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-cocoa dark:text-khaki hover:text-espresso dark:hover:text-linen transition-colors min-h-[36px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tienda</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {theme === "dark" ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-cocoa" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                title="Cerrar sesión"
                className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido Dinámico */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
