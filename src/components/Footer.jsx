import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Clock, Phone, ArrowUpRight, ShieldCheck, Truck, CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card text-foreground mt-auto transition-colors duration-200 pb-16 lg:pb-0">
      {/* Publicidad */}
      <div className="border-b border-border/60 bg-linen/50 dark:bg-[#18120e]/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-camel/15 dark:bg-card flex items-center justify-center shrink-0 border border-khaki/40 dark:border-border">
              <Truck className="w-5 h-5 text-cocoa dark:text-camel" />
            </div>
            <div>
              <h5 className="font-bold text-sm tracking-tight text-espresso dark:text-linen">
                Envíos a Todo el País
              </h5>
              <p className="text-xs text-muted-foreground">
                Coordinación logística y retiro gratis en Río Cuarto.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-camel/15 dark:bg-card flex items-center justify-center shrink-0 border border-khaki/40 dark:border-border">
              <CreditCard className="w-5 h-5 text-cocoa dark:text-camel" />
            </div>
            <div>
              <h5 className="font-bold text-sm tracking-tight text-espresso dark:text-linen">
                Financiación en Cuotas
              </h5>
              <p className="text-xs text-muted-foreground">
                Hasta 6 cuotas sin interés en muebles seleccionados.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-camel/15 dark:bg-card flex items-center justify-center shrink-0 border border-khaki/40 dark:border-border">
              <ShieldCheck className="w-5 h-5 text-cocoa dark:text-camel" />
            </div>
            <div>
              <h5 className="font-bold text-sm tracking-tight text-espresso dark:text-linen">
                Garantía de calidad
              </h5>
              <p className="text-xs text-muted-foreground">
                Maderas seleccionadas (Paraíso, Petiribí y Pino Macizo).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cuerpo del Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-14">
          {/* Identidad */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-linen dark:bg-card p-1 border border-khaki/50 dark:border-border shrink-0 shadow-2xs">
                <Image
                  src="/logo-icon.jpg"
                  alt="Home & Deco"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-wider block text-espresso dark:text-linen">
                  HOME & DECO
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-camel font-semibold block">
                  Mueblería & Diseño
                </span>
              </div>
            </Link>
            <p className="text-sm text-cocoa/90 dark:text-khaki max-w-md leading-relaxed">
              Mueblería contemporánea inspirada en la nobleza de las maderas argentinas y el minimalismo arquitectónico. Creamos piezas duraderas pensadas para disfrutarla todos los días.
            </p>
          </div>

          {/* Navegacion */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-camel">
              Colecciones
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/catalogo?categoria=Living"
                  className="text-cocoa/90 dark:text-khaki hover:text-espresso dark:hover:text-linen transition-colors"
                >
                  Living & Sofás
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?categoria=Comedor"
                  className="text-cocoa/90 dark:text-khaki hover:text-espresso dark:hover:text-linen transition-colors"
                >
                  Comedores & Sillas
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?categoria=Dormitorio"
                  className="text-cocoa/90 dark:text-khaki hover:text-espresso dark:hover:text-linen transition-colors"
                >
                  Dormitorio & Respaldos
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?categoria=Oficina"
                  className="text-cocoa/90 dark:text-khaki hover:text-espresso dark:hover:text-linen transition-colors"
                >
                  Home Office
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo"
                  className="text-espresso dark:text-camel hover:underline transition-colors flex items-center gap-1 font-semibold text-xs tracking-wide uppercase pt-1"
                >
                  <span>Ver todo el catálogo</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom y Contacto */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-camel">
              Nuestra Tienda
            </h4>
            <ul className="space-y-3 text-xs text-cocoa/90 dark:text-khaki">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-camel shrink-0 mt-0.5" />
                <span>W Tejerina Norte 783, Río Cuarto, Córdoba, Argentina</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-camel shrink-0" />
                <span>+54 (11) 6668-1012</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-camel shrink-0" />
                <span>contacto@homedeco.com.ar</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-camel shrink-0 mt-0.5" />
                <span>Lun a Sáb: 9:00 a 13:00 hs | 16:30 a 20:30 hs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;