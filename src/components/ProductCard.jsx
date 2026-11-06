"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Eye, Check } from "lucide-react";
import { Badge } from "@/components/Badge";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export function ProductCard({
  mueble,
  onAddToCart,
  onQuickView,
  priority = false,
  className = "",
}) {
  const initialColor = mueble?.colores?.[0] || "#B2967D";
  const [activeColor, setActiveColor] = useState(initialColor);
  const [agregadoReciente, setAgregadoReciente] = useState(false);
  const { addToCart } = useCart();
  const toast = useToast();

  if (!mueble) return null;

  const {
    id,
    nombre = "Mueble de Diseño",
    categoria = "Living",
    precio,
    cuotas,
    imagen = "/images/prod-sofa.jpg",
    colores = ["#F5F1EA", "#B2967D", "#4A342A"],
    stock,
    madera,
  } = mueble;

  // Formateo de precio si es numerico
  const precioFormateado =
    typeof precio === "number"
      ? new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 0,
        }).format(precio)
      : precio || "$ 0";

  // Calculo de cuotas si no viene provisto
  const cuotasTexto =
    cuotas ||
    (typeof precio === "number"
      ? `6 cuotas sin interés de ${new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 0,
        }).format(Math.round(precio / 6))}`
      : "6 cuotas fijas sin interés");

  return (
    <article
      className={`group flex flex-col rounded-2xl bg-card border border-border/70 hover:border-khaki/80 shadow-2xs hover:shadow-lg transition-all duration-300 p-3.5 sm:p-4 ${className}`}
    >
      {/* Contenedor  */}
      <div className="relative aspect-4/3 w-full bg-linen/85 dark:bg-[#201813] rounded-xl overflow-hidden p-3 flex items-center justify-center transition-colors group-hover:bg-khaki/30 dark:group-hover:bg-[#281e18]">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5 pointer-events-none">
          {stock !== undefined && <Badge stock={stock} size="sm" />}
          {madera && <Badge madera={madera} size="sm" />}
        </div>

        {/* Imagen */}
        <div className="relative w-full h-full">
          <Image
            src={imagen}
            alt={nombre}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center rounded-lg transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* Boton de Vista Rápida */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onQuickView(mueble);
            }}
            aria-label={`Vista rápida de ${nombre}`}
            className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-card/90 dark:bg-card/90 text-foreground hover:bg-card shadow-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center backdrop-blur-xs"
          >
            <Eye className="w-4 h-4 text-espresso dark:text-linen" />
          </button>
        )}
      </div>

      {/* Informacion del Producto */}
      <div className="pt-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold text-cocoa/80 dark:text-camel tracking-wider uppercase">
              {categoria}
            </span>

            {/* Muestras de Color */}
            {colores.length > 0 && (
              <div
                aria-label="Opciones de color disponibles"
                className="flex items-center gap-1 shrink-0 pt-0.5"
              >
                {colores.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveColor(color)}
                    style={{ backgroundColor: color }}
                    aria-label={`Seleccionar variante de color ${idx + 1}`}
                    className={`w-3.5 h-3.5 rounded-full border shadow-2xs transition-transform cursor-pointer ${
                      activeColor === color
                        ? "scale-125 ring-2 ring-camel ring-offset-1 border-white"
                        : "border-black/15 dark:border-white/20 hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <Link href={`/catalogo/${id}`} className="group/link block">
            <h3 className="font-bold text-base text-espresso dark:text-linen group-hover/link:text-cocoa dark:group-hover/link:text-camel transition-colors line-clamp-1 leading-snug">
              {nombre}
            </h3>
          </Link>
        </div>

        {/* Precio y Cuotas */}
        <div>
          <div className="font-extrabold text-lg text-espresso dark:text-linen tracking-tight">
            {precioFormateado}
          </div>
          <div className="text-[11px] text-cocoa/90 dark:text-khaki font-medium line-clamp-1">
            {cuotasTexto}
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-1 flex items-center gap-2">
          <Link
            href={`/catalogo/${id}`}
            className="flex-1 py-2 px-3 rounded-xl border border-khaki hover:border-espresso text-espresso dark:border-border dark:hover:border-camel dark:text-linen text-xs font-semibold text-center hover:bg-linen/50 dark:hover:bg-muted transition-colors min-h-[40px] flex items-center justify-center"
          >
            Ver Detalle
          </Link>

          <button
            type="button"
            disabled={stock === 0}
            onClick={() => {
              if (stock === 0) return;
              if (onAddToCart) {
                onAddToCart(mueble, activeColor);
              } else {
                addToCart(mueble, 1, activeColor);
                toast.success(`"${nombre}" se agregó al carrito de compras.`);
              }
              setAgregadoReciente(true);
              setTimeout(() => setAgregadoReciente(false), 1500);
            }}
            title={stock === 0 ? "Sin stock disponible" : `Agregar ${nombre} al carrito`}
            aria-label={`Agregar ${nombre} al carrito`}
            className={`p-2.5 rounded-xl shadow-2xs transition-all min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
              agregadoReciente
                ? "bg-emerald-600 text-white"
                : "bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso"
            }`}
          >
            {agregadoReciente ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;