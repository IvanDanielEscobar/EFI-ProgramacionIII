"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, MessageCircle, Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export function DetalleAcciones({ producto }) {
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const { addToCart, openCart } = useCart();
  const toast = useToast();

  if (!producto) return null;

  const stockDisponible = Number(producto.stock) || 0;
  const sinStock = stockDisponible <= 0;

  const handleIncrement = () => {
    if (cantidad < stockDisponible) {
      setCantidad((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (cantidad > 1) {
      setCantidad((prev) => prev - 1);
    }
  };

  const handleAgregar = () => {
    if (sinStock) return;

    addToCart(producto, cantidad);
    toast.success(
      `Agregaste ${cantidad} ${cantidad === 1 ? "unidad" : "unidades"} de "${producto.nombre}" al carrito.`
    );
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2500);
  };

  const urlWhatsApp = `https://wa.me/5491166681012?text=${encodeURIComponent(
    `Hola Home & Deco! Quiero consultar por ${cantidad} unidad(es) del mueble: ${producto.nombre} (ID: ${producto.id})`
  )}`;

  return (
    <div className="pt-4 space-y-4">
      {/* Selector de Cantidad y Botón de Carrito */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {/* Selector de cantidad */}
        {!sinStock && (
          <div className="flex items-center justify-between sm:justify-center border border-border rounded-xl bg-card px-3 py-2 min-h-[44px]">
            <span className="text-xs text-muted-foreground mr-3 sm:hidden font-medium">
              Cantidad:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={cantidad <= 1}
                aria-label="Restar una unidad"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-extrabold text-foreground">
                {cantidad}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={cantidad >= stockDisponible}
                aria-label="Sumar una unidad"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Agregar al Carrito */}
        <button
          type="button"
          onClick={agregado ? openCart : handleAgregar}
          disabled={sinStock}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all min-h-[44px] cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${
            sinStock
              ? "bg-muted text-muted-foreground"
              : agregado
              ? "bg-emerald-600 text-white"
              : "bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso"
          }`}
        >
          {sinStock ? (
            <span>Sin Stock Disponible</span>
          ) : agregado ? (
            <>
              <Check className="w-4 h-4" />
              <span>¡Agregado! Ver Carrito</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar al Carrito</span>
            </>
          )}
        </button>
      </div>

      {/* Consultar por WhatsApp */}
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-linen hover:bg-linen/70 dark:bg-muted/50 dark:hover:bg-muted border border-border text-espresso dark:text-linen font-bold text-xs uppercase tracking-wider transition-all shadow-2xs min-h-[44px]"
      >
        <MessageCircle className="w-4 h-4 text-emerald-500" />
        <span>Consultar disponibilidad por WhatsApp</span>
      </a>

      {/* Seguir Explorando */}
      <div className="pt-1">
        <Link
          href="/catalogo"
          className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors min-h-[40px]"
        >
          ← Seguir explorando el catálogo
        </Link>
      </div>
    </div>
  );
}

