"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

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

  // Cerrar con tecla Escape y bloquear scroll del body
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeCart();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  // Construir mensaje de WhatsApp con los artículos del carrito
  const mensajeWhatsApp = () => {
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
        onClick={closeCart}
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
        <div className="p-5 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-camel/15 text-cocoa dark:text-camel">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-espresso dark:text-linen">
                Tu Carrito
              </h2>
              <span className="text-xs text-muted-foreground font-medium">
                {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido / Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                onClick={closeCart}
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
                          onClick={closeCart}
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

        {/* Footer del Drawer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border bg-linen/40 dark:bg-muted/20 space-y-4">
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
              <a
                href={mensajeWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-bold text-xs uppercase tracking-wider transition-colors shadow-sm min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-950" />
                <span>Confirmar Pedido por WhatsApp</span>
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="flex-1 py-2 px-3 rounded-xl border border-border bg-card hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold text-muted-foreground hover:text-red-600 transition-colors"
                >
                  Vaciar carrito
                </button>
                <Link
                  href="/catalogo"
                  onClick={closeCart}
                  className="flex-1 py-2 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-center text-foreground transition-colors"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

