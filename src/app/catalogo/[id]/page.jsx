import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  CreditCard,
  Phone,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

const PRODUCTOS_DETALLE = [
  {
    id: "1",
    nombre: "Sofá Extensible 3c Beyond",
    categoria: "Living",
    categoria_nombre: "Living & Sala",
    descripcion:
      "Diseñado para quienes buscan comodidad absoluta sin perder sofisticación. Estructura construida en madera maciza de paraíso estacionado, uniones reforzadas con espigas y encolado náutico. Almohadones rellenos de vellón siliconado soft con memoria elástica y tapizado desmontable en lino natural con tratamiento antimanchas Teflon™.",
    precio: 385000,
    cuotas: "6 cuotas fijas de $ 64.166 sin interés",
    stock: 8,
    dimensiones: "2.20m ancho x 0.95m profundidad (extensible a 1.45m) x 0.85m alto",
    material: "Madera maciza de Paraíso seleccionado y tela de lino natural",
    garantia: "5 años de garantía estructural",
    imagen: "/images/prod-sofa.jpg",
  },
  {
    id: "2",
    nombre: "Silla Vivire S01 Paraíso",
    categoria: "Comedor",
    categoria_nombre: "Comedores",
    descripcion:
      "Una silla ergonómica inspirada en la tradición escandinava. Su respaldo moldeado al vapor acompaña de forma natural la curvatura lumbar, permitiendo sobremesas largas y cómodas. Asiento tapizado en bouclé premium de alta resistencia al roce (40.000 ciclos Martindale).",
    precio: 78000,
    cuotas: "6 cuotas fijas de $ 13.000 sin interés",
    stock: 24,
    dimensiones: "0.52m ancho x 0.50m profundidad x 0.82m alto (asiento a 0.46m)",
    material: "Madera maciza de Paraíso y tapizado bouclé crudo",
    garantia: "3 años de garantía oficial",
    imagen: "/images/prod-silla.jpg",
  },
  {
    id: "3",
    nombre: "Mesa Comedor Extensible C01",
    categoria: "Comedor",
    categoria_nombre: "Comedores",
    descripcion:
      "El punto de encuentro de tu hogar. Mesa maciza en madera de petiribí de veta continua. Sistema de extensión telescópico alemán suave que pasa de 1.60m a 2.10m en segundos, permitiendo sentar de 6 a 10 comensales cómodamente. Terminación con hidrolaca poliuretánica mate resistente al calor y a líquidos.",
    precio: 460000,
    cuotas: "6 cuotas fijas de $ 76.666 sin interés",
    stock: 5,
    dimensiones: "1.60m a 2.10m largo x 0.90m ancho x 0.77m alto",
    material: "Petiribí macizo de primera selección",
    garantia: "10 años de garantía estructural",
    imagen: "/images/prod-mesa.jpg",
  },
  {
    id: "4",
    nombre: "Escritorio Elevable Altura Pro",
    categoria: "Oficina",
    categoria_nombre: "Home Office",
    descripcion:
      "La estación de trabajo ergonómica definitiva. Tapa en una sola pieza de madera maciza tratada al aceite vegetal. Cuenta con ranura pasacables oculta con tapa imantada y chasis de acero estructural con terminación epoxi electrostático microtexturado.",
    precio: 295000,
    cuotas: "6 cuotas fijas de $ 49.166 sin interés",
    stock: 11,
    dimensiones: "1.40m ancho x 0.70m profundidad x 0.75m alto",
    material: "Paraíso macizo y acero estructural",
    garantia: "3 años de garantía",
    imagen: "/images/prod-escritorio.jpg",
  },
];

async function obtenerProducto(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/productos/${id}/`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback local
  }

  const encontrado = PRODUCTOS_DETALLE.find((p) => p.id === String(id));
  if (encontrado) return encontrado;

  // Si id no coincide exactamente, podemos devolver un modelo genérico con ese id para demo
  return {
    id,
    nombre: `Mueble de Diseño #${id}`,
    categoria: "Living",
    categoria_nombre: "Colección Home & Deco",
    descripcion:
      "Pieza exclusiva de mobiliario artesanal fabricada con maderas nobles argentinas seleccionadas.",
    precio: 250000,
    cuotas: "6 cuotas fijas sin interés",
    stock: 6,
    dimensiones: "Medidas personalizables a pedido",
    material: "Paraíso o Petiribí macizo",
    garantia: "5 años de garantía estructural",
    imagen: "/images/prod-sofa.jpg",
  };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const prod = await obtenerProducto(id);
  return {
    title: `${prod?.nombre || "Mueble"} | Home & Deco`,
    description: prod?.descripcion?.slice(0, 150) || "Detalle de mueble en Home & Deco.",
  };
}

