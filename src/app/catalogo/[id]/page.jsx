import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { mueblesService } from "@/services/api";
import { Badge } from "@/components/Badge";
import { Alert } from "@/components/Alert";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const producto = await mueblesService.getById(id);
    return {
      title: `${producto?.nombre || "Mueble"} | Home & Deco`,
      description:
        producto?.descripcion?.slice(0, 150) || "Detalle de mueble en Home & Deco.",
    };
  } catch {
    return {
      title: "Mueble de Colección | Home & Deco",
      description: "Detalle de mueble en Home & Deco.",
    };
  }
}

export default async function DetalleProductoPage({ params }) {
  const { id } = await params;
  let producto = null;
  let error = null;

  try {
    producto = await mueblesService.getById(id);
  } catch (err) {
    error = err.message || "No se pudo recuperar la información de este mueble.";
  }

  // Alerta si la API no responde o no se encuentra el mueble
  if (error || !producto) {
    return (
      <div className="w-full bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <Alert
            variant="warning"
            title="Aviso del servidor"
            action={
              <Link
                href="/catalogo"
                className="text-xs font-bold underline hover:opacity-80"
              >
                Volver
              </Link>
            }
          >
            {error || "El producto solicitado no está disponible actualmente."}
          </Alert>

          <div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Catálogo</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Formato de precio en pesos argentinos
  const precioFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(producto.precio || 0);

  const valorCuota = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Math.round((producto.precio || 0) / 6));

  return (
    <div className="w-full bg-background min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Ruta de navegación"
          className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap"
        >
          <Link
            href="/"
            className="hover:text-espresso dark:hover:text-linen transition-colors"
          >
            Inicio
          </Link>
          <span>/</span>
          <Link
            href="/catalogo"
            className="hover:text-espresso dark:hover:text-linen transition-colors"
          >
            Catálogo
          </Link>
          {producto.categoria && (
            <>
              <span>/</span>
              <Link
                href={`/catalogo?categoria=${encodeURIComponent(producto.categoria)}`}
                className="hover:text-espresso dark:hover:text-linen transition-colors"
              >
                {producto.categoria}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-espresso dark:text-linen font-semibold truncate max-w-[220px]">
            {producto.nombre}
          </span>
        </nav>

        {/* Botón volver */}
        <div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cocoa dark:text-camel hover:text-espresso dark:hover:text-linen transition-colors min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al catálogo</span>
          </Link>
        </div>

        {/* Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-start">
          {/* Imagen */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden bg-linen dark:bg-card border border-border shadow-md">
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <Badge stock={producto.stock} />
                {producto.material && <Badge madera={producto.material} />}
              </div>

              <Image
                src={producto.imagen}
                alt={producto.nombre}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-card border border-border text-center space-y-1 shadow-2xs">
                <Truck className="w-5 h-5 mx-auto text-camel" />
                <span className="text-[11px] font-bold block text-espresso dark:text-linen">
                  Envío a Todo el País
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Logística propia
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border text-center space-y-1 shadow-2xs">
                <CreditCard className="w-5 h-5 mx-auto text-camel" />
                <span className="text-[11px] font-bold block text-espresso dark:text-linen">
                  6 Cuotas Sin Interés
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Todas las tarjetas
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border text-center space-y-1 shadow-2xs">
                <ShieldCheck className="w-5 h-5 mx-auto text-camel" />
                <span className="text-[11px] font-bold block text-espresso dark:text-linen">
                  Garantía 5 Años
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Maderas seleccionadas
                </span>
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-6">
            <div className="space-y-2">
              {producto.categoria && (
                <span className="text-xs uppercase tracking-widest text-camel font-bold block">
                  {producto.categoria}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-espresso dark:text-linen tracking-tight">
                {producto.nombre}
              </h1>
            </div>

            {/* Tarjeta de Precio */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-2xs">
              <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">
                Precio contado / transferencia
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-espresso dark:text-linen tracking-tight">
                {precioFormateado}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-camel">
                <Sparkles className="w-4 h-4" />
                <span>6 cuotas sin interés de {valorCuota}</span>
              </div>
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-espresso dark:text-linen">
                  Descripción
                </h3>
                <p className="text-sm text-cocoa/90 dark:text-khaki leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>
            )}

            {/* Ficha Técnica */}
            <div className="space-y-3 border-t border-border pt-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-espresso dark:text-linen">
                Ficha Técnica
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {producto.dimensiones && (
                  <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/40 border border-border">
                    <dt className="text-muted-foreground font-medium">Dimensiones</dt>
                    <dd className="font-semibold text-espresso dark:text-linen mt-0.5">
                      {producto.dimensiones}
                    </dd>
                  </div>
                )}
                {producto.material && (
                  <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/40 border border-border">
                    <dt className="text-muted-foreground font-medium">Material</dt>
                    <dd className="font-semibold text-espresso dark:text-linen mt-0.5">
                      {producto.material}
                    </dd>
                  </div>
                )}
                {producto.color && (
                  <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/40 border border-border">
                    <dt className="text-muted-foreground font-medium">Tono / Acabado</dt>
                    <dd className="font-semibold text-espresso dark:text-linen mt-0.5">
                      {producto.color}
                    </dd>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/40 border border-border">
                  <dt className="text-muted-foreground font-medium">Stock en Depósito</dt>
                  <dd className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {producto.stock > 0
                        ? `${producto.stock} unidades listas para entrega`
                        : "Agotado temporalmente"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Botones de Acción */}
            <div className="pt-4 space-y-3">
              <a
                href={`https://wa.me/5491166681012?text=${encodeURIComponent(
                  `Hola Home & Deco! Quiero consultar por el mueble: ${producto.nombre} (ID: ${producto.id})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-bold text-sm uppercase tracking-wider transition-all shadow-md min-h-[48px]"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 dark:text-emerald-900" />
                <span>Consultar por WhatsApp</span>
              </a>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-linen dark:bg-muted border border-border hover:bg-espresso hover:text-linen dark:hover:bg-camel dark:hover:text-espresso text-xs font-bold text-foreground uppercase tracking-wider transition-colors min-h-[44px] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </button>

                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center py-3 px-4 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors min-h-[44px]"
                >
                  Seguir Explorando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
