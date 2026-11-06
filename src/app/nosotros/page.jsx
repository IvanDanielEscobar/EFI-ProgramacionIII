import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  TreePine,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Store,
  Compass,
} from "lucide-react";

export const metadata = {
  title: "Sobre Nosotros | Home & Deco",
  description:
    "Conocé la historia, el oficio y los valores de Home & Deco: carpintería contemporánea, maderas nobles y diseño cálido para toda la vida.",
};

const VALORES = [
  {
    icono: TreePine,
    titulo: "Maderas Nobles & Reforestadas",
    descripcion:
      "Seleccionamos exclusivamente maderas autóctonas y de manejo forestal responsable: Paraíso, Petiribí y Pino Elliotis macizo con secado en horno para garantizar estabilidad a lo largo de las décadas.",
  },
  {
    icono: Compass,
    titulo: "Diseño Atemporal & Funcional",
    descripcion:
      "Nos inspiramos en la calidez del estilo nórdico y la serenidad de la estética Japandi. Muebles pensados para convivir armónicamente con tus espacios diarios sin pasar de moda.",
  },
  {
    icono: ShieldCheck,
    titulo: "Construcción Estructural Garantizada",
    descripcion:
      "Cada unión, espiga y ensamble es realizado por maestros carpinteros. Aplicamos hidrolacas poliuretánicas de base acuosa, seguras para el hogar y de máxima resistencia al uso diario.",
  },
  {
    icono: HeartHandshake,
    titulo: "Cercanía & Asesoramiento Directo",
    descripcion:
      "Desde nuestro Showroom en Río Cuarto, te asesoramos en medidas, telas antimanchas y distribución para que tomes la mejor decisión para tu casa.",
  },
];

export default function NosotrosPage() {
  return (
    <div className="w-full bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Nosotros */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-camel/15 text-camel text-xs font-bold uppercase tracking-widest border border-camel/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nuestra Historia & Propósito</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Creamos muebles con alma, calidez y memoria
          </h1>
          <p className="text-base sm:text-lg text-cocoa/80 dark:text-khaki leading-relaxed">
            En Home &amp; Deco creemos que un mueble no es un objeto pasajero:
            es el escenario donde se comparte una cena en familia, las tardes de
            café y las historias que van definiendo tu hogar.
          </p>
        </section>

        {/* Sección Visual y Manifiesto */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-linen dark:bg-card border border-border shadow-md">
            <Image
              src="/images/showroom.jpg"
              alt="Showroom y taller de Home & Deco en Río Cuarto"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs font-bold text-camel uppercase tracking-widest block">
              Desde el corazón de Córdoba
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
              De Río Cuarto a cada rincón de Argentina
            </h2>
            <div className="space-y-4 text-sm text-cocoa/90 dark:text-khaki leading-relaxed">
              <p>
                Nacimos con una convicción clara: recuperar la nobleza de la
                madera maciza y acercarla al diseño contemporáneo accesible.
                Trabajamos de la mano de artesanos y diseñadores que cuidan cada
                veta, cada lija y cada detalle de confección.
              </p>
              <p>
                Hoy combinamos técnicas tradicionales de encastre con cortes de
                precisión para lograr muebles robustos, cómodos y de líneas
                despojadas que transmiten paz visual.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-xs tracking-wider uppercase transition-all shadow-xs min-h-[44px]"
              >
                <span>Explorar Colecciones</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sucursales"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted font-semibold text-xs text-foreground transition-colors min-h-[44px]"
              >
                <Store className="w-4 h-4 text-camel" />
                <span>Visitar Showroom</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-camel uppercase tracking-widest">
              Nuestros Pilares
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-espresso dark:text-linen">
              ¿Por qué elegir Home &amp; Deco?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALORES.map((v, i) => {
              const Icono = v.icono;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-card border border-border shadow-2xs space-y-4 hover:border-camel/60 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-camel/15 flex items-center justify-center text-camel">
                    <Icono className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-espresso dark:text-linen">
                    {v.titulo}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {v.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cita de Cierre */}
        <section className="p-8 sm:p-12 rounded-3xl bg-linen/60 dark:bg-card border border-border text-center max-w-4xl mx-auto space-y-4">
          <p className="text-lg sm:text-xl font-serif italic text-espresso dark:text-linen">
            &ldquo;Un buen mueble no se impone en el espacio; lo abraza, lo calma
            y permanece como testigo de los mejores momentos de tu vida.&rdquo;
          </p>
          <span className="text-xs font-bold uppercase tracking-wider text-camel block">
            — Equipo de Diseño Home &amp; Deco Río Cuarto
          </span>
        </section>
      </div>
    </div>
  );
}

