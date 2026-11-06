"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import {
  Sun,
  Moon,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  Search,
  LayoutDashboard,
  ChevronDown,
  ShoppingBag,
  Phone,
  MapPin,
  Home,
  Grid,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Buscador } from "@/components/Buscador";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const isAuth = mounted && isAuthenticated;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Cerrar menu movil y buscador al navegar
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
  }

  // Escape y scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        setSearchOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const categorias = [
    {
      nombre: "Living",
      href: "/catalogo?categoria=Living",
      destacados: [
        {
          label: "Rinconeros Lounge & XXL",
          href: "/catalogo?categoria=Living&search=Rinconero",
        },
        {
          label: "Sofás Extensibles",
          href: "/catalogo?categoria=Living&search=Extensible",
        },
        {
          label: "Sillón Chesterfield",
          href: "/catalogo?categoria=Living&search=Chesterfield",
        },
        {
          label: "Mesas Ratonas",
          href: "/catalogo?categoria=Living&search=Mesa%20Ratona",
        },
        {
          label: "Racks para TV",
          href: "/catalogo?categoria=Living&search=Rack",
        },
      ],
    },
    {
      nombre: "Comedor",
      href: "/catalogo?categoria=Comedor",
      destacados: [
        {
          label: "Mesas de Comedor",
          href: "/catalogo?categoria=Comedor&search=Mesa",
        },
        {
          label: "Sillas de Diseño",
          href: "/catalogo?categoria=Comedor&search=Silla",
        },
        {
          label: "Barras Desayunadoras",
          href: "/catalogo?categoria=Comedor&search=Barra",
        },
      ],
    },
    {
      nombre: "Dormitorio",
      href: "/catalogo?categoria=Dormitorio",
      destacados: [
        {
          label: "Camas King Size",
          href: "/catalogo?categoria=Dormitorio&search=Cama",
        },
        {
          label: "Mesas de Noche",
          href: "/catalogo?categoria=Dormitorio&search=Noche",
        },
        {
          label: "Cómodas Escandinavas",
          href: "/catalogo?categoria=Dormitorio&search=Escandinava",
        },
      ],
    },
    {
      nombre: "Oficina",
      href: "/catalogo?categoria=Oficina",
      destacados: [
        {
          label: "Escritorios Regulables Pro",
          href: "/catalogo?categoria=Oficina&search=Elevable",
        },
        {
          label: "Escritorios Minimalistas",
          href: "/catalogo?categoria=Oficina&search=Minimalista",
        },
        {
          label: "Bibliotecas Modulares",
          href: "/catalogo?categoria=Oficina&search=Biblioteca",
        },
      ],
    },
    {
      nombre: "Exterior",
      href: "/catalogo?categoria=Exterior",
      destacados: [
        {
          label: "Bancos de Jardín",
          href: "/catalogo?categoria=Exterior&search=Banco",
        },
        {
          label: "Galería & Patio",
          href: "/catalogo?categoria=Exterior",
        },
      ],
    },
    {
      nombre: "Sucursales",
      href: "/sucursales",
    },
    {
      nombre: "Nosotros",
      href: "/nosotros",
    },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Barra de Anuncio Arriba de la navbar principal */}
      <div
        aria-label="Venta telefónica y WhatsApp"
        className="bg-espresso text-linen text-[11px] sm:text-xs font-normal py-2 px-4 text-center tracking-wide border-b border-[#38261e] dark:border-border transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-4 text-[11px]">
          <span className="tracking-wide">
            ESCRIBINOS POR WHATSAPP AL{" "}
            <strong className="font-semibold text-camel hover:underline cursor-pointer">
              (+54 9 11) 6668-1012
            </strong>
          </span>
          <span className="hidden md:inline text-camel opacity-60">•</span>
          <span className="hidden md:inline text-khaki font-light tracking-wider">
            RETIRO EN SHOWROOM RÍO CUARTO
          </span>
        </div>
      </div>

      {/* Navbar Principal */}
      <nav
        aria-label="Navegación principal"
        className="w-full border-b border-border/80 bg-background/95 dark:bg-[#18120e]/95 backdrop-blur-md shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Logo de Home & Deco */}
          <Link
            href="/"
            aria-label="Home & Deco — Inicio"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded-xl p-1 shrink-0"
          >
            <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-linen dark:bg-card p-1 border border-khaki/50 dark:border-border transition-transform group-hover:scale-105 shrink-0 shadow-2xs">
              <Image
                src="/logo-icon.jpg"
                alt="Isotipo Home & Deco"
                fill
                priority
                sizes="44px"
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-wider block leading-none text-espresso dark:text-linen font-sans">
                HOME & DECO
              </span>
              <span className="text-[9px] tracking-[0.28em] uppercase text-cocoa dark:text-camel font-semibold block mt-1">
                Mueblería & Diseño
              </span>
            </div>
          </Link>

          {/* Menu */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {categorias.map((cat) => {
              const active = isActive(cat.href);
              const hasDropdown = Boolean(cat.destacados);

              return (
                <div
                  key={cat.nombre}
                  className="relative group"
                  onMouseEnter={() => hasDropdown && setActiveDropdown(cat.nombre)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={cat.href}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors min-h-[44px] tracking-wide text-xs uppercase font-medium ${
                      active
                        ? "text-espresso dark:text-camel font-bold border-b-2 border-camel"
                        : "text-cocoa/90 dark:text-khaki hover:text-espresso dark:hover:text-linen"
                    }`}
                  >
                    <span>{cat.nombre}</span>
                    {hasDropdown && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>

                  {/* Dropdown Preview al pasar el cursor */}
                  {hasDropdown && activeDropdown === cat.nombre && (
                    <div className="absolute top-full left-0 w-64 p-4 rounded-xl bg-card border border-border shadow-xl space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-camel block mb-2">
                        Colecciones en {cat.nombre}
                      </span>
                      <ul className="space-y-1 text-xs">
                        {cat.destacados.map((item) => {
                          const label = typeof item === "string" ? item : item.label;
                          const href =
                            typeof item === "string"
                              ? `${cat.href}&search=${encodeURIComponent(item)}`
                              : item.href;

                          return (
                            <li key={label}>
                              <Link
                                href={href}
                                className="block px-3 py-2 rounded-lg text-cocoa dark:text-khaki hover:text-espresso dark:hover:text-linen hover:bg-muted transition-colors"
                              >
                                {label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="pt-2 border-t border-border mt-2">
                        <Link
                          href={cat.href}
                          className="text-xs font-semibold text-espresso dark:text-camel hover:underline flex items-center justify-between px-1"
                        >
                          <span>Explorar todo sobre {cat.nombre}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Iconos a la Derecha */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Buscador */}
            {searchOpen ? (
              <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
                <Buscador
                  className="w-48 sm:w-64 md:w-72"
                  placeholder="Buscar muebles..."
                  clearOtherFilters
                  onSearch={() => setSearchOpen(false)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  type="button"
                  aria-label="Cerrar buscador"
                  className="p-2.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                type="button"
                aria-label="Buscar muebles en el catálogo"
                className="p-2.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel shadow-2xs cursor-pointer"
              >
                <Search className="w-4 h-4 text-cocoa dark:text-khaki" aria-hidden="true" />
              </button>
            )}

            {/* Modo Claro / Oscuro */}
            <button
              onClick={toggleTheme}
              type="button"
              suppressHydrationWarning
              aria-label={
                mounted
                  ? `Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`
                  : "Cambiar tema"
              }
              className="p-2.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer shadow-2xs"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-cocoa" aria-hidden="true" />
              )}
            </button>

            {/* Sesion */}
            {isAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  aria-label={`Perfil de ${user?.username}`}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted transition-colors min-h-[44px]"
                >
                  <div className="w-7 h-7 rounded-full bg-camel/20 text-cocoa dark:text-camel flex items-center justify-center font-bold text-xs uppercase">
                    {user?.username?.[0] || "U"}
                  </div>
                  <div className="text-left text-xs">
                    <span className="block font-semibold leading-tight text-espresso dark:text-linen truncate max-w-[90px]">
                      {user?.username}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  type="button"
                  aria-label="Cerrar sesión"
                  title="Cerrar Sesión"
                  className="p-2.5 rounded-lg border border-border bg-card text-cocoa hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-xs tracking-wide uppercase transition-all min-h-[44px] shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ingresar</span>
              </Link>
            )}

            {/* Hamburguesa */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label={mobileMenuOpen ? "Cerrar menú móvil" : "Abrir menú móvil"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2.5 rounded-lg border border-border bg-card text-espresso dark:text-linen hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Movil Desplegable */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 top-[115px] z-50 bg-background/98 dark:bg-[#18120e]/98 backdrop-blur-lg p-6 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200 flex flex-col justify-between"
        >
          <div className="space-y-5">
            {/* Buscador Móvil */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-camel block mb-2">
                Buscar en Catálogo
              </span>
              <Buscador
                placeholder="Buscar por nombre, madera o estilo..."
                clearOtherFilters
                onSearch={() => setMobileMenuOpen(false)}
              />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-camel block">
              Explorar Catálogo
            </span>
            <div className="space-y-1">
              {categorias.map((cat) => (
                <Link
                  key={cat.nombre}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium text-espresso dark:text-linen hover:bg-muted transition-colors min-h-[48px]"
                >
                  <span>{cat.nombre}</span>
                  <span className="text-camel font-light text-xl">›</span>
                </Link>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-linen dark:bg-card border border-border space-y-2 text-xs">
              <span className="font-bold text-espresso dark:text-linen block uppercase tracking-wider text-[10px]">
                Showroom Río Cuarto
              </span>
              <p className="text-cocoa dark:text-khaki">
                W Tejerina Norte 783, Río Cuarto, Cba.
              </p>
              <p className="text-muted-foreground text-[11px]">
                Lunes a Sábados: 9:00 a 13:00 hs y 16:30 a 20:30 hs
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border space-y-3">
            {isAuth ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-full bg-camel/20 text-cocoa dark:text-camel flex items-center justify-center font-bold text-sm uppercase">
                    {user?.username?.[0] || "U"}
                  </div>
                  <div>
                    <span className="block font-bold text-espresso dark:text-linen">
                      {user?.username}
                    </span>
                    <span className="block text-xs text-muted-foreground uppercase font-mono">
                      {user?.rol || "CLIENTE"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-espresso text-linen dark:bg-camel dark:text-espresso font-medium text-sm min-h-[44px]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 font-medium text-sm min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:text-espresso font-semibold text-sm tracking-wide uppercase shadow-sm min-h-[48px]"
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Navbar Movil */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 dark:bg-[#18120e]/95 backdrop-blur-md border-t border-border py-1.5 px-3 flex items-center justify-around shadow-lg">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] font-medium transition-colors ${
            pathname === "/" ? "text-espresso dark:text-camel font-bold" : "text-muted-foreground hover:text-espresso dark:hover:text-linen"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Inicio</span>
        </Link>
        <Link
          href="/catalogo"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] font-medium transition-colors ${
            pathname.startsWith("/catalogo") ? "text-espresso dark:text-camel font-bold" : "text-muted-foreground hover:text-espresso dark:hover:text-linen"
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>Catálogo</span>
        </Link>
        <Link
          href="/sucursales"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] font-medium transition-colors ${
            pathname === "/sucursales" ? "text-espresso dark:text-camel font-bold" : "text-muted-foreground hover:text-espresso dark:hover:text-linen"
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>Tienda</span>
        </Link>
        <Link
          href={isAuth ? "/dashboard" : "/login"}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] font-medium transition-colors ${
            pathname === "/dashboard" || pathname === "/login" ? "text-espresso dark:text-camel font-bold" : "text-muted-foreground hover:text-espresso dark:hover:text-linen"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>{isAuth ? "Mi Cuenta" : "Ingresar"}</span>
        </Link>
      </div>
    </header>
  );
}

export const BarraNavegacion = Navbar;
export default Navbar;