export default async function DetalleProductoPage({ params }) {
  const { id } = await params;
  const prod = await obtenerProducto(id);

  if (!prod) {
    notFound();
  }

  return (
    <div className="w-full bg-background min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb con Next.js Link */}
        <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
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
          {prod.categoria && (
            <>
              <span>/</span>
              <Link
                href={`/catalogo?categoria=${encodeURIComponent(prod.categoria)}`}
                className="hover:text-espresso dark:hover:text-linen transition-colors"
              >
                {prod.categoria_nombre || prod.categoria}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-espresso dark:text-linen font-semibold truncate max-w-[200px]">
            {prod.nombre}
          </span>
        </nav>

        {/* Botón volver */}
        <div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cocoa dark:text-camel hover:text-espresso dark:hover:text-linen transition-colors min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al catálogo completo</span>
          </Link>
        </div>

        {/* Contenido Principal: 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-start">
          {/* Columna Imagen */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden bg-linen dark:bg-espresso/20 border border-border shadow-md">
              {prod.imagen ? (
                <Image
                  src={prod.imagen}
                  alt={prod.nombre}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">
                  🪑
                </div>
              )}

              <span className="absolute top-4 left-4 bg-card/90 backdrop-blur-md border border-border text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen px-3 py-1.5 rounded-lg shadow-xs">
                {prod.categoria_nombre || prod.categoria}
              </span>
            </div>

            {/* Badges de Compromiso */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-card border border-border text-center space-y-1">
                <Truck className="w-5 h-5 mx-auto text-camel" />
                <span className="text-[11px] font-bold block text-espresso dark:text-linen">
                  Envío a Todo el País
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Logística especializada
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border text-center space-y-1">
                <CreditCard className="w-5 h-5 mx-auto text-camel" />
                <span className="text-[11px] font-bold block text-espresso dark:text-linen">
                  6 Cuotas Sin Interés
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Con tarjetas bancarias
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border text-center space-y-1">
                <ShieldCheck className="w-5 h-5 mx-auto text-camel" />
                <span className="text-[11px] font-bold block text-espresso dark:text-linen">
                  Garantía de Fábrica
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Maderas estacionadas
                </span>
              </div>
            </div>
          </div>

          {/* Columna Detalles */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-camel font-bold block">
                {prod.categoria_nombre || prod.categoria}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-espresso dark:text-linen tracking-tight">
                {prod.nombre}
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Código de producto: HD-{prod.id}
              </p>
            </div>

            {/* Precio */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-2xs">
              <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">
                Precio de contado / transferencia
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-espresso dark:text-linen tracking-tight">
                ${Number(prod.precio || 0).toLocaleString("es-AR")}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-camel">
                <Sparkles className="w-4 h-4" />
                <span>{prod.cuotas || "Hasta 6 cuotas sin interés con todas las tarjetas"}</span>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-espresso dark:text-linen">
                Descripción & Características
              </h3>
              <p className="text-sm text-cocoa/90 dark:text-khaki leading-relaxed">
                {prod.descripcion}
              </p>
            </div>

            {/* Ficha Técnica */}
            <div className="space-y-3 border-t border-border pt-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-espresso dark:text-linen">
                Especificaciones
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {prod.dimensiones && (
                  <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/40 border border-border">
                    <dt className="text-muted-foreground font-medium">Dimensiones</dt>
                    <dd className="font-semibold text-espresso dark:text-linen mt-0.5">
                      {prod.dimensiones}
                    </dd>
                  </div>
                )}
                {prod.material && (
                  <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/40 border border-border">
                    <dt className="text-muted-foreground font-medium">Materiales</dt>
                    <dd className="font-semibold text-espresso dark:text-linen mt-0.5">
                      {prod.material}
                    </dd>
                  </div>
                )}
                {prod.garantia && (
                  <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/40 border border-border">
                    <dt className="text-muted-foreground font-medium">Garantía</dt>
                    <dd className="font-semibold text-espresso dark:text-linen mt-0.5">
                      {prod.garantia}
                    </dd>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/40 border border-border">
                  <dt className="text-muted-foreground font-medium">Disponibilidad</dt>
                  <dd className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{prod.stock ? `${prod.stock} unidades en stock` : "Entrega inmediata"}</span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Botones de Acción */}
            <div className="pt-4 space-y-3">
              <a
                href={`https://wa.me/5491166681012?text=${encodeURIComponent(
                  `Hola Home & Deco! Quiero consultar por el mueble: ${prod.nombre} (ID: ${prod.id})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-bold text-sm uppercase tracking-wider transition-all shadow-md min-h-[48px]"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 dark:text-emerald-900" />
                <span>Consultar por WhatsApp con un Asesor</span>
              </a>

              <div className="flex gap-3">
                <Link
                  href="/sucursales"
                  className="flex-1 inline-flex items-center justify-center py-3 px-4 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors min-h-[44px]"
                >
                  Ver Showroom Río Cuarto
                </Link>
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
