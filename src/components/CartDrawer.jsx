"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  MapPin,
  FileText,
  Loader2,
  User,
  Phone,
  Mail,
  IdentificationCard,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  pedidosService,
  sucursalesService,
  metodosPagoService,
  usuariosService,
  authService,
} from "@/services/api";

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrecio,
  } = useCart();

  const { token, user, isAuthenticated } = useAuth();
  const toast = useToast();

  // carrito-checkout-exito
  const [paso, setPaso] = useState("carrito");

  // Datos para el formulario de checkout
  const [sucursales, setSucursales] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [sucursalId, setSucursalId] = useState("1");
  const [metodoPagoId, setMetodoPagoId] = useState("1");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  // Datos del comprador invitado 
  const [guestNombre, setGuestNombre] = useState("");
  const [guestDni, setGuestDni] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestTelefono, setGuestTelefono] = useState("");

  // Estado del proceso de pedido
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [resumenPedidoFinal, setResumenPedidoFinal] = useState({
    total: 0,
    itemsCount: 0,
  });

  // Cerrar y restablecer estados
  const handleCerrar = useCallback(() => {
    setPaso("carrito");
    setErrorEnvio("");
    closeCart();
  }, [closeCart]);

  // Cerrar con tecla Escape y bloquear scroll del body
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleCerrar();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleCerrar]);

  // Cargar sucursales, métodos de pago y perfil del usuario al entrar a checkout
  useEffect(() => {
    if (paso !== "checkout") return;

    let isMounted = true;

    async function cargarDatosCheckout() {
      try {
        const [sucData, metData] = await Promise.all([
          sucursalesService.getAll().catch(() => []),
          metodosPagoService.getAll(token).catch(() => []),
        ]);

        if (!isMounted) return;

        if (Array.isArray(sucData) && sucData.length > 0) {
          setSucursales(sucData);
          setSucursalId(String(sucData[0].id));
        }

        if (Array.isArray(metData) && metData.length > 0) {
          const activos = metData.filter((m) => m.activo !== false);
          setMetodosPago(activos.length > 0 ? activos : metData);
          setMetodoPagoId(String((activos[0] || metData[0]).id));
        }

        // Si el usuario está autenticado, pre-cargar su dirección
        if (token) {
          try {
            const perfil = await usuariosService.getPerfil(token);
            if (perfil?.cliente?.direccion && isMounted) {
              setDireccion(perfil.cliente.direccion);
            }
          } catch {
            // No bloqueante
          }
        }
      } catch {
        // Datos por defecto
      }
    }

    cargarDatosCheckout();
    return () => {
      isMounted = false;
    };
  }, [paso, token]);

  if (!isOpen) return null;

  // Iniciar flujo de compra
  const handleIniciarCompra = () => {
    setErrorEnvio("");
    setPaso("checkout");
  };

  // Crear pedido oficial en el backend
  const handleConfirmarPedido = async (e) => {
    e.preventDefault();
    setErrorEnvio("");
    setIsSubmitting(true);

    try {
      let authTokenToUse = token;
      let clienteIdToUse = 1;

      // Si el usuario NO está autenticado
      if (!isAuthenticated || !authTokenToUse) {
        if (!guestNombre.trim()) {
          throw new Error("Por favor ingresá tu nombre y apellido para el pedido.");
        }
        if (!guestDni.trim() || guestDni.replace(/[^0-9]/g, "").length < 7) {
          throw new Error("Por favor ingresá un DNI o CUIT válido (mínimo 7 dígitos).");
        }

        const cleanDni = guestDni.replace(/[^0-9]/g, "");
        const uniqueId = Date.now().toString().slice(-4);
        const partesNombre = guestNombre.trim().split(/\s+/);
        const firstName = partesNombre[0] || guestNombre;
        const lastName = partesNombre.slice(1).join(" ") || "";
        const emailFinal = guestEmail.trim() || `cliente_${cleanDni}_${uniqueId}@homedeco.com`;

        const regData = await authService.register({
          username: `invitado_${cleanDni}_${uniqueId}`,
          email: emailFinal,
          password: `Invitado_${cleanDni}!`,
          dni_cuit: cleanDni,
          first_name: firstName,
          last_name: lastName,
          telefono: guestTelefono.trim() || "",
          direccion: direccion.trim() || "Retiro en Showroom Río Cuarto",
        });

        if (regData?.tokens?.access) {
          authTokenToUse = regData.tokens.access;
          clienteIdToUse = regData.usuario?.cliente_id || 1;
        }
      } else {
        // Usuario ya autenticado
        try {
          const perfil = await usuariosService.getPerfil(token);
          if (perfil?.cliente?.id) {
            clienteIdToUse = perfil.cliente.id;
          }
        } catch {
          clienteIdToUse = 1;
        }
      }

      // Guardar resumen antes de vaciar el carrito
      setResumenPedidoFinal({
        total: totalPrecio,
        itemsCount: totalItems,
      });

      // Crear Pedido y Detalles en el backend
      const resultado = await pedidosService.crearPedidoCompleto(
        {
          clienteId: clienteIdToUse,
          sucursalId: Number(sucursalId) || 1,
          metodoPagoId: Number(metodoPagoId) || 1,
          direccion: direccion.trim() || "Retiro en Showroom Río Cuarto",
          notas: notas.trim() || (guestNombre ? `Pedido de invitado: ${guestNombre}` : "Pedido generado desde la tienda web"),
          items,
        },
        authTokenToUse
      );

      setPedidoConfirmado(resultado);
      clearCart();
      setPaso("exito");
      toast.success(
        `¡Pedido #${resultado.numero_pedido || resultado.id} registrado con éxito!`
      );
    } catch (err) {
      setErrorEnvio(
        err?.message ||
          "No pudimos completar tu pedido en este momento. Por favor intentá nuevamente o coordiná tu compra directamente por WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Construir mensaje de WhatsApp
  const mensajeWhatsApp = (numeroPedido = null) => {
    if (numeroPedido) {
      const sucursalSel = sucursales.find((s) => String(s.id) === String(sucursalId));
      const comprador = guestNombre ? ` a nombre de *${guestNombre}*` : "";
      const texto = `¡Hola Home & Deco! Acabo de registrar el *Pedido #${numeroPedido}*${comprador} en la web por un total de *${formatearPrecio(
        resumenPedidoFinal.total
      )}* (${resumenPedidoFinal.itemsCount} piezas).\n\n• Sucursal: ${
        sucursalSel?.nombre || "Río Cuarto"
      }\n• Dirección/Retiro: ${direccion || "Showroom"}\n\nLes escribo para coordinar los detalles de pago y entrega. ¡Muchas gracias!`;
      return `https://wa.me/5491166681012?text=${encodeURIComponent(texto)}`;
    }

    // Mensaje directo para quien prefiere comprar o consultar por WhatsApp sin registrarse
    const resumenItems = items
      .map(
        (it) =>
          `• ${it.cantidad}x ${it.nombre} (${it.color}) - ${formatearPrecio(it.subtotal)}`
      )
      .join("\n");

    const texto = `Hola Home & Deco! Quiero encargar los siguientes productos de mi carrito:\n\n${resumenItems}\n\n*TOTAL:* ${formatearPrecio(
      totalPrecio
    )}\n\n¿Tienen disponibilidad para coordinar retiro o entrega?`;

    return `https://wa.me/5491166681012?text=${encodeURIComponent(texto)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={handleCerrar}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="relative w-full max-w-md bg-card text-foreground shadow-2xl flex flex-col z-10 border-l border-border animate-in slide-in-from-right duration-300"
      >
        {/* Cabecera del Drawer */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {paso === "checkout" ? (
              <button
                type="button"
                onClick={() => setPaso("carrito")}
                aria-label="Volver al carrito"
                className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="p-2 rounded-xl bg-camel/15 text-cocoa dark:text-camel">
                <ShoppingBag className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-espresso dark:text-linen">
                {paso === "checkout"
                  ? "Finalizar Compra"
                  : paso === "exito"
                  ? "¡Pedido Registrado!"
                  : "Tu Carrito"}
              </h2>
              <span className="text-xs text-muted-foreground font-medium">
                {paso === "checkout"
                  ? isAuthenticated
                    ? `Comprando como ${user?.username || "Usuario"}`
                    : "Compra rápida (sin necesidad de cuenta previa)"
                  : paso === "exito"
                  ? "Orden guardada en el sistema"
                  : `${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}`}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCerrar}
            aria-label="Cerrar carrito"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LISTADO DEL CARRITO */}
        {paso === "carrito" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-linen dark:bg-muted/40 border border-border flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="w-8 h-8 text-camel" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-espresso dark:text-linen">
                      Tu carrito está vacío
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Explorá nuestro catálogo de muebles en maderas nobles para agregar tus piezas preferidas.
                    </p>
                  </div>
                  <Link
                    href="/catalogo"
                    onClick={handleCerrar}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
                  >
                    <span>Ver Catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border/60">
                  {items.map((it) => (
                    <li
                      key={`${it.id}-${it.color}`}
                      className="py-4 first:pt-0 last:pb-0 flex gap-3.5"
                    >
                      {/* Miniatura */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-linen dark:bg-muted/30 border border-border shrink-0">
                        <Image
                          src={it.imagen || "/images/prod-sofa.jpg"}
                          alt={it.nombre}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Datos del producto */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/catalogo/${it.id}`}
                              onClick={handleCerrar}
                              className="font-bold text-sm text-espresso dark:text-linen hover:text-camel transition-colors line-clamp-1"
                            >
                              {it.nombre}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFromCart(it.id, it.color)}
                              aria-label={`Eliminar ${it.nombre}`}
                              className="text-muted-foreground hover:text-red-500 transition-colors p-1 cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-[11px] text-muted-foreground">
                            {it.color && <span className="capitalize">{it.color}</span>}
                            {it.madera && <span> • {it.madera}</span>}
                          </p>
                        </div>

                        {/* Precio y Controles de Cantidad */}
                        <div className="flex items-center justify-between gap-2 pt-2">
                          <div className="flex items-center border border-border rounded-lg bg-linen/50 dark:bg-muted/40">
                            <button
                              type="button"
                              onClick={() => updateQuantity(it.id, it.cantidad - 1, it.color)}
                              aria-label="Disminuir cantidad"
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-l-md transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-foreground min-w-[24px] text-center">
                              {it.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(it.id, it.cantidad + 1, it.color)}
                              disabled={it.stock !== undefined && it.cantidad >= it.stock}
                              aria-label="Aumentar cantidad"
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-r-md transition-colors cursor-pointer disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-extrabold text-sm text-espresso dark:text-linen block">
                              {formatearPrecio(it.subtotal)}
                            </span>
                            {it.cantidad > 1 && (
                              <span className="text-[10px] text-muted-foreground">
                                {it.cantidad} × {formatearPrecio(it.precio)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer del Carrito */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-border bg-linen/40 dark:bg-muted/20 space-y-4">
                {/* Resumen Total */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Subtotal ({totalItems} piezas)</span>
                    <span>{formatearPrecio(totalPrecio)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-extrabold text-espresso dark:text-linen">
                    <span>Total Estimado</span>
                    <span className="text-lg text-espresso dark:text-camel">
                      {formatearPrecio(totalPrecio)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    6 cuotas sin interés de {formatearPrecio(Math.round(totalPrecio / 6))} • Retiro sin cargo en Showroom Río Cuarto
                  </p>
                </div>

                {/* Acciones */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleIniciarCompra}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-bold text-xs uppercase tracking-wider transition-colors shadow-sm min-h-[44px] cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-950" />
                    <span>Finalizar Compra / Registrar Pedido</span>
                  </button>

                  <a
                    href={mensajeWhatsApp()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-cocoa dark:text-khaki transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Comprar directo por WhatsApp (sin formulario)</span>
                  </a>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={clearCart}
                      className="flex-1 py-2 px-3 rounded-xl border border-border bg-card hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      Vaciar carrito
                    </button>
                    <Link
                      href="/catalogo"
                      onClick={handleCerrar}
                      className="flex-1 py-2 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-center text-foreground transition-colors"
                    >
                      Seguir comprando
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* FORMULARIO DE CHECKOUT */}
        {paso === "checkout" && (
          <form
            onSubmit={handleConfirmarPedido}
            className="flex-1 flex flex-col justify-between overflow-y-auto"
          >
            <div className="p-4 sm:p-5 space-y-4">
              {errorEnvio && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorEnvio}</span>
                </div>
              )}

              {/* Si NO está autenticado, solicitar datos mínimos para crear el cliente y la orden */}
              {!isAuthenticated && (
                <div className="p-3.5 rounded-2xl bg-linen/60 dark:bg-muted/40 border border-border space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-camel" />
                    <span className="font-bold text-xs uppercase tracking-wider text-espresso dark:text-linen">
                      Tus Datos de Contacto
                    </span>
                  </div>

                  {/* Nombre y Apellido */}
                  <div className="space-y-1">
                    <label
                      htmlFor="guestNombre"
                      className="block text-[11px] font-semibold text-foreground"
                    >
                      Nombre y Apellido *
                    </label>
                    <input
                      id="guestNombre"
                      type="text"
                      required
                      placeholder="Ej: Lucía Benítez"
                      value={guestNombre}
                      onChange={(e) => setGuestNombre(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-camel"
                    />
                  </div>

                  {/* DNI o CUIT */}
                  <div className="space-y-1">
                    <label
                      htmlFor="guestDni"
                      className="block text-[11px] font-semibold text-foreground"
                    >
                      DNI / CUIT * (para facturación y orden)
                    </label>
                    <input
                      id="guestDni"
                      type="text"
                      required
                      placeholder="Ej: 38123456"
                      value={guestDni}
                      onChange={(e) => setGuestDni(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-camel"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Teléfono */}
                    <div className="space-y-1">
                      <label
                        htmlFor="guestTelefono"
                        className="block text-[11px] font-semibold text-foreground"
                      >
                        Teléfono / WhatsApp
                      </label>
                      <input
                        id="guestTelefono"
                        type="tel"
                        placeholder="0358-154123456"
                        value={guestTelefono}
                        onChange={(e) => setGuestTelefono(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-camel"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label
                        htmlFor="guestEmail"
                        className="block text-[11px] font-semibold text-foreground"
                      >
                        Email (opcional)
                      </label>
                      <input
                        id="guestEmail"
                        type="email"
                        placeholder="lucia@ejemplo.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-camel"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sucursal de Retiro / Despacho */}
              <div className="space-y-1.5">
                <label
                  htmlFor="sucursal"
                  className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-camel" />
                  <span>Punto de Retiro / Despacho</span>
                </label>
                <select
                  id="sucursal"
                  value={sucursalId}
                  onChange={(e) => setSucursalId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-camel min-h-[42px]"
                >
                  {sucursales.length > 0 ? (
                    sucursales.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre} ({s.ciudad})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Sucursal Central Río Cuarto (Alvear 540)</option>
                      <option value="2">Sucursal Córdoba Capital (Av. Colón 1890)</option>
                      <option value="3">Sucursal Villa María (Bv. España 310)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Método de Pago */}
              <div className="space-y-1.5">
                <label
                  htmlFor="metodoPago"
                  className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5 text-camel" />
                  <span>Método de Pago</span>
                </label>
                <select
                  id="metodoPago"
                  value={metodoPagoId}
                  onChange={(e) => setMetodoPagoId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-camel min-h-[42px]"
                >
                  {metodosPago.length > 0 ? (
                    metodosPago.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} ({m.tipo_display || m.tipo})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Transferencia Bancaria (CBU Río Cuarto)</option>
                      <option value="2">Efectivo en Showroom</option>
                      <option value="4">Mercado Pago</option>
                      <option value="5">Tarjeta de Crédito en hasta 6 cuotas</option>
                    </>
                  )}
                </select>
              </div>

              {/* Dirección de Entrega */}
              <div className="space-y-1.5">
                <label
                  htmlFor="direccion"
                  className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-camel" />
                  <span>Dirección de Entrega o Retiro</span>
                </label>
                <input
                  id="direccion"
                  type="text"
                  placeholder="Ej: Av. España 1230 o 'Retiro en Showroom'"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-camel min-h-[42px]"
                />
              </div>

              {/* Notas del Pedido */}
              <div className="space-y-1.5">
                <label
                  htmlFor="notas"
                  className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-camel" />
                  <span>Notas / Aclaraciones (Opcional)</span>
                </label>
                <textarea
                  id="notas"
                  rows={2}
                  placeholder="Ej: Horario de entrega por la tarde, coordinar por WhatsApp."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-camel resize-none"
                />
              </div>

              {/* Resumen Compacto */}
              <div className="p-3.5 rounded-2xl bg-linen/50 dark:bg-muted/30 border border-border space-y-2 text-xs">
                <div className="flex justify-between font-bold text-espresso dark:text-linen">
                  <span>Total a Confirmar ({totalItems} piezas)</span>
                  <span className="text-sm text-camel font-extrabold">{formatearPrecio(totalPrecio)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Al confirmar, se creará la orden oficial en el backend con estado Pendiente de Confirmación.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-border bg-linen/40 dark:bg-muted/20 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-bold text-xs uppercase tracking-wider transition-colors shadow-sm min-h-[44px] cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registrando Pedido en el Servidor...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-950" />
                    <span>Confirmar y Crear Orden Oficial</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaso("carrito")}
                disabled={isSubmitting}
                className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground text-center"
              >
                Volver a revisar artículos
              </button>
            </div>
          </form>
        )}

        {/*PEDIDO EXITOSO */}
        {paso === "exito" && pedidoConfirmado && (
          <div className="flex-1 flex flex-col justify-between p-5 text-center space-y-6 overflow-y-auto">
            <div className="space-y-4 pt-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-camel block">
                  Orden #{pedidoConfirmado.numero_pedido || pedidoConfirmado.id}
                </span>
                <h3 className="text-xl font-extrabold text-espresso dark:text-linen">
                  ¡Pedido Creado con Éxito!
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  La orden ya fue registrada{" "}
                  <strong className="text-foreground">
                    {pedidoConfirmado.estado_display || pedidoConfirmado.estado || "Pendiente"}
                  </strong>.
                </p>
              </div>

              {/* Ficha resumen */}
              <div className="p-4 rounded-2xl bg-linen/50 dark:bg-muted/30 border border-border text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Número Oficial:</span>
                  <strong className="text-espresso dark:text-linen">
                    #{pedidoConfirmado.numero_pedido || pedidoConfirmado.id}
                  </strong>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Monto Total:</span>
                  <strong className="text-camel font-extrabold">
                    {formatearPrecio(resumenPedidoFinal.total)}
                  </strong>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Sucursal:</span>
                  <span className="text-foreground font-medium">
                    {pedidoConfirmado.sucursal_nombre || "Sucursal Río Cuarto"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método de Pago:</span>
                  <span className="text-foreground font-medium">
                    {pedidoConfirmado.metodo_pago_nombre || "Transferencia / Efectivo"}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones de Cierre */}
            <div className="space-y-2.5 pt-4 border-t border-border">
              <a
                href={mensajeWhatsApp(pedidoConfirmado.numero_pedido || pedidoConfirmado.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Coordinar Pedido #{pedidoConfirmado.numero_pedido || pedidoConfirmado.id} por WhatsApp</span>
              </a>

              <Link
                href="/dashboard/pedidos"
                onClick={handleCerrar}
                className="w-full block py-2.5 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-espresso dark:text-linen text-center transition-colors"
              >
                Ver en el Panel de Pedidos
              </Link>

              <button
                type="button"
                onClick={handleCerrar}
                className="w-full py-2 text-xs text-muted-foreground hover:text-foreground text-center"
              >
                Cerrar y seguir explorando la tienda
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
